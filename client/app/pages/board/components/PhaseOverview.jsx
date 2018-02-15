import 'less/phase.less';

import React from 'react';
import { phase as phasePropType } from 'proptypes';

import Issue from './Issue';

class Phase extends React.Component {
  static propTypes = {
    phase: phasePropType.isRequired
  }

  mapIssues = () => {
    const { issues } = this.props.phase;

    return issues.map((issue) => {
      return <Issue issue={issue} visible overview key={`issue-${issue.id}`} />;
    });
  }

  render() {
    return (
      <div className="Phase Grid-3-12">
        <h1 className="u-h1">{this.props.phase.title} ({this.props.phase.issues.length})</h1>
        <div>
          {this.mapIssues()}
        </div>
      </div>
    );
  }
}

export default Phase;

