import 'less/board';

import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { board as boardPropType } from 'proptypes';
import { INPROGRESS, PEERREVIEW, SYSTEMTEST, MERGE, ARROWLEFT, ARROWRIGHT, RETURN, ARROWUP, ARROWDOWN, SPACE } from 'utils/constants';
import { animateScroll, scroller } from 'react-scroll';

import Phase from './components/Phase';
import Overview from './components/Overview';

const phaseOrder = [INPROGRESS, PEERREVIEW, SYSTEMTEST, MERGE];

class Board extends React.PureComponent {
  state = {
    phase: MERGE,
    issueIndex: 0,
    overview: true
  };

  componentDidMount() {
    document.title = 'Staaaaaandup!';
    window.addEventListener('keydown', this.onKeydown);

    setTimeout(() => {
      animateScroll.scrollToTop();
    }, 500);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeydown);
  }

  onKeydown = (e) => {
    const keyPressed = e.which;
    if (keyPressed === RETURN) {
      this.toggleOverview();
    }
    if (!this.state.overview) {
      if ((keyPressed === ARROWUP || keyPressed === ARROWDOWN || keyPressed === SPACE)) {
        this.changeIssue(this.getIssue(keyPressed));
      }
      if ((keyPressed === ARROWLEFT || keyPressed === ARROWRIGHT)) {
        this.changePhase(this.getPhase(keyPressed));
      }
    }
  }

  getIssue = (keyPressed) => {
    const { issueIndex } = this.state;
    const { issues } = this.getActivePhase();

    if ((keyPressed === ARROWDOWN || keyPressed === SPACE)) {
      if (this.isLastIssue()) return issueIndex;

      if (issues.length === 0) {
        this.changePhase(this.getPhase(ARROWLEFT));
        return 0;
      }

      if (issueIndex === issues.length - 1) {
        this.changePhase(this.getPhase(ARROWLEFT));
        return 0;
      }
      return issueIndex + 1;
    }

    if (keyPressed === ARROWUP) {
      if (this.isFirstIssue()) return issueIndex;

      if (issues.length === 0) {
        const phase = this.getBoardPhase(this.getPhase(ARROWRIGHT));
        this.changePhase(this.getPhase(ARROWRIGHT));
        return phase.issues.length - 1;
      }

      if (issueIndex === 0) {
        const phase = this.getBoardPhase(this.getPhase(ARROWRIGHT));
        this.changePhase(this.getPhase(ARROWRIGHT));
        return phase.issues.length - 1;
      }
      return issueIndex - 1;
    }

    return issueIndex;
  }

  getPhase = (keyPressed) => {
    const { phase } = this.state;
    if (keyPressed !== ARROWLEFT && keyPressed !== ARROWRIGHT) {
      return phase;
    }

    const currentIndex = phaseOrder.findIndex(o => o === phase);
    if ((currentIndex === 0 && keyPressed === ARROWLEFT)
      || (currentIndex === phaseOrder.length - 1 && keyPressed === ARROWRIGHT)) {
      return phase;
    }
    const nextIndex = keyPressed === ARROWLEFT ? currentIndex - 1 : currentIndex + 1;
    return phaseOrder[nextIndex];
  }

  getActivePhase = () => {
    const { phase } = this.state;
    return this.getBoardPhase(phase);
  }

  getBoardPhase = (phase) => {
    const { board } = this.props;

    switch (phase) {
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

  isLastIssue = () => {
    return this.state.phase === INPROGRESS && this.state.issueIndex === this.getActivePhase().issues.length - 1;
  }

  isFirstIssue = () => {
    return this.state.phase === MERGE && this.state.issueIndex === 0;
  }

  changeIssue = (newIndex) => {
    this.setState({ issueIndex: newIndex }, () => {
      scroller.scrollTo(`${newIndex}`, {
        smooth: true
      });
    });
  }

  changePhase = (nextPhase) => {
    if (this.state.phase !== nextPhase) {
      this.setState({ phase: nextPhase, issueIndex: 0 }, () => {
        animateScroll.scrollToTop({
          smooth: false,
          duration: 0
        });
      });
    }
  }

  toggleOverview = () => {
    this.setState(prevState => ({ overview: !prevState.overview }), () => {
      if (this.state.overview) {
        animateScroll.scrollToTop({
          smooth: false,
          duration: 0
        });
      } else {
        scroller.scrollTo(`${this.state.issueIndex}`, {
          smooth: false,
          duration: 0
        });
      }
    });
  }


  render() {
    const boardClass = classnames({
      'Board': true,
      'Grid': true,
      'Board--overview': this.state.overview
    });

    return (
      <div className={boardClass}>
        {this.state.overview
          ? (
            <Overview board={this.props.board} />
          ) : (
            <Phase phase={this.getActivePhase()} issueIndex={this.state.issueIndex} />
          )}
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
