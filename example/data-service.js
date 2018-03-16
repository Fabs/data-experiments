import { Observable } from "rxjs";

// PLUMBING
// -------------------------------------------------------

/**
 * Returns data source given a graphql schema
 */
const graphqlSource = schema => {
  return {};
};

const storeSource = store => {
  return {};
};

// 😈 write tests
const observableSource = observable => {
  return observable;
};

// NOTE: pipeSource(src1, src2, ..., srcN) to merge many sources
const packages = [{ name: "universe fake", url: "p1.hamburg", priority: 0 }];

const reactExtension = observer => {
  return {
    react: component => {
      // NOTE: what about class components?
      return component({ packages: packages });
    }
  };
};

/**
 * Returns a stream of data from the source with results from the queries.
 */
// NOTE: can pasos a single query instead of an object with multiple queries
// NOTE: maybe no need for options?
// 😈 write tests
const observe = (source, operations, options = {}) => {
  const observer = Object.keys(operations).reduce((accSource, operationId) => {
    return accSource.merge(
      operations[operationId](
        source.map(result => {
          //NOTE: What if result is not an object?
          return Object.assign({}, result, { __operationId: operationId });
        })
      )
    );
  }, Observable.empty());

  return Object.assign(observer, reactExtension(observer));
};

export {
  //Moderator API
  observe,
  //Source API
  graphqlSource,
  observableSource
};
