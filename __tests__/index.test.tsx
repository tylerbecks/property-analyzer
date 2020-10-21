import * as client from '@apollo/client';
import { render, screen } from '@testing-library/react';

import Index from '../pages/index';

jest.mock('next-auth/client', () => ({
  useSession: () => [{ user: { id: 123 } }],
}));

const mockProperties = [
  {
    __typename: 'properties',
    address_1: '123 Foobar St',
    address_2: 'Unit 420',
    city: 'Austin',
    country: 'United States',
    name: '123 Foobar St',
    notes: null,
    price: 100000,
    size: 550,
    state: 'TX',
    type: 'Apartment',
    url: null,
    zip: 78702,
  },
];

jest.spyOn(client, 'useQuery').mockImplementation(() => ({
  loading: false,
  error: false,
  data: { properties: mockProperties },
}));

describe('Index', () => {
  it('renders the address cell of the first property returned from the api', () => {
    render(<Index />);
    const addressCell = screen.getByRole('cell', {
      name: /123 foobar st unit 420 austin, tx, 78702/i,
    });
    expect(addressCell).toBeInTheDocument();
  });
});
