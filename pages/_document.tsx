import { Head, Html, Main, NextScript } from 'next/document';
import { Analytics } from '@vercel/analytics/react';

export default function Document() {
  return (
    <Html>
      <Head lang="ko">
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR&display=swap" rel="stylesheet"></link>
        {/* <meta
          httpEquiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        /> */}
      </Head>

      <body data-theme="dark">
        <Main />
        <NextScript />
        <Analytics />
      </body>
    </Html>
  );
}
