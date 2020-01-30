import 'less/praise.less';

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const Praise = ({ animate }) => {
  const praiseClass = classnames({
    'Praise': true,
    'Praise--show': animate,
    'animated': true
  });

  return <span role="img" aria-label="Praise" className={praiseClass}>🙌</span>;
};

Praise.propTypes = {
  animate: PropTypes.bool
};

export default Praise;
