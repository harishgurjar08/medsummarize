import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="noise">
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="Upload any medical or radiology report and get a plain-English summary anyone can understand. Free, private, open-source." />
        <meta name="theme-color" content="#0a0e14" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
