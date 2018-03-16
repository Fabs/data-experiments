import { Observable } from "rxjs";
import React from "React";
import ReactDOMServer from "react-dom/server";

const now = () => "[" + new Date().toISOString() + "]";
const next = arg => console.log(now(), arg);
const error = arg => console.error("ERR!", now(), arg);
const complete = obs => () => console.log(obs, "Done!");

const packages = [
  { name: "universe 1", url: "p1.hamburg", priority: 0 },
  { name: "universe 2", url: "p2.hamburg", priority: 1 }
];

const packageStream = Observable.from(packages);

const renderToConsoleTimes = (component, times, delay = 500) => {
  const renderComponentToString = () =>
    ReactDOMServer.renderToString(component);

  Observable.range(0, 10)
    .concatMap(value => Observable.of(value).delay(delay))
    .map(value => [value, renderComponentToString()])
    .subscribe(next, error, complete("render"));
};

export { packageStream, renderToConsoleTimes, next, error, complete };
