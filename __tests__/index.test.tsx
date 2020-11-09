import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DELETE_HOUSE, UPDATE_HOUSE } from '../components/houses-table';
import { GET_HOUSES, IndexPage } from '../pages/index';
import { waitForResponse } from '../testing_utils';

jest.mock('next-auth/client', () => ({
  useSession: () => [{ user: { id: 123 } }],
}));

const mockHouses = [
  {
    id: 1,
    userId: 123,
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
    url: null,
    zip: 78702,
    __typename: 'houses',
  },
  {
    id: 2,
    userId: 123,
    address1: '456 Baz St',
    address2: null,
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
    __typename: 'houses',
  },
];

const mocks = [
  {
    request: {
      query: GET_HOUSES,
      variables: { userId: 123 },
    },
    result: {
      data: {
        houses: mockHouses,
      },
    },
  },
  {
    request: {
      query: DELETE_HOUSE,
      variables: { id: 1 },
    },
    result: {
      data: {
        delete_houses_by_pk: { id: 1, __typename: 'houses' },
      },
    },
  },
];

describe('IndexPage', () => {
  it('renders empty state if api returns no houses', async function () {
    const emptyMockedData = [
      {
        request: {
          query: GET_HOUSES,
          variables: { userId: 123 },
        },
        result: {
          data: {
            houses: [],
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

  it('renders the address cell of the first house returned from the api', async function () {
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

  it('deletes a house', async function () {
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

  it('updates a house', async function () {
    jest.spyOn(console, 'warn').mockImplementation(() => null);
    const UPDATED_NOTES_VALUE = 'I am the new note';

    const updateMock = {
      request: {
        query: UPDATE_HOUSE,
        variables: {
          id: mockHouses[0].id,
          _fields: {
            address1: mockHouses[0].address1,
            name: mockHouses[0].name,
            price: mockHouses[0].price,
            size: mockHouses[0].size,
            type: mockHouses[0].type,
            notes: UPDATED_NOTES_VALUE,
          },
        },
      },
      result: {
        data: {
          update_houses_by_pk: { id: 1, __typename: 'houses' },
        },
      },
    };

    render(
      <MockedProvider mocks={[...mocks, updateMock]}>
        <IndexPage />
      </MockedProvider>
    );

    await waitForResponse();

    const originalNotesCell = screen.getByRole('cell', { name: /i am a note/i });
    expect(originalNotesCell).toBeInTheDocument();

    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    userEvent.click(editButtons[0]);

    const notesInput = screen.getByDisplayValue(/i am a note/i);
    userEvent.clear(notesInput);
    userEvent.type(notesInput, UPDATED_NOTES_VALUE);

    const saveButton = screen.getByRole('button', { name: /save/i });
    userEvent.click(saveButton);

    const updatedNotesCell = screen.getByRole('cell', { name: UPDATED_NOTES_VALUE });
    expect(updatedNotesCell).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getAllByRole('button', { name: /edit/i })[0]).toHaveAttribute('disabled')
    );
  });
});
