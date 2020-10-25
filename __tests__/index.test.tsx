import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import IndexPage, { DELETE_PROPERTY, GET_PROPERTIES } from '../pages/index';
import { waitForResponse } from '../testing_utils';

jest.mock('next-auth/client', () => ({
  useSession: () => [{ user: { id: 123 } }],
}));

const mockProperties = [
  {
    id: 1,
    user_id: 123,
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
    __typename: 'properties',
  },
  {
    id: 2,
    user_id: 123,
    address_1: '456 Baz St',
    address_2: null,
    city: 'LA',
    country: 'USA',
    name: '456 Baz St',
    notes: null,
    price: 100000,
    size: 550,
    state: 'TX',
    type: 'Apartment',
    url: null,
    zip: 78702,
    __typename: 'properties',
  },
];

const mocks = [
  {
    request: {
      query: GET_PROPERTIES,
      variables: { userId: 123 },
    },
    result: {
      data: {
        properties: mockProperties,
      },
    },
  },
  {
    request: {
      query: DELETE_PROPERTY,
      variables: { id: 1 },
    },
    result: {
      data: {
        delete_properties_by_pk: { id: 1, __typename: 'properties' },
      },
    },
  },
];

describe('IndexPage', () => {
  it('renders empty state if api returns no properties', async function () {
    const emptyMockedData = [
      {
        request: {
          query: GET_PROPERTIES,
          variables: { userId: 123 },
        },
        result: {
          data: {
            properties: [],
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={emptyMockedData}>
        <IndexPage />
      </MockedProvider>
    );

    await waitForResponse();

    const noData = screen.getByRole('cell', { name: /no data/i });
    expect(noData).toBeInTheDocument();
  });

  it('renders the address cell of the first property returned from the api', async function () {
    render(
      <MockedProvider mocks={mocks}>
        <IndexPage />
      </MockedProvider>
    );

    await waitForResponse();

    const addressCell = screen.getByRole('cell', {
      name: /123 foobar st unit 420 austin, tx, 78702/i,
    });
    expect(addressCell).toBeInTheDocument();
  });

  it('deletes a property', async function () {
    render(
      <MockedProvider mocks={mocks}>
        <IndexPage />
      </MockedProvider>
    );

    await waitForResponse();

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });

    userEvent.click(deleteButtons[0]);

    await waitForResponse();

    const addressCell = screen.queryByRole('cell', {
      name: /123 foobar st unit 420 austin, tx, 78702/i,
    });
    expect(addressCell).not.toBeInTheDocument();
  });
});
