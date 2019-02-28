import 'less/issue.less';

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { issue as issuePropType } from 'proptypes';
import { Element } from 'react-scroll';
import Details from './components/Details';

const Issue = (props) => {
  const { index, issue, overview } = props;
  const className = classnames({
    'Issue': true,
    'Issue--overview': overview,
    [`Issue--${issue.color}`]: true
  });
  return (
    <Element className={className} name={`${index}`}>
      <Details {...props} />
    </Element>
  );
};

Issue.propTypes = {
  index: PropTypes.number,
  issue: issuePropType,
  overview: PropTypes.bool
};

export default Issue;
