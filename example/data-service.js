import { Observable } from "rxjs";
import React from "react";

class MediatorWrapper extends React.Component {
  constructor() {
    super(...arguments);

    this.observable = this.props.observable;
    this.state = {};
  }

  deriveDataFromEvent(event) {
    return {
      [event.__operationId]: event.value
    };
  }

  componentWillMount() {
    this.observable.subscribe(
      event => {
        // console.log("evt", event);
        const state = { data: this.deriveDataFromEvent.bind(this)(event) };
        this.setState(state);
      },
      err => {
        console.error("Mediator Error", err);
      },
      () => {
        //console.log("Mediator Done");
      }
    );
  }

  componentWillUnmount() {
    this.observable.unsubscribe();
  }

  render() {
    //We need loading
    if (Object.keys(this.state).length === 0) {
      return null;
    }

    return React.createElement(this.props.component, this.state.data, null);
  }
}

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

const withMediator = (observable, component) =>
  React.createElement(MediatorWrapper, { observable, component }, null);

const reactExtension = observable => {
  return {
    react: component => {
      // NOTE: what about class components? (JSX will solve it)
      return withMediator(observable, component);
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
          return { __operationId: operationId, value: result };
        })
      ).catch(err => {
        return Observable.of({
          __operationId: "error",
          value: err
        });
      })
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
