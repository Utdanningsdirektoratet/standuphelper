import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import layout from 'layout';
import RouteContainer from 'RouteContainer';
import Progress from 'react-progress-2';
import Board from 'pages/board';

const App = () => {
  return (
    <Router>
      <RouteContainer>
        <div>
          <Route path="/" component={Progress.Component} />
          <Switch>
            <Route
              exact
              path="/"
              component={layout({})(Board)}
            />
            {/* <Route component={NotFound} /> */}
          </Switch>
        </div>
      </RouteContainer>
    </Router>
  );
};

export default App;
