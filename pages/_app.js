import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

// Styles
import '@/scss/app.scss';

function Layout({ Component, pageProps }) {
  return (
    <>
      <GoogleReCaptchaProvider
        reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
        scriptProps={{
          async: false,
          defer: true,
          appendTo: 'body',
          nonce: undefined,
        }}
      >
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
      </GoogleReCaptchaProvider>
    </>
  );
}

Layout.propTypes = {
  Component: PropTypes.any,
  pageProps: PropTypes.object,
};

export default Layout;
