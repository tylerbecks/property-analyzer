import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';

import HousesTable, { UPDATE_HOUSE } from '../houses-table';

const mockHouses = [
  {
    id: 1,
    userId: '123',
    address1: '123 Foobar St',
    address2: 'Unit 420',
    city: 'Austin',
    country: 'United States',
    name: '123 Foobar St',
    notes: 'I am a note',
    price: 100000,
    size: 550,
    state: 'TX',
    type: 'Apartment',
    url: undefined,
    zip: '78702',
    __typename: 'houses',
  },
  {
    id: 2,
    userId: '123',
    address1: '456 Baz St',
    address2: undefined,
    city: 'LA',
    country: 'USA',
    name: '456 Baz St',
    notes: undefined,
    price: 100000,
    size: 550,
    state: 'TX',
    type: 'Apartment',
    url: 'www.foo.com',
    zip: '90245',
    __typename: 'houses',
  },
];

const getUpdateMock = ({
  id = mockHouses[0].id,
  name = mockHouses[0].name,
  price = mockHouses[0].price,
  size = mockHouses[0].size,
  type = mockHouses[0].type,
  notes = mockHouses[0].notes,
} = {}) => ({
  request: {
    query: UPDATE_HOUSE,
    variables: {
      id,
      _fields: { name, price, size, type, notes },
    },
  },
  result: {
    data: {
      update_houses_by_pk: { id, __typename: 'houses' },
    },
  },
});

describe('HousesTable', () => {
  test('renders with no data', () => {
    render(
      <MockedProvider mocks={[getUpdateMock()]}>
        <HousesTable houses={[]} />
      </MockedProvider>
    );
    const noData = screen.getByRole('cell', { name: /no data/i });
    expect(noData).toBeInTheDocument();
  });
});
