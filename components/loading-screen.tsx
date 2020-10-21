/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Spin } from 'antd';

const container = css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const LoadingScreen: React.FC = () => {
  return (
    <main css={container}>
      <Spin size="large" />
    </main>
  );
};

export default LoadingScreen;
