/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Button } from 'antd';
import { signIn, useSession } from 'next-auth/client';

import LoadingScreen from './loading-screen';

const container = css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

type Props = { Page: React.ReactNode };

const AuthGateway: React.FC<Props> = ({ Page }: Props) => {
  const [session, loading] = useSession();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!session) {
    return (
      <main css={container}>
        <Button type="primary" onClick={() => signIn('google')}>
          Sign in
        </Button>
      </main>
    );
  }

  return <>{Page}</>;
};

export default AuthGateway;
