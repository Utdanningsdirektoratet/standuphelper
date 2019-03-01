import 'less/board';

import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { board as boardPropType } from 'proptypes';
import { INPROGRESS, PEERREVIEW, SYSTEMTEST, MERGE, ARROWLEFT, ARROWRIGHT, RETURN, ARROWUP, ARROWDOWN, SPACE } from 'utils/constants';
import { animateScroll, scroller } from 'react-scroll';

import Phase from './components/Phase';

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

    this.timeout = setTimeout(() => {
      animateScroll.scrollToTop({
        smooth: true,
        duration: 350
      });
    }, 500);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeydown);
    if (this.timeout) clearTimeout(this.timeout);
  }

  onKeydown = (e) => {
    const keyPressed = e.which;
    if (keyPressed === RETURN) {
      e.preventDefault();
      e.stopPropagation();
      this.toggleOverview();
    }
    if (!this.state.overview) {
      if ((keyPressed === ARROWUP || keyPressed === ARROWDOWN || keyPressed === SPACE)) {
        e.preventDefault();
        e.stopPropagation();
        this.changeIssue(this.getIssue(keyPressed));
      }
      if ((keyPressed === ARROWLEFT || keyPressed === ARROWRIGHT)) {
        e.preventDefault();
        e.stopPropagation();
        this.changePhase(this.getPhase(keyPressed));
      }
    }
  }

  getIssue = (keyPressed) => {
    const { issueIndex } = this.state;
    const { issues } = this.getActivePhase();

    if ((keyPressed === ARROWDOWN || keyPressed === SPACE)) {
      if (this.isLastIssue()) return { index: issueIndex, phase: this.state.phase };

      if (issues.length === 0) {
        return { index: 0, phase: this.getPhase(ARROWLEFT) };
      }

      if (issueIndex === issues.length - 1) {
        return { index: 0, phase: this.getPhase(ARROWLEFT) };
      }

      return { index: issueIndex + 1, phase: this.state.phase };
    }

    if (keyPressed === ARROWUP) {
      if (this.isFirstIssue()) return { index: issueIndex, phase: this.state.phase };

      if (issues.length === 0) {
        const phase = this.getBoardPhase(this.getPhase(ARROWRIGHT));
        return { index: Math.max(phase.issues.length - 1, 0), phase: this.getPhase(ARROWRIGHT) };
      }

      if (issueIndex === 0) {
        const phase = this.getBoardPhase(this.getPhase(ARROWRIGHT));
        return { index: Math.max(phase.issues.length - 1, 0), phase: this.getPhase(ARROWRIGHT) };
      }
      return { index: issueIndex - 1, phase: this.state.phase };
    }

    return { index: issueIndex, phase: this.state.phase };
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

  changeIssue = ({ index, phase }) => {
    this.setState({ issueIndex: index, phase }, () => {
      scroller.scrollTo(`${phase}-${index}`, {
        smooth: 'easeInOutQuart'
      });
    });
  }

  changePhase = (nextPhase) => {
    if (this.state.phase !== nextPhase) {
      this.setState({ phase: nextPhase, issueIndex: 0 }, () => {
        scroller.scrollTo(`${nextPhase}-${0}`, {
          smooth: 'easeInOutQuart'
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
        scroller.scrollTo(`${this.state.phase}-${this.state.issueIndex}`, {
          smooth: false,
          duration: 0
        });
      }
    });
  }


  render() {
    const { board } = this.props;

    const boardClass = classnames({
      'Board': true,
      'Grid': true,
      'Board--overview': this.state.overview
    });

    return (
      <div className={boardClass}>
        {this.state.overview
          ? (
            <>
              <Phase phase={board.inProgress} phaseName={INPROGRESS} overview />
              <Phase phase={board.peerReview} phaseName={PEERREVIEW} overview />
              <Phase phase={board.test} phaseName={SYSTEMTEST} overview />
              <Phase phase={board.merge} phaseName={MERGE} overview />
            </>
          ) : (
            <>
              <Phase phase={board.merge} active={this.getActivePhase()} phaseName={MERGE} issueIndex={this.state.issueIndex} />
              <Phase phase={board.test} active={this.getActivePhase()} phaseName={SYSTEMTEST} issueIndex={this.state.issueIndex} />
              <Phase phase={board.peerReview} active={this.getActivePhase()} phaseName={PEERREVIEW} issueIndex={this.state.issueIndex} />
              <Phase phase={board.inProgress} active={this.getActivePhase()} phaseName={INPROGRESS} issueIndex={this.state.issueIndex} />
            </>
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
