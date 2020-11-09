import { gql, useMutation, useQuery } from '@apollo/client';
import { Col, Descriptions, Form, Row, Statistic, Typography } from 'antd';
import { useRouter } from 'next/router';

import ErrorScreen from '../../components/error-screen';
import InputCurrency from '../../components/input-currency';
import LoadingScreen from '../../components/loading-screen';
import withUserAndApollo from '../../components/with-user-and-apollo';
import { HOUSE_FRAGMENT } from '../../fragments/house';
import { House } from '../../types/house';

const { Title, Paragraph, Text } = Typography;

// TODO add fields to update operating costs
const OPERATING_COSTS = 0;

const UPDATE_HOUSE_INCOME = gql`
  mutation UpdateHouseRentalIncome($propertyId: Int!, $rentalIncome: Int) {
    update_houses_by_pk(pk_columns: { id: $propertyId }, _set: { rentalIncome: $rentalIncome }) {
      id
      rentalIncome
    }
  }
`;

interface FullHouse extends House {
  rentalIncome: number | undefined;
}

export const GET_HOUSE_BY_ID = gql`
  query GetHouseById($propertyId: Int!) {
    houses_by_pk(id: $propertyId) {
      rentalIncome
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
  const [updateHouseIncome] = useMutation(UPDATE_HOUSE_INCOME);

  if (loading) {
    return <LoadingScreen />;
  }
  if (error) {
    return <ErrorScreen error={error} />;
  }

  const { houses_by_pk: house }: { houses_by_pk: FullHouse } = data;

  const onChangeRentalIncome = (value: string) => {
    const valueNum = Number(value);
    if (Number.isNaN(valueNum)) {
      return;
    }

    updateHouseIncome({
      variables: { rentalIncome: valueNum, propertyId },
      optimisticResponse: {
        __typename: 'Mutation',
        houses_by_pk: {
          ...house,
          __typename: 'houses',
          rentalIncome: valueNum,
        },
      },
    });
  };

  const netOperatingIncome = house.rentalIncome ? house.rentalIncome - OPERATING_COSTS : 0;
  const capRate = house.rentalIncome ? netOperatingIncome / house.price : null;

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
          <Descriptions.Item label="Purchase Price">{house.price}</Descriptions.Item>
          <Descriptions.Item label="Size">{house.size.toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="Type">{house.type}</Descriptions.Item>
          <Descriptions.Item label="Notes">{house.notes}</Descriptions.Item>
        </Descriptions>

        <Form>
          <Form.Item
            name="rentalIncome"
            label="Potential Rental Income"
            rules={[{ type: 'number', min: 0 }]}
            initialValue={house.rentalIncome}
          >
            <InputCurrency onChange={onChangeRentalIncome} />
          </Form.Item>
        </Form>
      </Col>
      <Col span={12}>
        <Title level={3}>Stats</Title>
        {capRate ? (
          <Statistic
            title="Cap Rate"
            value={capRate.toFixed(2)}
            precision={2}
            formatter={(value) => `${value}%`}
          />
        ) : (
          <Paragraph>Please Enter rental income to see the cap rate</Paragraph>
        )}
      </Col>
    </Row>
  );
};

export default withUserAndApollo(HousePage);
