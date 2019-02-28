import React from 'react';
import { board as boardPropType } from 'proptypes';

import Phase from './Phase';

const Overview = ({ board }) => {
  return (
    <>
      <Phase phase={board.inProgress} overview />
      <Phase phase={board.peerReview} overview />
      <Phase phase={board.test} overview />
      <Phase phase={board.peerReview} overview />
    </>
  );
};

Overview.propTypes = {
  board: boardPropType.isRequired
};

export default Overview;
