import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const Steps = ({ visible, overview }) => {
  const className = classnames({
    'Grid-7-25': !overview,
    'Issue-steps': true
  });
  return visible && !overview
    ? (
      <div className={className}>
        <p className="Issue-step">Hva?</p>
        <p className="Issue-step">Hvor lenge?</p>
        <p className="Issue-step">Fremdrift?</p>
      </div>
    )
    : null;
};

Steps.propTypes = {
  visible: PropTypes.bool,
  overview: PropTypes.bool
};

export default Steps;
