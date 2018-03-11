import { Observable } from 'rxjs';
import { makeExecutableSchema } from 'graphql-tools';
import { prepareSchema, graphqlRx, subscribe } from 'graphql-rxjs';
import { graphql } from 'graphql-rxjs';
import gql from 'graphql-tag';

const clockSource = Observable.interval(1000).map(() => new Date()).publishReplay(1).refCount();

const typeDefs = `
# Root Query
type Query {
  someInt: Int
}

# Root Subscription
type Subscription {
  clock: String
}
`;

const resolvers = {
    Subscription: {
        clock(root, args, ctx) {
            return ctx.clockSource.repeat(-1);
        },
    },
};

// Compose togather resolver and typeDefs.
const scheme = makeExecutableSchema({typeDefs: typeDefs, resolvers: resolvers});
prepareSchema(scheme);

// subscribe the clock
const query = `
  subscription {
	clock
  }
`

// Calling the reactive version of graphql
// graphqlRx or subscribeRx or executeRx does not work either
graphql(scheme, query, null, { clockSource }).then(console.log.bind(console));
subscribe(scheme, query, null, { clockSource }).then(console.log.bind(console));

// From readme here
// https://github.com/DxCx/graphql-rxjs