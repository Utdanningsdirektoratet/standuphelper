import { applyMiddleware, createStore, compose } from 'redux';
import { createLogger } from 'redux-logger';

import rootReducer from 'reducers';

export default function configureStore(initialState = {}) {
  const middleware = applyMiddleware(
    createLogger({
      predicate: () => __DEV__
    })
  );

  const store = createStore(
    rootReducer,
    initialState,
    compose(
      middleware,
      __DEV__ && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
  );

  return store;
}
