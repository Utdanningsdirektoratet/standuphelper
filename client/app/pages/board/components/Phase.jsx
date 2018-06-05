import 'less/phase.less';

import React from 'react';
import Proptypes from 'prop-types';
import { phase as phasePropType } from 'proptypes';
import { ARROWUP, ARROWDOWN, SPACE } from 'utils/constants';

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
      props.changeIssue(this.getNextIndex(keyPressed));
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
    const { activeIssueIndex, isVerylastIssue } = this.props;
    const { issues } = this.props.phase;

    if (keyPressed === ARROWDOWN && isVerylastIssue()) {
      return activeIssueIndex;
    }

    if ((keyPressed === SPACE && activeIssueIndex === issues.length - 1) || (keyPressed === SPACE && issues.length === 0)) {
      this.props.changePhase();
      return 0;
    }

    if (keyPressed === SPACE && activeIssueIndex !== issues.length - 1) {
      return activeIssueIndex + 1;
    }

    if ((activeIssueIndex === 0 && keyPressed === ARROWUP) ||
      (activeIssueIndex === issues.length - 1 && keyPressed === ARROWDOWN)) {
      return activeIssueIndex;
    }

    return keyPressed === ARROWUP ? activeIssueIndex - 1 : activeIssueIndex + 1;
  }

  getCurrentIssueNumber = () => {
    const { activeIssueIndex, phase } = this.props;

    if (phase.issues.length === 0) {
      return 0;
    }

    return activeIssueIndex + 1;
  }

  mapIssues = () => {
    const { issues } = this.props.phase;
    const { activeIssueIndex } = this.props;

    return issues.map((issue, i) => {
      return <Issue issue={issue} visible={activeIssueIndex === i} key={`issue-${issue.id}`} />;
    });
  }

  render() {
    const { phase } = this.props;
    return (
      <div className="Phase u--marginTop10">
        <h1 className="u-title">{phase.title} ({this.getCurrentIssueNumber()}/{phase.issues.length})</h1>
        <div>
          {this.mapIssues()}
        </div>
      </div>
    );
  }
}

export default Phase;
