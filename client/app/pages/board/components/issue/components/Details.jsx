import nobody from 'images/nobody.jpg';

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { issue as issuePropType } from 'proptypes';
import classnames from 'classnames';
import Box from '@udir/udir-react-components/Box';
import Badge from '@udir/udir-react-components/Badge';
import Tooltip, { Position } from '@udir/udir-react-components/Tooltip';
import DOMPurify from 'dompurify';

import { trunc } from '../utils';

const mapLabels = (issue) => {
  return issue.labels.map(l => <Badge className="u--marginRight1 Badge--darkgrey" key={`label-${issue.id}-${l}`} value={l} wide />);
};

const mapFixVersions = (issue) => {
  return issue.unReleasedFixVersions.map(v => <Badge className="u--marginRight1 Badge--darkgrey" key={`label-${issue.id}-${v}`} value={v} wide />);
};

const getTitle = (overview, issue) => {
  return overview ? issue.name : `${issue.name} - ${trunc(issue.title, 50, false)}`;
};

const getDescription = (description) => {
  return trunc(DOMPurify.sanitize(description, {
    ALLOWED_TAGS: ['br'],
    KEEP_CONTENT: true,
    RETURN_DOM: false
  }), 250, true);
};

const Details = ({ visible, issue, overview }) => {
  const wrapperClassName = classnames({
    'Grid-14-25': !overview,
    'Grid--offset-4-25': !overview
  });
  const boxClassName = classnames({
    'Issue-details': true,
    'u--marginTop2': true,
    [`Box--${issue.color}`]: true,
    'Issue--small': overview
  });
  return visible ? (
    <div className={wrapperClassName}>
      <Box className={boxClassName}>
        <Fragment>
          { issue.releasedFixVersions > 0 ? <Badge className="Badge--topright Badge--blue" value={issue.releasedFixVersions} /> : null}
          <header className="Grid">
            <div className="Grid-23-25">
              <h1 className="u-h1">
                {getTitle(overview, issue)}
              </h1>
            </div>
            <div className="Grid-1-25 Grid--offset-1-25">
              <Tooltip className="u--block" message={issue.assignee.toUpperCase()} position={Position.BOTTOM} alwaysShow={!overview}>
                <img className="Issue-avatar" src={issue.avatar || nobody} alt={issue.assignee} />
              </Tooltip>
            </div>
          </header>
          {overview
          ? null
          : (
            <div>
              <div>
                <div className="Issue-description">
                  {issue.description
                    ? <div dangerouslySetInnerHTML={{ // eslint-disable-line
                       __html: getDescription(issue.description)
                      }}></div>
                    : <div>Nothing to see here!</div>
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
        </Fragment>
      </Box>
    </div>
  ) : null;
};

Details.propTypes = {
  issue: issuePropType,
  visible: PropTypes.bool.isRequired,
  overview: PropTypes.bool
};

export default Details;
