import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';

import {
  FullHouse,
  GET_HOUSE_BY_ID,
  getNetMonthlyRevenue,
  HousePage,
} from '../../pages/houses/[propertyId]';
import { waitForResponse } from '../../testing_utils';

const USER_ID = '123';
const PROPERTY_ID = 789;

jest.mock('next/router', () => ({
  useRouter() {
    return {
      query: { propertyId: PROPERTY_ID },
    };
  },
}));
jest.mock('next-auth/client', () => ({
  useSession: () => [{ user: { id: USER_ID } }],
}));
jest.mock('chart.js');

const getMockHouse = (
  house: { [key: string]: any } = {},
  assumption: { [key: string]: any } = {}
): FullHouse => ({
  id: PROPERTY_ID,
  userId: USER_ID,
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
  rentalIncome: 0,
  ...house,
  assumption: {
    appreciation: 0,
    closing: 0,
    downPercent: 0,
    hoa: 0,
    id: 456,
    inflation: 0,
    maintenance: 0,
    management: 0,
    propertyInsurance: 0,
    tax: 0,
    utilities: 0,
    vacancy: 0,
    ...assumption,
  },
});

const getMocks = (house: FullHouse) => [
  {
    request: {
      query: GET_HOUSE_BY_ID,
      variables: {
        id: PROPERTY_ID,
      },
    },
    result: {
      data: {
        houses_by_pk: house,
      },
    },
  },
];

describe('HousePage', () => {
  it('does not display the cap rate when the house price is 0', async function () {
    const house = getMockHouse({ price: 0, rentalIncome: 1000 });

    render(
      <MockedProvider
        mocks={getMocks(house)}
        addTypename={false}
        defaultOptions={{
          watchQuery: { fetchPolicy: 'no-cache' },
          query: { fetchPolicy: 'no-cache' },
        }}
      >
        <HousePage />
      </MockedProvider>
    );

    await waitForResponse();

    const noCapRateNote = screen.getByText(
      /please enter rental income and purchase price to see the cap rate/i
    );
    expect(noCapRateNote).toBeInTheDocument();
  });

  it('does not display the cap rate when the rentalIncome is undefined', async function () {
    const house = getMockHouse({ rentalIncome: undefined, price: 500000 });

    render(
      <MockedProvider
        mocks={getMocks(house)}
        addTypename={false}
        defaultOptions={{
          watchQuery: { fetchPolicy: 'no-cache' },
          query: { fetchPolicy: 'no-cache' },
        }}
      >
        <HousePage />
      </MockedProvider>
    );

    await waitForResponse();

    const noCapRateNote = screen.getByText(
      /please enter rental income and purchase price to see the cap rate/i
    );
    expect(noCapRateNote).toBeInTheDocument();
  });

  it('displays the cap rate when the house price and rental income are defined', async function () {
    const house = getMockHouse({ rentalIncome: 1000, price: 500000 });

    render(
      <MockedProvider
        mocks={getMocks(house)}
        addTypename={false}
        defaultOptions={{
          watchQuery: { fetchPolicy: 'no-cache' },
          query: { fetchPolicy: 'no-cache' },
        }}
      >
        <HousePage />
      </MockedProvider>
    );

    await waitForResponse();

    const capRate = screen.getByText(/2.40%/i);
    expect(capRate).toBeInTheDocument();
  });

  it('alters the cap rate when vacancy rate is defined', async function () {
    const house = getMockHouse({ rentalIncome: 1000, price: 500000 }, { vacancy: 5 });

    render(
      <MockedProvider
        mocks={getMocks(house)}
        addTypename={false}
        defaultOptions={{
          watchQuery: { fetchPolicy: 'no-cache' },
          query: { fetchPolicy: 'no-cache' },
        }}
      >
        <HousePage />
      </MockedProvider>
    );

    await waitForResponse();

    const capRate = screen.getByText(/2.28%/i);
    expect(capRate).toBeInTheDocument();
  });

  it('alters the cap rate when vacancy rate is defined', async function () {
    const house = getMockHouse(
      { rentalIncome: 1000, price: 500000 },
      {
        hoa: 50,
        maintenance: 100,
        management: 50,
        propertyInsurance: 100,
        tax: 1,
        utilities: 100,
      }
    );

    render(
      <MockedProvider
        mocks={getMocks(house)}
        addTypename={false}
        defaultOptions={{
          watchQuery: { fetchPolicy: 'no-cache' },
          query: { fetchPolicy: 'no-cache' },
        }}
      >
        <HousePage />
      </MockedProvider>
    );

    await waitForResponse();

    const capRate = screen.getByText(/0.44%/i);
    expect(capRate).toBeInTheDocument();
  });
});

describe('getNetMonthlyRevenue', () => {
  it('returns the rentalIncome when vacancy is 0', async function () {
    const rentalIncome = 100;
    const vacancyRate = 0;

    expect(getNetMonthlyRevenue(rentalIncome, vacancyRate)).toBe(100);
  });

  it('returns the rentalIncome when vacancy is undefined', async function () {
    const rentalIncome = 100;
    const vacancyRate = undefined;

    expect(getNetMonthlyRevenue(rentalIncome, vacancyRate)).toBe(100);
  });

  it('returns 0 when rentalIncome is undefined', async function () {
    const rentalIncome = undefined;
    const vacancyRate = 5;

    expect(getNetMonthlyRevenue(rentalIncome, vacancyRate)).toBe(0);
  });

  it('returns adjusted rentalIncome when both rentalIncome and vacancyRate exist', async function () {
    const rentalIncome = 100;
    const vacancyRate = 5;

    expect(getNetMonthlyRevenue(rentalIncome, vacancyRate)).toBe(95);
  });
});
