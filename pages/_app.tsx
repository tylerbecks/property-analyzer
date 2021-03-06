/** @jsx jsx */
import 'antd/dist/antd.css';

import { css, Global, jsx } from '@emotion/core';
import LogRocket from 'logrocket';
import { Provider as NextAuthProvider } from 'next-auth/client';
import type { AppProps /*, AppContext */ } from 'next/app';
import Head from 'next/head';

// import App from "next/app";

LogRocket.init('mg0tep/property-analyzer-8wicl');

const globalStyles = css`
  html,
  body {
    padding: 0;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell,
      Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  * {
    box-sizing: border-box;
  }
`;

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Global styles={globalStyles} />
      <Head>
        <title>Property Analyzer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NextAuthProvider session={pageProps.session}>
        <Component {...pageProps} />
      </NextAuthProvider>
    </>
  );
};

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext: AppContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);

//   return { ...appProps }
// }

export default MyApp;
