/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Button, Spin } from 'antd';
import { signIn, useSession } from 'next-auth/client';

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
    return (
      <main css={container}>
        <Spin size="large" />
      </main>
    );
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
