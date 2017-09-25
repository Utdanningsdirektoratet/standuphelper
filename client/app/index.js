import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import App from 'App';
import configureStore from 'configureStore';

const store = configureStore(window.initialState);

render(
  <AppContainer>
    <Provider store={store}>
      <App />
    </Provider>
  </AppContainer>,
  document.getElementById('app') // eslint-disable-line
);

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
