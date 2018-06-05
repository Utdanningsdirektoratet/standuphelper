import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

class RouteContainer extends React.Component {
  render() {
    return React.Children.only(this.props.children);
  }
}

RouteContainer.propTypes = {
  children: PropTypes.node.isRequired
};


export default withRouter(RouteContainer);