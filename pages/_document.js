import Document, { Head, Main, NextScript } from 'next/document';
import { Helmet } from 'react-helmet';

class AppDocument extends Document {
  static async getInitialProps(...args) {
    const documentProps = await super.getInitialProps(...args);

    return { ...documentProps, helmet: Helmet.renderStatic() };
  }

  get helmetHtmlAttrComponents() {
    return this.props.helmet.htmlAttributes.toComponent();
  }

  get helmetBodyAttrComponents() {
    return this.props.helmet.bodyAttributes.toComponent();
  }

  get helmetHeadComponents() {
    return Object.keys(this.props.helmet)
      .filter((el) => el !== 'htmlAttributes' && el !== 'bodyAttributes')
      .map((el) => this.props.helmet[el].toComponent());
  }

  render() {
    return (
      <html {...this.helmetHtmlAttrComponents} lang="en">
        <Head>{this.helmetHeadComponents}</Head>
        <body {...this.helmetBodyAttrComponents}>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

export default AppDocument;
