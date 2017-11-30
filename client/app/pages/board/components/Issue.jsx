import 'less/issue.less';

import React from 'react';
import PropTypes from 'prop-types';
import Box from '@udir/udir-react-components/Box';
import Badge from '@udir/udir-react-components/Badge';
import classnames from 'classnames';
import { issue as issuePropType } from 'proptypes';

const mapLabels = (issue) => {
  return issue.labels.map(l => <Badge className="u--marginRight1 Badge--darkgrey" key={`label-${issue.id}-${l}`} value={l} wide />);
};

const mapFixVersions = (issue) => {
  return issue.unReleasedFixVersions.map(v => <Badge className="u--marginRight1 Badge--darkgrey" key={`label-${issue.id}-${v}`} value={v} wide />);
};

const Issue = ({ issue, visible }) => {
  const className = classnames({
    'Issue': true,
    'u--marginTop2': true,
    [`Box--${issue.color}`]: true
  });
  return visible ? (
    <Box className={className}>
      <div>
        { issue.releasedFixVersions > 0 ? <Badge className="Badge--topright Badge--blue" value={issue.releasedFixVersions} /> : null}
        <header className="Grid">
          <div className="Grid-24-25">
            <h2 className="u--h2">
              {issue.name} - {issue.title}
            </h2>
          </div>
          <div className="Grid-1-25">
            <img src={issue.avatar} alt={issue.assignee} />
          </div>
        </header>
        <div>
          <div className="Issue-description u--ellipsis">
            <p dangerouslySetInnerHTML={{ __html: issue.description }}></p>
          </div>
        </div>
        <footer className="u--marginTop1">
          <div>
            {mapLabels(issue)}
          </div>
          <div className="u--marginTop1">
            {mapFixVersions(issue)}
          </div>
        </footer>
      </div>
    </Box>
  ) : null;
};

Issue.propTypes = {
  issue: issuePropType,
  visible: PropTypes.bool.isRequired
};

export default Issue;
