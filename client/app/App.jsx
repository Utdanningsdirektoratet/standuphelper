import 'less/base';

import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { hot } from 'react-hot-loader/root';
import RouteContainer from 'RouteContainer';
import Board from 'pages/board';

const App = () => {
  return (
    <Router>
      <RouteContainer>
        <Route path="/" component={Board} />
      </RouteContainer>
    </Router>
  );
};

export default hot(App);
