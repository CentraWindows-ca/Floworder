import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta name="theme-color" content="#000000" />
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <link rel="shortcut icon" href="/favicon.svg" />
          <link
            rel="apple-touch-icon"
            sizes="96x96"
            href="/favicon.svg"
          />

        </Head>
        <body className="text-slate-700 antialiased">
          <div id="page-transition"></div>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
