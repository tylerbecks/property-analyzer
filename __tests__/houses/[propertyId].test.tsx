import { getNetMonthlyRevenue } from '../../pages/houses/[propertyId]';

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
