import 'less/phase.less';

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { phase as phasePropType } from 'proptypes';
import Grid from '@utdanningsdirektoratet/grid';
import Issue from './issue';

class Phase extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      time: '00:00:00'
    };
  }

  componentDidMount() {
    this.interval = setInterval(this.getTime, 500);
  }

  componentWillUnmount() {
    if (this.interval) clearInterval(this.interval);
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
    const h = this.checkTime(today.getHours());
    const m = this.checkTime(today.getMinutes());
    const s = this.checkTime(today.getSeconds());
    this.setState({ time: `${h}:${m}:${s}` });
  }

  checkTime = (i) => {
    if (i < 10) return `0${i}`;
    return i;
  }

  mapIssues = () => {
    const { phase, phaseName, overview } = this.props;

    if (phase.issues.length === 0) {
      return <Issue key={`issue-${phaseName}-${0}`} phase={phaseName} issue={{ color: 'white', fake: true }} index={0} />;
    }

    return phase.issues.map((issue, i) => {
      return <Issue key={`issue-${phaseName}-${issue.id}`} phase={phaseName} index={i} issue={issue} overview={overview} />;
    });
  }

  render() {
    const { phase, active, overview } = this.props;

    const phaseClass = classnames({
      'Phase': true,
      'Phase--overview': overview
    });

    return (
      <Grid size={overview ? '3-12' : undefined} className={phaseClass}>
        {overview ? (
          <h1 className="Phase-title u-h1">{phase.title} ({phase.issues.length})</h1>
        ) : null }
        {!overview && active === phase ? (
          <h1 className="Phase-title u-h1">
            {phase.title} ({this.getCurrentIssueNumber()}/{phase.issues.length})
            <span className="Phase-title-clock">{this.state.time}</span>
          </h1>
        ) : null}
        <div className="Phase-issues">
          {this.mapIssues()}
        </div>
      </Grid>
    );
  }
}

Phase.propTypes = {
  issueIndex: PropTypes.number,
  phaseName: PropTypes.string,
  active: phasePropType,
  phase: phasePropType.isRequired,
  overview: PropTypes.bool
};

export default Phase;
