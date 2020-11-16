import { PlusOutlined } from '@ant-design/icons';
import { gql, useMutation } from '@apollo/client';
import { Button } from 'antd';
import faker from 'faker';
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

const maybeGet = (callback: () => unknown) => (getRandomNum(1, 100) > 50 ? callback() : undefined);

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
    const address1 = faker.address.streetAddress();
    const house = {
      address1,
      address2: maybeGet(() => faker.address.secondaryAddress()),
      city: faker.address.city(),
      country: faker.address.country(),
      name: `${address1} (Auto-generated)`,
      notes: maybeGet(() => faker.random.words()),
      price: getRandomNum(50000, 100000000),
      size: getRandomNum(100, 10000),
      state: faker.address.stateAbbr(),
      type: 'House',
      url: maybeGet(() => faker.internet.url()),
      userId: session.user.id,
      zip: faker.address.zipCode(),
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
