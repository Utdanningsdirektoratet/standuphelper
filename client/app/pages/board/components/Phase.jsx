import React from 'react';
import { phase as phasePropType } from 'proptypes';

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
  }

  mapIssues = () => {
    const { issues } = this.props.phase;

    return issues.map((i) => {
      return <Issue issue={i} key={`issue-${i.id}`} />;
    });
  }

  render() {
    return (
      <div>
        <div>
          {this.mapIssues()}
        </div>
      </div>
    );
  }
}

export default Phase;

