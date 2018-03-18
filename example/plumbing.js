import { Observable } from "rxjs";
import React from "React";
import ReactDOMServer from "react-dom/server";

const now = () => "[" + new Date().toISOString() + "]";
const next = arg => console.log(now(), arg);
const error = arg => console.error("ERR!", now(), arg);
const complete = obs => () => console.log(obs, "Done!");

const packages = [
  {
    name: "universe 1",
    url: "p1.hamburg",
    priority: 0
  },
  {
    name: "universe 2",
    url: "p2.hamburg",
    priority: 1
  },
  {
    name: "universe 3",
    url: "p3.hamburg",
    priority: 2
  }
];

// with the string render we cannot put async here
const packageStream = Observable.of(packages);
//.concatMap(value => Observable.of(value).delay(500))
//.scan((acc, item) => acc.concat(item), []);

const renderToConsoleTimes = (component, times, delay = 500) => {
  const renderComponentToString = () =>
    ReactDOMServer.renderToString(component);

  Observable.range(0, times)
    .concatMap(value => Observable.of(value).delay(delay))
    .map(value => [value, renderComponentToString()])
    .subscribe(next, error, complete("render"));
};

export { packageStream, renderToConsoleTimes, next, error, complete };

// https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/perf/operators/repeat.js
// https://github.com/apollographql/apollo-link-state/blob/master/packages/apollo-link-state/src/utils.ts
// https://github.com/apollographql/apollo-link-state/blob/master/packages/apollo-link-state/src/index.ts
// https://dev-blog.apollodata.com/simplify-your-react-components-with-apollo-and-recompose-8b9e302dea51
