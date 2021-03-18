import 'less/base';

import React from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { hot } from 'react-hot-loader/root';
import RouteContainer from 'RouteContainer';
import useSWR from 'swr';
import Board, { LOAD_STORIES } from 'pages/board';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const App = () => {
  const dispatch = useDispatch();
  const { data } = useSWR(window.url, fetcher, { refreshInterval: 10000 });

  React.useEffect(() => {
    if (data) dispatch({ type: LOAD_STORIES, payload: data });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <Router>
      <RouteContainer>
        <Route path="/" component={Board} />
      </RouteContainer>
    </Router>
  );
};

export default hot(App);
