import React from 'react';
import { phase as phasePropType } from 'proptypes';
import { ARROWUP, ARROWDOWN } from 'utils/constants';

import Issue from './Issue';

class Phase extends React.Component {
  static propTypes = {
    phase: phasePropType.isRequired
  }

  constructor() {
    super();

    this.state = {
      activeIssueIndex: 0
    };

    this.eventListener = window.addEventListener('keydown', (e) => {
      const keyPressed = e.keyCode;
      if (keyPressed !== ARROWUP && keyPressed !== ARROWDOWN) {
        return;
      }
      this.setState({ activeIssueIndex: this.getNextIndex(keyPressed) });
    });
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.phase !== this.props.phase) {
      this.setState({ activeIssueIndex: 0 });
    }
  }

  componentWillUnmount = () => {
    window.removeEventListener(this.eventListener);
  }

  getNextIndex = (keyPressed) => {
    const { activeIssueIndex } = this.state;
    const { issues } = this.props.phase;

    if ((activeIssueIndex === 0 && keyPressed === ARROWUP) ||
      (activeIssueIndex === issues.length - 1 && keyPressed === ARROWDOWN)) {
      return activeIssueIndex; // TODO: naviger mellom phases
    }

    return keyPressed === ARROWUP ? activeIssueIndex - 1 : activeIssueIndex + 1;
  }

  mapIssues = () => {
    const { issues } = this.props.phase;
    const { activeIssueIndex } = this.state;
    
    return issues.map((issue, i) => {
      return <Issue issue={issue} visible={activeIssueIndex === i} key={`issue-${issue.id}`} />;
    });
  }

  render() {
    return (
      <div>
        <h1 className="u--h1">{this.props.phase.title}</h1>
        <div>
          {this.mapIssues()}
        </div>
      </div>
    );
  }
}

export default Phase;

