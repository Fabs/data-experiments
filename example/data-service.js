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

/**
 * Returns a stream of data from the source with results from the queries.
 */
// NOTE: can pasos a single query instead of an object with multiple queries
// 😈 write tests
const observe = (source, operations, options = {}) => {
  return Object.keys(operations).reduce((accSource, operationId) => {
    return accSource.merge(
      operations[operationId](
        source.map(result => {
          //NOTE: What if result is not an object?
          return Object.assign({}, result, { __operationId: operationId });
        })
      )
    );
  }, Observable.empty());
};

export {
  //Moderator API
  observe,
  //Source API
  graphqlSource,
  observableSource
};
