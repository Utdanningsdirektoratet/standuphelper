import React from 'react';
import { board as boardPropType } from 'proptypes';

import PhaseOverview from './PhaseOverview';

const Overview = ({ board }) => {
  return (
    <div className="Overview">
      <PhaseOverview phase={board.inProgress} />
      <PhaseOverview phase={board.peerReview} />
      <PhaseOverview phase={board.test} />
      <PhaseOverview phase={board.merge} />
    </div>
  );
};

Overview.propTypes = {
  board: boardPropType.isRequired
};

export default Overview;
