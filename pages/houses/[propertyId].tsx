import { gql, useQuery } from '@apollo/client';
import { Col, Descriptions, Empty, Row, Typography } from 'antd';
import { useRouter } from 'next/router';

import ErrorScreen from '../../components/error-screen';
import LoadingScreen from '../../components/loading-screen';
import { HOUSE_FRAGMENT } from '../../fragments/house';
import { House } from '../../types/house';

const { Title, Paragraph, Text } = Typography;

export const GET_HOUSE_BY_ID = gql`
  query GetHouseById($propertyId: Int!) {
    houses_by_pk(id: $propertyId) {
      ...House
    }
  }
  ${HOUSE_FRAGMENT}
`;

const HousePage: React.FC = () => {
  const router = useRouter();
  const { propertyId } = router.query;

  const { loading, error, data } = useQuery(GET_HOUSE_BY_ID, {
    variables: { propertyId },
  });

  if (loading) {
    return <LoadingScreen />;
  }
  if (error) {
    return <ErrorScreen error={error} />;
  }

  const { houses_by_pk: house }: { houses_by_pk: House } = data;

  return (
    <Row>
      <Col span={12}>
        <Title level={2}>{house.name}</Title>
        <Paragraph>
          <div>
            <Text>{house.address1}</Text>
          </div>
          {house.address2 && (
            <div>
              <Text>{house.address2}</Text>
            </div>
          )}
          <div>
            <Text>{`${house.city}, ${house.state} ${house.zip}`}</Text>
          </div>
        </Paragraph>

        <Descriptions title="Details">
          <Descriptions.Item label="Price">{house.price}</Descriptions.Item>
          <Descriptions.Item label="Size">{house.size.toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="Type">{house.type}</Descriptions.Item>
          <Descriptions.Item label="Notes">{house.notes}</Descriptions.Item>
        </Descriptions>
      </Col>
      <Col span={12}>
        <Title level={3}>Stats</Title>
        <Paragraph>Coming Soon</Paragraph>
        <Empty />
      </Col>
    </Row>
  );
};

export default HousePage;
