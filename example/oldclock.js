import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { SchemaLink } from "apollo-link-schema";
import { makeExecutableSchema, addMockFunctionsToSchema } from "graphql-tools";
import gql from "graphql-tag";
import Rx from "rxjs";
import { setInterval } from "timers";

// Side effect: Adds methods to Rx.Observable prototype.
require("rxjs-to-async-iterator");

const clockSource = Rx.Observable.interval(1000)
  .map(() => new Date().toISOString())
  .publishReplay(1)
  .refCount();

const typeDefs = `
    # Root Query
    type Query {
      clock: String
    }

    # Root Subscription
    type Subscription {
      clock: String
    }
`;

const resolvers = {
  Query: {
    clock(root, args, ctx, info) {
      return clockSource.take(1).toPromise();
    }
  },
  Subscription: {
    clock: () => clockSource.subscribe()
  }
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

const apolloCache = new InMemoryCache();

const graphqlClient = new ApolloClient({
  cache: apolloCache,
  link: new SchemaLink({ schema })
});

// subscribe the clock
const query = gql`
  query {
    clock
  }
`;

const graphql = (client, query, mode = "query") => {
  if (mode === "live") {
    const queryRes = client.watchQuery({ query });

    let _done;
    queryRes.unsubscribe = () => {
      _done();
    };

    const _subscribe = queryRes.subscribe.bind(queryRes);
    queryRes.subscribe = (next, error, done) => {
      _done = done;
      _subscribe(next);
    };

    return queryRes;
  }

  if (mode === "subscribe") {
    const queryRes = client.watchQuery({ query }, true);

    const subscription = resolvers.Subscription.clock();

    let _done;
    queryRes.startPolling(1000);
    queryRes.unsubscribe = () => {
      subscription.unsubscribe();
      queryRes.stopPolling();
      _done();
    };

    const _subscribe = queryRes.subscribe.bind(queryRes);
    queryRes.subscribe = (next, error, done) => {
      _done = done;
      _subscribe(next);
    };

    return queryRes;
  }

  return Rx.Observable.fromPromise(client.query({ query }));
};

// //Query
graphql(graphqlClient, query).subscribe(
  data => {
    console.log("query", data.data);
  },
  console.error.bind(this),
  () => console.log("query done")
);

// Live Query
graphql(graphqlClient, query, "live").subscribe(
  data => {
    console.log("live", data.data);
  },
  console.error.bind(this),
  () => console.log("live done")
);

// Subscription
const obs = graphql(graphqlClient, query, "subscribe");

let count = 0;
obs.subscribe(
  data => {
    console.log("subscribe", data.data);
    count += 1;
    if (count === 3) {
      obs.unsubscribe();
    }
  },
  console.error.bind(this),
  () => console.log("subscribe done")
);
