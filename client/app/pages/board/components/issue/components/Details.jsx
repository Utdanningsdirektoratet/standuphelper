import React from 'react';
import PropTypes from 'prop-types';
import { issue as issuePropType } from 'proptypes';
import Badge from '@utdanningsdirektoratet/badge';
import { Converter } from 'jira2markdown';
import ReactMarkdown from 'react-markdown';
import ellipsize from 'ellipsize';

import nobody from 'images/nobody.jpg';

const j2m = new Converter();

const mapLabels = (issue) => {
  return issue.labels.map((l) => <Badge color="darkgrey" className="u--marginRight1" key={`label-${issue.id}-${l}`} value={l} wide />);
};

const mapFixVersions = (issue) => {
  return issue.unReleasedFixVersions.map((v) => <Badge color="darkgrey" className="u--marginRight1" key={`label-${issue.id}-${v}`} value={v} wide />);
};

const mapReleasedFixVersions = (issue, overview) => {
  return issue.releasedFixVersions > 0 ? <Badge className={overview ? '' : 'u--marginRight1'} color="blue" position={overview ? 'topright' : undefined} value={issue.releasedFixVersions} /> : null;
};

const getTitle = (overview, issue) => {
  return overview ? issue.name : `${issue.name} - ${ellipsize(issue.title, 40)}`;
};

const Details = ({ issue, overview }) => {
  if (issue.fake) return null;

  return (
    <div className="Issue-content">
      {overview ? mapReleasedFixVersions(issue, true) : null}

      <h1 className="Issue-header u-h1">
        <div className="Issue-title">
          <span className="Issue-title-content">{getTitle(overview, issue)}</span>
          <img height="48" className="Issue-avatar" src={issue.avatar || nobody} alt={issue.assignee} />
        </div>

        {!overview ? <div className="Issue-assignee">{issue.assignee.toUpperCase()}</div> : null}
      </h1>

      {overview
        ? null
        : (
          <>
            <div className="Issue-description">
              {issue.description ? (
                <ReactMarkdown allowDangerousHtml>{ j2m.toMarkdown(issue.description)}</ReactMarkdown>
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
