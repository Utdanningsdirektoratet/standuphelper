import React from 'react';
import { connect } from 'react-redux';
import { board as boardPropType } from 'proptypes';
import { INPROGRESS, PEERREVIEW, SYSTEMTEST, MERGE, ARROWLEFT, ARROWRIGHT } from 'utils/constants';

import Phase from './components/Phase';

const phaseOrder = [INPROGRESS, PEERREVIEW, SYSTEMTEST, MERGE];

class Board extends React.Component {
  constructor() {
    super();

    this.state = {
      activePhase: MERGE
    };

    this.eventListener = window.addEventListener('keydown', (e) => {
      const keyPressed = e.keyCode;
      if (keyPressed !== ARROWLEFT && keyPressed !== ARROWRIGHT) {
        return;
      }
      this.setState({ activePhase: this.getPhase(keyPressed) });
    });
  }

  componentWillUnmount = () => {
    window.removeEventListener(this.eventListener);
  }

  getPhase = (keyPressed) => {
    const { activePhase } = this.state;
    if (keyPressed !== ARROWLEFT && keyPressed !== ARROWRIGHT) {
      return activePhase;
    }

    const currentIndex = phaseOrder.findIndex(o => o === activePhase);
    if ((currentIndex === 0 && keyPressed === ARROWLEFT) ||
      (currentIndex === phaseOrder.length - 1 && keyPressed === ARROWRIGHT)) {
      return activePhase;
    }
    const nextIndex = keyPressed === ARROWLEFT ? currentIndex - 1 : currentIndex + 1;
    return phaseOrder[nextIndex];
  }

  getActivePhase = () => {
    const { activePhase } = this.state;
    const { board } = this.props;

    switch (activePhase) {
      case INPROGRESS:
        return board.inProgress;
      case PEERREVIEW:
        return board.peerReview;
      case SYSTEMTEST:
        return board.test;
      case MERGE:
        return board.merge;
      default:
        return board.merge;
    }
  }

  render() {
    return (
      <div className="Section u--paddingTop2">
        <div className="Section-content Grid">
          <Phase phase={this.getActivePhase()} />
        </div>
      </div>
    );
  }
}

Board.propTypes = {
  board: boardPropType.isRequired
};

const mapStateToProps = ({ board }) => {
  return {
    board
  };
};

export default connect(mapStateToProps)(Board);
