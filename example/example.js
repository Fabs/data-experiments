// PLUMBING

import { Observable } from "rxjs";
const packages = [
  { name: "universe 1", url: "p1.hamburg", priority: 0 },
  { name: "universe 2", url: "p2.hamburg", priority: 1 }
];

const packageStream = Observable.from(packages);

import React from "React";
import ReactDOMServer from "react-dom/server";

const renderToConsoleTimes = (component, times, delay = 500) => {
  const renderComponentToString = () =>
    ReactDOMServer.renderToString(component);

  Observable.range(0, 10)
    .concatMap(value => Observable.of(value).delay(delay))
    .map(value => [value, renderComponentToString()])
    .subscribe(next, error, complete("render"));
};

// -------------------------------------------------------

// utils
const now = () => "[" + new Date().toISOString() + "]";
const next = arg => console.log(now(), arg);
const error = arg => console.error("ERR!", now(), arg);
const complete = obs => () => console.log(obs, "Done!");

// 🔎 Newtork Stream Adaptor
// 🔎 Network Protocol
// 🔎 Model Cache
// 🔎 Model Filtering
// 🔎 Model Validation
// 🔎 Model Subscription
// 🔎 Model Mutation

// 👷 v0.1 Model Query Live
// NOTE This should become graphql, as it its does not make part of the api
const importantQuery = source => source.filter(pkg => pkg.priority < 1);
const allPackages = source => source;

// v0.1 Model Schema
import { observableSource } from "./data-service";

const packageSource = observableSource(packageStream);
// NOTE: For graphql it is really like
// const packageSource = graphqlSource(packageSchema);

// 🔎 Mediator class
// 🔎 Mediator API
// 🔎 Medtiador React State API (loading, error)

// ✅ v0.1 Mediator observer API
import { observe } from "./data-service";

observe(packageSource, {
  importantQuery,
  allPackages
}).subscribe(next, error, complete("obs1"));

// 👷 v0.1 Mediator React API

// The way this component receives data is part of the api;
const PackageList = ({ packages }) => {
  return React.createElement(
    "ul",
    null,
    packages.map((pkg, i) => React.createElement("li", { key: i }, pkg.name))
  );
};

const PackagesPage = observe(packageSource, {
  importantQuery,
  packages: allPackages
}).react(PackageList);

renderToConsoleTimes(PackagesPage, 2);
