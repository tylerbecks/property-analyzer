/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import Head from 'next/head';

const container = css`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  padding: 0 0.5rem;
`;
const main = css`
  padding: 5rem 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const footer = css`
  width: 100%;
  height: 100px;
  border-top: 1px solid #eaeaea;
  display: flex;
  justify-content: center;
  align-items: center;

  & img {
    margin-left: 0.5rem;
  }

  & a {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
const title = css`
  font-size: 4rem;
  line-height: 1.15;
  margin: 0;
  text-align: center;

  & a {
    color: #0070f3;
    text-decoration: none;
  }

  & a:hover,
  & a:focus,
  & a:active {
    text-decoration: underline;
  }
`;
const description = css`
  font-size: 1.5rem;
  line-height: 1.5;
  text-align: center;
`;
const code = css`
  background: #fafafa;
  border-radius: 5px;
  padding: 0.75rem;
  font-size: 1.1rem;
  font-family: Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono,
    Bitstream Vera Sans Mono, Courier New, monospace;
`;
const grid = css`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 800px;
  margin-top: 3rem;

  @media (max-width: 600px) {
    width: 100%;
    flex-direction: column;
  }
`;
const card = css`
  margin: 1rem;
  flex-basis: 45%;
  padding: 1.5rem;
  text-align: left;
  color: inherit;
  text-decoration: none;
  border: 1px solid #eaeaea;
  border-radius: 10px;
  transition: color 0.15s ease, border-color 0.15s ease;

  &:hover,
  &:focus,
  &:active {
    color: #0070f3;
    border-color: #0070f3;
  }

  & h3 {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
  }

  & p {
    margin: 0;
    font-size: 1.25rem;
    line-height: 1.5;
  }
`;
const logo = css`
  height: 1em;
`;

const Home: React.FC = () => (
  <div css={container}>
    <Head>
      <title>Project Scaffolding</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main css={main}>
      <h1 css={title}>
        Welcome to{' '}
        <a target="_blank" rel="noreferrer" href="https://nextjs.org">
          Next.js!
        </a>
      </h1>

      <p css={description}>
        Get started by editing <code css={code}>pages/index.tsx</code>
      </p>

      <div css={grid}>
        <a target="_blank" rel="noreferrer" href="https://nextjs.org/docs" css={card}>
          <h3>Documentation &rarr;</h3>
          <p>Find in-depth information about Next.js features and API.</p>
        </a>

        <a target="_blank" rel="noreferrer" href="https://nextjs.org/learn" css={card}>
          <h3>Learn &rarr;</h3>
          <p>Learn about Next.js in an interactive course with quizzes!</p>
        </a>

        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/vercel/next.js/tree/master/examples"
          css={card}
        >
          <h3>Examples &rarr;</h3>
          <p>Discover and deploy boilerplate example Next.js projects.</p>
        </a>

        <a
          href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          css={card}
        >
          <h3>Deploy &rarr;</h3>
          <p>Instantly deploy your Next.js site to a public URL with Vercel.</p>
        </a>
      </div>
    </main>

    <footer css={footer}>
      <a
        href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
        target="_blank"
        rel="noopener noreferrer"
      >
        Powered by <img src="/vercel.svg" alt="Vercel Logo" css={logo} />
      </a>
    </footer>
  </div>
);

export default Home;
