import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import IndexPage, { DELETE_PROPERTY, GET_PROPERTIES } from '../pages/index';

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
        properties: { id: 1 },
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
      <MockedProvider mocks={emptyMockedData} addTypename={false}>
        <IndexPage />
      </MockedProvider>
    );

    await waitFor(() => new Promise((resolve) => setTimeout(resolve, 0))); // wait for response

    const noData = screen.getByRole('cell', { name: /no data/i });
    expect(noData).toBeInTheDocument();
  });

  // TODO fix tests with fragments
  it.skip('renders the address cell of the first property returned from the api', async function () {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <IndexPage />
      </MockedProvider>
    );

    await waitFor(() => new Promise((resolve) => setTimeout(resolve, 0))); // wait for response

    const addressCell = screen.getByRole('cell', {
      name: /123 foobar st unit 420 austin, tx, 78702/i,
    });
    expect(addressCell).toBeInTheDocument();
  });

  // TODO fix tests with fragments
  it.skip('deletes a property', async function () {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <IndexPage />
      </MockedProvider>
    );

    await waitFor(() => new Promise((resolve) => setTimeout(resolve, 0))); // wait for response

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });

    userEvent.click(deleteButtons[0]);

    await waitFor(() => new Promise((resolve) => setTimeout(resolve, 0))); // wait for response

    const addressCell = screen.getByRole('cell', {
      name: /123 foobar st unit 420 austin, tx, 78702/i,
    });
    expect(addressCell).not.toBeInTheDocument();
  });
});
