import 'less/shared.less';

import React from 'react';

export default props => (ComposedComponent) => {
  const Layout = () => {
    return (
      <div>
        <ComposedComponent {...props} />
      </div>
    );
  };

  return Layout;
};
