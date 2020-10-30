/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Button } from 'antd';
import { signIn } from 'next-auth/client';

const container = css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Login: React.FC = () => (
  <main css={container}>
    <Button type="primary" onClick={() => signIn('google')}>
      Sign in with Google
    </Button>
  </main>
);

export default Login;
