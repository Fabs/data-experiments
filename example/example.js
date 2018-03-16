import { next, error, complete } from "./plumbing";

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

// 👷 v0.1 Model Schema
import { observableSource } from "./data-service";
import { packageStream } from "./plumbing";

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
// 👻 filterOperation

// 👷 v0.1 Mediator React API
import React from "React";
import ReactDOMServer from "react-dom/server";

import { renderToConsoleTimes } from "./plumbing";
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
