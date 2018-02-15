import React from 'react';
import { connect } from 'react-redux';
import { board as boardPropType } from 'proptypes';
import { INPROGRESS, PEERREVIEW, SYSTEMTEST, MERGE, ARROWLEFT, ARROWRIGHT } from 'utils/constants';

import Phase from './components/Phase';

const phaseOrder = [INPROGRESS, PEERREVIEW, SYSTEMTEST, MERGE];

class Board extends React.Component {
  constructor() {
    super();
    document.title = 'Staaaaaandup!';
    this.state = {
      activePhase: MERGE,
      activeIssueIndex: 0
    };

    this.eventListener = window.addEventListener('keydown', (e) => {
      const keyPressed = e.keyCode;
      if (keyPressed !== ARROWLEFT && keyPressed !== ARROWRIGHT) {
        return;
      }
      this.changePhase(this.getPhase(keyPressed));
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

  changeIssue = (newIndex) => {
    this.setState(prevState => Object.assign({}, prevState, { activeIssueIndex: newIndex }));
  }

  changePhase = (nextPhase) => {
    if (nextPhase) {
      this.setState(prevState => Object.assign({}, prevState, { activePhase: nextPhase }));
    } else if (this.state.activePhase !== INPROGRESS) {
      this.changePhase(this.getPhase(ARROWLEFT)); // Go to next phase
    }
  }

  render() {
    return (
      <div className="Section u--paddingTop2">
        <div className="Section-content Grid">
          <Phase
            phase={this.getActivePhase()}
            changePhase={this.changePhase}
            changeIssue={this.changeIssue}
            getActivePhase={this.getActivePhase}
            activeIssueIndex={this.state.activeIssueIndex}
          />
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
