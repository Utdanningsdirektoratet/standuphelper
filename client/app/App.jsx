import 'less/base';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import useSWR from 'swr';
import Board, { LOAD_STORIES } from 'pages/board';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const App = () => {
  const dispatch = useDispatch();
  const { data } = useSWR(`${window.url}${window.location.search}`, fetcher, { refreshInterval: 10000 });

  useEffect(() => {
    if (data) dispatch({ type: LOAD_STORIES, payload: data });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Board />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
