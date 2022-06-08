import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './App';
import configureStore from './configureStore';

const store = configureStore();

const container = document.getElementById('app');
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
