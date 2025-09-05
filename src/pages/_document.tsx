import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/images/icon-192x192.png" />
        <meta name="theme-color" content="#18181b" />
        <link rel="apple-touch-icon" href="public/images/ios/192.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}