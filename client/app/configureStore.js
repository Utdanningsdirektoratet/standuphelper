import { applyMiddleware, createStore, compose } from 'redux';
import { createLogger } from 'redux-logger';

import rootReducer from 'reducers';

export default function configureStore(initialState = {}) {
  const middleware = applyMiddleware(
    createLogger({
      predicate: () => __DEV__
    })
  );

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(
      middleware
    )
  );

  return store;
}
