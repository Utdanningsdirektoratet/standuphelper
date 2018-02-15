import 'less/issue.less';

import React from 'react';
import PropTypes from 'prop-types';
import Box from '@udir/udir-react-components/Box';
import Badge from '@udir/udir-react-components/Badge';
import Tooltip from '@udir/udir-react-components/Tooltip';
import classnames from 'classnames';
import { issue as issuePropType } from 'proptypes';

const mapLabels = (issue) => {
  return issue.labels.map(l => <Badge className="u--marginRight1 Badge--darkgrey" key={`label-${issue.id}-${l}`} value={l} wide />);
};

const mapFixVersions = (issue) => {
  return issue.unReleasedFixVersions.map(v => <Badge className="u--marginRight1 Badge--darkgrey" key={`label-${issue.id}-${v}`} value={v} wide />);
};

const getTitle = (overview, issue) => {
  return overview ? issue.name : `${issue.name} - ${issue.title}`;
};

const Issue = ({ issue, visible, overview }) => {
  const className = classnames({
    'Issue': true,
    'u--marginTop2': true,
    [`Box--${issue.color}`]: true,
    'Issue--small': overview
  });
  return visible ? (
    <Box className={className}>
      <div>
        { issue.releasedFixVersions > 0 ? <Badge className="Badge--topright Badge--blue" value={issue.releasedFixVersions} /> : null}
        <header className="Grid">
          <div className="Grid-23-25">
            <h1 className="u-h1 u--ellipsis">
              {getTitle(overview, issue)}
            </h1>
          </div>
          <div className="Grid-1-25 Grid--offset-1-25">
            <Tooltip message={issue.assignee}>
              <img src={issue.avatar} alt={issue.assignee} />
            </Tooltip>
          </div>
        </header>
        {overview
        ? null
        : (
          <div>
            <div>
              <div className="Issue-description u--ellipsis">
                {issue.description
                  ? <p dangerouslySetInnerHTML={{ __html: issue.description }}></p>
                  : <p>Nothing to see here!</p>
                }
              </div>
            </div>
            <footer className="u--marginTop2">
              <div>
                {mapLabels(issue)}
              </div>
              <div className="u--marginTop1">
                {mapFixVersions(issue)}
              </div>
            </footer>
          </div>
        )}
      </div>
    </Box>
  ) : null;
};

Issue.propTypes = {
  issue: issuePropType,
  visible: PropTypes.bool.isRequired,
  overview: PropTypes.bool
};

export default Issue;
