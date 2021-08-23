import Document, { Html, Head, Main, NextScript } from 'next/document'
import type { DocumentContext } from 'next/document'

class AppDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return initialProps
  }

  render() {
    return (
      <Html>
        <Head />
        <body className="overflow-x-hidden w-screen h-screen">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default AppDocument
