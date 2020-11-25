import { getBuyWaterfall } from '../home-purchase-utils';
import { round } from '../num-helpers';

test('it calculates one year of the waterfall correctly', () => {
  const homeValue = 100000;
  const insurance = 100;
  const mortgageTotal = 80000;
  const operatingExpenses = 100;
  const propertyTaxRate = 0.02;
  const interestRate = 0.03;
  const inflationRate = 0.03;
  const appreciationRate = 0.05;
  const loanTermMonths = 360;
  const netMonthlyRentalIncome = 500;
  const marginalIncomeTaxRate = 0.3;

  const result = getBuyWaterfall(
    homeValue,
    insurance,
    mortgageTotal,
    operatingExpenses,
    propertyTaxRate,
    interestRate,
    inflationRate,
    appreciationRate,
    loanTermMonths,
    netMonthlyRentalIncome,
    marginalIncomeTaxRate
  );

  expect(round(result[12].homeValue)).toBe(105000);
  expect(round(result[12].taxes)).toBe(175);
  expect(round(result[12].insurance)).toBe(103);
  expect(round(result[12].remainingMortgage)).toBe(78470.87);
  expect(round(result[12].interestAmount)).toBe(196.18);
  expect(round(result[12].principal)).toBe(141.11);
  expect(round(result[12].piti)).toBe(615.28);
  expect(round(result[12].operatingExpenses)).toBe(103);
  expect(round(result[12].netRentalIncome)).toBe(525);
  expect(round(result[12].cashFlow)).toBe(-193.28);
  expect(round(result[12].equity)).toBe(26529.13);
  expect(round(result[12].interestDeduction)).toBe(58.85);
  expect(round(result[12].netWorth)).toBe(26587.99);
});
