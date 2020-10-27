/** @jsx jsx */
import { PlusOutlined } from '@ant-design/icons';
import { gql, useQuery } from '@apollo/client';
import { css, jsx } from '@emotion/core';
import { Button } from 'antd';
import { useSession } from 'next-auth/client';
import Link from 'next/link';

// import QuickAddButton from '../components/_convenience/quick-add-property';
import HousesTable from '../components/houses-table';
import LoadingScreen from '../components/loading-screen';
import { PROPERTY_FRAGMENT } from '../fragments/property';

const newPropertyButton = css`
  margin-bottom: 18px;
  float: right;
`;

export const GET_PROPERTIES = gql`
  query GetProperties($userId: String!) {
    properties(where: { user_id: { _eq: $userId } }) {
      ...Property
    }
  }
  ${PROPERTY_FRAGMENT}
`;

const IndexPage: React.FC = () => {
  const [session] = useSession();
  const { loading, error, data } = useQuery(GET_PROPERTIES, {
    variables: { userId: session.user.id },
  });

  if (loading) return <LoadingScreen />;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      {/* <QuickAddButton /> */}
      <Link href="/form">
        <a>
          <Button type="primary" css={newPropertyButton}>
            <PlusOutlined /> Property
          </Button>
        </a>
      </Link>

      <HousesTable properties={data.properties} />
    </div>
  );
};

export default IndexPage;
