/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Layout } from 'antd';

import Header from './header';

const { Content } = Layout;

const layoutCss = css`
  height: 100vh;
`;

const MyLayout: React.FC = ({ children }) => (
  <Layout css={layoutCss}>
    <Header />

    <Layout>
      <Layout style={{ padding: '24px' }}>
        <Content
          style={{
            background: 'white',
            padding: 24,
            margin: 0,
            minHeight: 280,
            overflowY: 'scroll',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  </Layout>
);

export default MyLayout;
