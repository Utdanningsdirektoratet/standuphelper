import { applyMiddleware, createStore, compose } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

import rootReducer from 'reducers';

export default function configureStore(initialState = {}) {
  const middleware = applyMiddleware(
    thunk,
    createLogger({
      predicate: () => __DEV__
    })
  );

  const store = createStore(
    rootReducer,
    initialState,
    compose(
      middleware,
      __DEV__ && window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  );

  return store;
}
