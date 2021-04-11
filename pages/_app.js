import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';

// Styles
import '@/scss/app.scss';

function Layout({ Component, pageProps }) {
  return (
    <>
      <Helmet
        htmlAttributes={{ lang: 'en' }}
        title="Hello next.js!"
        meta={[
          {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1',
          },
          { property: 'og:title', content: 'Hello next.js!' },
        ]}
      />
      <Component {...pageProps} />
    </>
  );
}

Layout.propTypes = {
  Component: PropTypes.any,
  pageProps: PropTypes.object,
};

export default Layout;
