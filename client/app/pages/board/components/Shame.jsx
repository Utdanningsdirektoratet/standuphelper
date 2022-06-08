import 'less/shame.less';

import PropTypes from 'prop-types';
import classnames from 'classnames';

const Shame = ({ animate }) => {
  const shameClass = classnames({
    'Shame': true,
    'Shame--show': animate,
    'animate__animated': true,
    'animate__tada': animate,
    'animate__fadeIn': animate
  });

  return <div className={shameClass}>SHAME</div>;
};

Shame.propTypes = {
  animate: PropTypes.bool
};

export default Shame;
