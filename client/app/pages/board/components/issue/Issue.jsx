import 'less/issue.less';

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Details from './components/Details';
import Steps from './components/Steps';

const Issue = (props) => {
  const { overview } = props;
  const className = classnames({
    'Issue': true,
    'Grid': !overview,
    'Grid--reverse': !overview
  });
  return (
    <div className={className}>
      <Details {...props} />
      <Steps {...props} />
    </div>
  );
};

Issue.propTypes = {
  overview: PropTypes.bool
};

export default Issue;
