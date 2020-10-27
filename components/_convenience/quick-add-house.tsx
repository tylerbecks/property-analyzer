import { PlusOutlined } from '@ant-design/icons';
import { gql, useMutation } from '@apollo/client';
import { Button } from 'antd';
import { useSession } from 'next-auth/client';

import { HOUSE_FRAGMENT } from '../../fragments/house';
import { GET_HOUSES } from '../../pages/index';
import { House } from '../../types/house';

const ADD_HOUSE = gql`
  mutation AddHouse($house: houses_insert_input!) {
    insert_houses_one(object: $house) {
      ...House
    }
  }
  ${HOUSE_FRAGMENT}
`;

// The maximum is exclusive and the minimum is inclusive
const getRandomNum = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min);

const QuickAddButton: React.FC = () => {
  const [session] = useSession();
  const [addHouse] = useMutation(ADD_HOUSE, {
    update(cache, { data: { insert_houses_one } }) {
      const data = cache.readQuery({
        query: GET_HOUSES,
        variables: { userId: session.user.id },
      }) as { houses: Array<House> };

      cache.writeQuery({
        query: GET_HOUSES,
        variables: { userId: session.user.id },
        data: {
          houses: [...data.houses, insert_houses_one],
        },
      });
    },
  });

  const onClick = () => {
    const house = {
      address1: `${getRandomNum(1, 9999)} Random Street`,
      address2: undefined,
      city: 'Austin',
      country: 'USA',
      name: 'Auto-generated',
      notes: 'I am a note',
      price: getRandomNum(50000, 100000000),
      size: getRandomNum(100, 10000),
      state: 'TX',
      type: 'House',
      url: undefined,
      userId: session.user.id,
      zip: getRandomNum(10000, 99999),
    };

    addHouse({
      variables: { house },
    });
  };

  return (
    <Button type="primary" onClick={onClick}>
      <PlusOutlined /> Quick Add House
    </Button>
  );
};

export default QuickAddButton;
