import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DELETE_HOUSE, UPDATE_HOUSE } from '../components/houses-table';
import IndexPage, { GET_PROPERTIES } from '../pages/index';
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
    notes: 'I am a note',
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
      query: DELETE_HOUSE,
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

  it('updates a property', async function () {
    jest.spyOn(console, 'warn').mockImplementation(() => null);
    const UPDATED_NOTES_VALUE = 'I am the new note';

    const updateMock = {
      request: {
        query: UPDATE_HOUSE,
        variables: {
          id: mockProperties[0].id,
          _fields: {
            name: mockProperties[0].name,
            price: mockProperties[0].price,
            size: mockProperties[0].size,
            type: mockProperties[0].type,
            notes: UPDATED_NOTES_VALUE,
          },
        },
      },
      result: {
        data: {
          update_properties_by_pk: { id: 1, __typename: 'properties' },
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
