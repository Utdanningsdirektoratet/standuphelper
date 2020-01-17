import React from 'react';
import PropTypes from 'prop-types';
import { issue as issuePropType } from 'proptypes';
import Badge, { Position as BadgePosition } from '@udir/udir-react-components/Badge';
import DOMPurify from 'dompurify';
import j2m from 'jira2md';
import ellipsize from 'ellipsize';

import nobody from 'images/nobody.jpg';


const mapLabels = (issue) => {
  return issue.labels.map((l) => <Badge color="darkgrey" className="u--marginRight1" key={`label-${issue.id}-${l}`} value={l} wide />);
};

const mapFixVersions = (issue) => {
  return issue.unReleasedFixVersions.map((v) => <Badge color="darkgrey" className="u--marginRight1" key={`label-${issue.id}-${v}`} value={v} wide />);
};

const mapReleasedFixVersions = (issue, overview) => {
  return issue.releasedFixVersions > 0 ? <Badge className={overview ? '' : 'u--marginRight1'} color="blue" position={overview ? BadgePosition.TOPRIGHT : ''} value={issue.releasedFixVersions} /> : null;
};

const getTitle = (overview, issue) => {
  return overview ? issue.name : `${issue.name} - ${ellipsize(issue.title, 40)}`;
};

const getDescription = (description) => {
  return ellipsize(DOMPurify.sanitize(j2m.jira_to_html(description))
    .replace(/^<p>(\s?<br>\s?)+/ig, '<p>')
    .replace(/(\s?<br>\s?)+<\/p>$/ig, '</p>')
    .replace(/<br>(\s?<br>\s?)+/ig, '<br><br>'),
  256);
};

const Details = ({ issue, overview }) => {
  if (issue.fake) return null;

  return (
    <div className="Issue-content">
      {overview ? mapReleasedFixVersions(issue, true) : null}

      <h1 className="Issue-header u-h1">
        <div className="Issue-title">
          <span className="Issue-title-content">{getTitle(overview, issue)}</span>
          <img className="Issue-avatar" src={issue.avatar || nobody} alt={issue.assignee} />
        </div>

        {!overview ? <div className="Issue-assignee">{issue.assignee.toUpperCase()}</div> : null}
      </h1>

      {overview
        ? null
        : (
          <>
            <div className="Issue-description">
              {issue.description ? (
                <div dangerouslySetInnerHTML={{ // eslint-disable-line
                  __html: getDescription(issue.description)
                }} />
              ) : null}
            </div>
            <div className="Issue-footer">
              <Badge className="u--marginRight1" color={issue.color} value={issue.type} wide />
              {mapReleasedFixVersions(issue, false)}
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
