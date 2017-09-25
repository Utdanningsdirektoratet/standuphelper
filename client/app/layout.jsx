import React from 'react';
import Logo from '@udir/udir-react-components/Logo';


export default props => ComposedComponent => {
  const Layout = () => {
    return (
      <div>
        <header role="banner" className="SiteHeader">
          <section className="SiteHeader-logo">
            <a href="http://www.udir.no">
              <Logo />
            </a>
          </section>
          <section className="SiteHeader-nav" />
        </header>
        <ComposedComponent {...props} />
      </div>
    );
  };

  return Layout;
};
