import React from 'react';
import PropTypes from 'prop-types';
import { issue as issuePropType } from 'proptypes';
import Badge, { Position as BadgePosition } from '@udir/udir-react-components/Badge';
import Tooltip, { Position } from '@udir/udir-react-components/Tooltip';
import DOMPurify from 'dompurify';
import j2m from 'jira2md';

import nobody from 'images/nobody.jpg';
import { trunc } from '../utils';


const mapLabels = (issue) => {
  return issue.labels.map(l => <Badge color="darkgrey" className="u--marginRight1" key={`label-${issue.id}-${l}`} value={l} wide />);
};

const mapFixVersions = (issue) => {
  return issue.unReleasedFixVersions.map(v => <Badge color="darkgrey" className="u--marginRight1" key={`label-${issue.id}-${v}`} value={v} wide />);
};

const mapReleasedFixVersions = (issue, overview) => {
  return issue.releasedFixVersions > 0 ? <Badge className={overview ? '' : 'u--marginRight1'} color="blue" position={overview ? BadgePosition.TOPRIGHT : ''} value={issue.releasedFixVersions} /> : null;
};

const getTitle = (overview, issue) => {
  return overview ? issue.name : `${issue.name} - ${trunc(issue.title, 70, false)}`;
};

const getDescription = (description) => {
  return trunc(DOMPurify.sanitize(description, {
    ALLOWED_TAGS: ['br'],
    KEEP_CONTENT: true,
    RETURN_DOM: false
  }), 500, true).replace(/<br>(<br>)+/ig, '<br>');
};

const Details = ({ issue, overview }) => {
  return (
    <div className="Issue-content">
      {overview ? mapReleasedFixVersions(issue, overview) : null}

      <h1 className="Issue-header u-h1">
        <span className="Issue-header-content">{getTitle(overview, issue)}</span>

        <Tooltip enabled={!overview} className="u--inlineBlock u--right" message={issue.assignee.toUpperCase()} position={Position.TOP} alwaysShow>
          <img className="Issue-avatar" src={issue.avatar || nobody} alt={issue.assignee} />
        </Tooltip>
      </h1>

      {overview
        ? null
        : (
          <>
            <div className="Issue-description">
              {issue.description ? (
                <div dangerouslySetInnerHTML={{ // eslint-disable-line
                  __html: j2m.jira_to_html(getDescription(issue.description))
                }} />
              ) : null}
            </div>
            <div className="Issue-footer">
              {mapReleasedFixVersions(issue, overview)}
              {mapLabels(issue)}
              {mapFixVersions(issue)}
            </div>
          </>
        )}
    </div>
  );
};

Details.propTypes = {
  issue: issuePropType,
  overview: PropTypes.bool
};

export default Details;
