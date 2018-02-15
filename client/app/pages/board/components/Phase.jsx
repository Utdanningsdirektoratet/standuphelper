import 'less/phase.less';

import React from 'react';
import Proptypes from 'prop-types';
import { phase as phasePropType } from 'proptypes';
import { ARROWUP, ARROWDOWN, SPACE, INPROGRESS } from 'utils/constants';

import Issue from './Issue';

class Phase extends React.Component {
  static propTypes = {
    phase: phasePropType.isRequired,
    changeIssue: Proptypes.func.isRequired,
    changePhase: Proptypes.func.isRequired,
    isVerylastIssue: Proptypes.func.isRequired,
    activeIssueIndex: Proptypes.number.isRequired
  }

  constructor(props) {
    super();

    this.eventListener = window.addEventListener('keydown', (e) => {
      const keyPressed = e.keyCode;
      if (keyPressed !== ARROWUP && keyPressed !== ARROWDOWN && keyPressed !== SPACE) {
        return;
      }
      if (!props.isVerylastIssue()) {
        props.changeIssue(this.getNextIndex(keyPressed));
      }
    });
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.phase !== this.props.phase) {
      this.props.changeIssue(0);
    }
  }

  componentWillUnmount = () => {
    window.removeEventListener('keydown', this.eventListener);
  }

  getNextIndex = (keyPressed) => {
    const { activeIssueIndex } = this.props;
    const { issues } = this.props.phase;

    if (keyPressed === SPACE && activeIssueIndex !== issues.length - 1) {
      return activeIssueIndex + 1;
    } else if (keyPressed === SPACE && activeIssueIndex === issues.length - 1) {
      this.props.changePhase();
      return 0;
    }

    if ((activeIssueIndex === 0 && keyPressed === ARROWUP) ||
      (activeIssueIndex === issues.length - 1 && keyPressed === ARROWDOWN)) {
      return activeIssueIndex;
    }

    return keyPressed === ARROWUP ? activeIssueIndex - 1 : activeIssueIndex + 1;
  }

  mapIssues = () => {
    const { issues } = this.props.phase;
    const { activeIssueIndex } = this.props;

    return issues.map((issue, i) => {
      return <Issue issue={issue} visible={activeIssueIndex === i} key={`issue-${issue.id}`} />;
    });
  }

  render() {
    return (
      <div className="Phase u--marginTop10">
        <h1 className="u-title">{this.props.phase.title} ({this.props.phase.issues.length})</h1>
        <div>
          {this.mapIssues()}
        </div>
      </div>
    );
  }
}

export default Phase;

