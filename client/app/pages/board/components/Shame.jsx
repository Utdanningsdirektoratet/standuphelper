import 'less/shame.less';

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const Shame = ({ animate }) => {
  const shameClass = classnames({
    'Shame': true,
    'Shame--show': animate,
    'animated': true,
    'tada': animate
  });

  return <div className={shameClass}>SHAME</div>;
};

Shame.propTypes = {
  animate: PropTypes.bool
};

export default Shame;
