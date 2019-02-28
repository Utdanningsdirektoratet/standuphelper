import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';

import App from 'App';
import configureStore from 'configureStore';

const store = configureStore(window.initialState);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app') // eslint-disable-line
);
