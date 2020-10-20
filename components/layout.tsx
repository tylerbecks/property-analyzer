import { Layout } from 'antd';

import Header from './header';

const { Content } = Layout;

const MyLayout: React.FC = ({ children }) => (
  <Layout>
    <Header />

    <Layout>
      <Layout style={{ padding: '24px' }}>
        <Content
          style={{
            background: 'white',
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  </Layout>
);

export default MyLayout;
