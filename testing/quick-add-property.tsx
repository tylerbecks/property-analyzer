import { PlusOutlined } from '@ant-design/icons';
import { gql, useMutation } from '@apollo/client';
import { Button } from 'antd';
import { useSession } from 'next-auth/client';

import { PROPERTY_FRAGMENT } from '../fragments/property';
import { GET_PROPERTIES } from '../pages/index';

const ADD_PROPERTY = gql`
  mutation AddProperty($property: properties_insert_input!) {
    insert_properties_one(object: $property) {
      id
      user_id
      ...PROPERTY
    }
  }
  ${PROPERTY_FRAGMENT}
`;

// The maximum is exclusive and the minimum is inclusive
const getRandomNum = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min);

const QuickAddButton: React.FC = () => {
  const [session] = useSession();
  const [addProperty] = useMutation(ADD_PROPERTY, {
    update(cache, { data: { insert_properties_one } }) {
      const { properties: existingProperties } = cache.readQuery({
        query: GET_PROPERTIES,
        variables: { userId: session.user.id },
      });

      cache.writeQuery({
        query: GET_PROPERTIES,
        variables: { userId: session.user.id },
        data: { properties: [...existingProperties, insert_properties_one] },
      });
    },
  });

  const onClick = () => {
    const property = {
      address_1: `${getRandomNum(1, 9999)} Random Street`,
      address_2: undefined,
      city: 'Austin',
      country: 'USA',
      name: 'Auto-generated',
      notes: 'I am a note',
      price: getRandomNum(50000, 100000000),
      size: getRandomNum(100, 10000),
      state: 'TX',
      type: 'House',
      url: undefined,
      user_id: session.user.id,
      zip: getRandomNum(10000, 99999),
    };

    addProperty({
      variables: { property },
    });
  };

  return (
    <Button type="primary" onClick={onClick}>
      <PlusOutlined /> Quick Add Property
    </Button>
  );
};

export default QuickAddButton;
