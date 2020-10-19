/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Avatar, Dropdown, Layout, Menu } from 'antd';
import { signOut, useSession } from 'next-auth/client';
import Link from 'next/link';

const { Header } = Layout;

const iconImg = 'https://www.flaticon.com/svg/static/icons/svg/3578/3578882.svg';
const logo = css`
  float: left;
  margin-right: 28px;
  max-height: 2.5em;
`;
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
            <img src={iconImg} css={logo} alt="template logo" />
          </a>
        </Link>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">nav 1</Menu.Item>
          <Menu.Item key="2">nav 2</Menu.Item>
          <Menu.Item key="3">nav 3</Menu.Item>
        </Menu>
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
