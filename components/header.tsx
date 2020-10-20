/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Avatar, Dropdown, Layout, Menu, Typography } from 'antd';
import { signOut, useSession } from 'next-auth/client';
import Link from 'next/link';

const { Title } = Typography;
const { Header } = Layout;

const alignment = css`
  align-items: center;
  display: flex;
  justify-content: space-between;
`;
const avatar = css`
  cursor: pointer;
`;

const MyHeader: React.FC = () => {
  const [session] = useSession();

  return (
    <Header css={alignment}>
      <div css={alignment}>
        <Link href="/">
          <a>
            <Title level={2} style={{ color: 'white' }}>
              Property Analyzer
            </Title>
          </a>
        </Link>
      </div>

      <Dropdown
        trigger={['click']}
        overlay={
          <Menu>
            <Menu.Item onClick={signOut}>Sign out</Menu.Item>
          </Menu>
        }
      >
        <Avatar css={avatar} src={session.user.image} />
      </Dropdown>
    </Header>
  );
};

export default MyHeader;
