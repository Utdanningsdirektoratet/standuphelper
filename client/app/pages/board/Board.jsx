import 'less/board';

import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { board as boardPropType } from 'proptypes';
import { INPROGRESS, PEERREVIEW, SYSTEMTEST, MERGE, ARROWLEFT, ARROWRIGHT, RETURN, ARROWUP, ARROWDOWN, SPACE, ESCAPE, S, P } from 'utils/constants';
import { animateScroll, scroller } from 'react-scroll';
import LoadingBar from 'react-top-loading-bar';
import getHours from 'date-fns/getHours';
import getMinutes from 'date-fns/getMinutes';
import setMinutes from 'date-fns/setMinutes';
import startOfMinute from 'date-fns/startOfMinute';
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds';

import Phase from './components/Phase';
import Shame from './components/Shame';
import Praise from './components/Praise';

const phaseOrder = [INPROGRESS, PEERREVIEW, SYSTEMTEST, MERGE];

class Board extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      phase: MERGE,
      issueIndex: 0,
      overview: true,
      loading: 0,
      shame: false,
      praise: false
    };

    this.timeout = null;
    this.interval = null;
  }

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
      if (keyPressed === ESCAPE) {
        e.preventDefault();
        e.stopPropagation();
        this.toggleOverview();
      }
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
      if (keyPressed === S) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ shame: true }, () => {
          setTimeout(() => {
            this.setState({ shame: false });
          }, 1000);
        });
      } else if (keyPressed === P) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ praise: true }, () => {
          setTimeout(() => {
            this.setState({ praise: false });
          }, 1000);
        });
      } else {
        // this.setTimeout();
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

    const currentIndex = phaseOrder.findIndex((o) => o === phase);
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

  getNumberOfIssuesLeft = () => {
    return this.getNumberOfIssues(this.state.phase) - this.state.issueIndex;
  }

  getNumberOfIssues = (phase) => {
    const { board } = this.props;

    switch (phase) {
      case INPROGRESS:
        return board.inProgress.issues.length;
      case PEERREVIEW:
        return board.peerReview.issues.length + this.getNumberOfIssues(INPROGRESS);
      case SYSTEMTEST:
        return board.test.issues.length + this.getNumberOfIssues(PEERREVIEW);
      case MERGE:
        return board.merge.issues.length + this.getNumberOfIssues(SYSTEMTEST);
      default:
        return Object.keys(board).reduce((acc, curr) => acc + board[curr].issues.length, 0);
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
    this.setState((prevState) => ({ overview: !prevState.overview, loading: 0 }), () => {
      if (this.state.overview) {
        this.clearTimeout();
        animateScroll.scrollToTop({
          smooth: false,
          duration: 0
        });
      } else {
        // this.setTimeout();
        scroller.scrollTo(`${this.state.phase}-${this.state.issueIndex}`, {
          smooth: false,
          duration: 0
        });
      }
    });
  }

  getTimeLeft = () => {
    // Between 11:15 and 11:30
    if (getHours(new Date()) === 11 && getMinutes(new Date()) >= 15 && getMinutes(new Date()) < 30) {
      return differenceInMilliseconds(startOfMinute(setMinutes(new Date(), 30)), new Date());
    }
    return 900000; // 15 minutes
  }

  setTimeout = () => {
    this.clearTimeout();
    this.setState({ loading: 0 }, () => {
      this.timeout = setTimeout(() => {
        this.interval = setInterval(() => {
          if (this.state.loading > 100) {
            if (this.isLastIssue()) {
              this.toggleOverview();
            } else {
              this.changeIssue(this.getIssue(ARROWDOWN));
            }
            this.setTimeout();
          } else {
            this.setState((prevState) => ({ loading: prevState.loading + 1 }));
          }
        }, 100);
      }, (this.getTimeLeft() / this.getNumberOfIssuesLeft()) - 10000);
    });
  }

  clearTimeout = () => {
    clearTimeout(this.timeout);
    clearInterval(this.interval);
  }

  render() {
    const { board } = this.props;

    const boardClass = classnames({
      'Board': true,
      'Grid': true,
      'Board--overview': this.state.overview
    });

    if (!board.loaded) return <div>Laster...</div>;

    return (
      <div className={boardClass}>
        <LoadingBar
          height={10}
          progress={this.state.loading}
        />
        {this.state.overview ? (
          <>
            <Phase phase={board.inProgress} phaseName={INPROGRESS} overview />
            <Phase phase={board.peerReview} phaseName={PEERREVIEW} overview />
            <Phase phase={board.test} phaseName={SYSTEMTEST} overview />
            <Phase phase={board.merge} phaseName={MERGE} overview />
          </>
        ) : (
          <>
            <Phase
              phase={board.merge}
              active={this.getActivePhase()}
              phaseName={MERGE}
              issueIndex={this.state.issueIndex}
            />
            <Phase
              phase={board.test}
              active={this.getActivePhase()}
              phaseName={SYSTEMTEST}
              issueIndex={this.state.issueIndex}
            />
            <Phase
              phase={board.peerReview}
              active={this.getActivePhase()}
              phaseName={PEERREVIEW}
              issueIndex={this.state.issueIndex}
            />
            <Phase
              phase={board.inProgress}
              active={this.getActivePhase()}
              phaseName={INPROGRESS}
              issueIndex={this.state.issueIndex}
            />
            <Shame animate={this.state.shame} />
            <Praise animate={this.state.praise} />
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
