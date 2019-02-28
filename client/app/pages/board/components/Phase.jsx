import 'less/phase.less';

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { phase as phasePropType } from 'proptypes';

import { } from 'utils/constants';
import Issue from './issue';

class Phase extends React.PureComponent {
  state = {
    time: null
  }

  componentDidMount() {
    this.timeout = setInterval(this.getTime, 500);
  }

  componentWillUnmount() {
    clearInterval(this.timeout);
  }

  getCurrentIssueNumber = () => {
    const { issueIndex, phase } = this.props;

    if (issueIndex === undefined || phase.issues.length === 0) {
      return 0;
    }

    return issueIndex + 1;
  }

  getTime = () => {
    const today = new Date();
    const h = today.getHours();
    const m = this.checkTime(today.getMinutes());
    const s = this.checkTime(today.getSeconds());
    this.setState({ time: `${h}:${m}:${s}` });
  }

  checkTime = (i) => {
    if (i < 10) return `0${i}`;
    return i;
  }

  mapIssues = () => {
    const { phase, overview } = this.props;

    return phase.issues.map((issue, i) => {
      return <Issue key={`issue-${issue.id}`} index={i} issue={issue} overview={overview} />;
    });
  }

  render() {
    const { phase, overview } = this.props;

    const phaseClass = classnames({
      'Phase': true,
      'Phase--overview': overview,
      'Grid-3-12': overview
    });

    return (
      <div className={phaseClass}>
        {overview ? (
          <h1 className="Phase-title u-h1">{phase.title} ({phase.issues.length})</h1>
        ) : (
          <h1 className="Phase-title u-h1">
            {phase.title} ({this.getCurrentIssueNumber()}/{phase.issues.length})
            <span className="Phase-title-clock">{this.state.time}</span>
          </h1>
        )}
        <div className="Phase-issues">
          {this.mapIssues()}
        </div>
      </div>
    );
  }
}

Phase.propTypes = {
  issueIndex: PropTypes.number,
  phase: phasePropType.isRequired,
  overview: PropTypes.bool
};

export default Phase;
