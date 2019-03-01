import React from 'react';
import { board as boardPropType } from 'proptypes';
import { INPROGRESS, PEERREVIEW, SYSTEMTEST, MERGE } from 'utils/constants';

import Phase from './Phase';

const Overview = ({ board }) => {
  return (
    <>
      <Phase phase={board.inProgress} phaseName={INPROGRESS} overview />
      <Phase phase={board.peerReview} phaseName={PEERREVIEW} overview />
      <Phase phase={board.test} phaseName={SYSTEMTEST} overview />
      <Phase phase={board.merge} phaseName={MERGE} overview />
    </>
  );
};

Overview.propTypes = {
  board: boardPropType.isRequired
};

export default Overview;
