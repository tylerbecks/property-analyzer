/** @jsx jsx */
import { PlusOutlined } from '@ant-design/icons';
import { gql, useQuery } from '@apollo/client';
import { css, jsx } from '@emotion/core';
import { Button } from 'antd';
import { useSession } from 'next-auth/client';
import Link from 'next/link';

import ErrorScreen from '../components/error-screen';
import HousesTable from '../components/houses-table';
import LoadingScreen from '../components/loading-screen';
import { HOUSE_FRAGMENT } from '../fragments/house';
// import QuickAddHouse from '../components/_convenience/quick-add-house';

const newHouseButton = css`
  margin-bottom: 18px;
  float: right;
`;

export const GET_HOUSES = gql`
  query GetHouses($userId: String!) {
    houses(where: { userId: { _eq: $userId } }) {
      ...House
    }
  }
  ${HOUSE_FRAGMENT}
`;

const IndexPage: React.FC = () => {
  const [session] = useSession();
  const { loading, error, data } = useQuery(GET_HOUSES, {
    variables: { userId: session.user.id },
  });

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;

  return (
    <div>
      {/* <QuickAddHouse /> */}
      <Link href="/form">
        <a>
          <Button type="primary" css={newHouseButton}>
            <PlusOutlined /> Property
          </Button>
        </a>
      </Link>

      <HousesTable houses={data.houses} />
    </div>
  );
};

export default IndexPage;
