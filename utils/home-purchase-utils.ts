interface BuyDataPoint {
  homeValue: number;
  taxes: number;
  insurance: number;
  remainingMortgage: number;
  interestAmount: number;
  principal: number;
  piti: number;
  operatingExpenses: number;
  netRentalIncome: number;
  cashFlow: number;
  equity: number;
  interestDeduction: number;
  netWorth: number;
}

export const getBuyWaterfall = (
  initialHomeValue: number,
  initialInsurance: number,
  initialMortgageTotal: number,
  initialOperatingExpenses: number,
  propertyTaxRate: number,
  interestRate: number,
  inflationRate: number,
  appreciationRate: number,
  loanTermMonths: number,
  initialNetMonthlyRentalIncome: number,
  marginalIncomeTaxRate: number // TODO calculate for all tax brackets based on income
): BuyDataPoint[] => {
  const initialTaxes = getMonthlyTaxes(propertyTaxRate, initialHomeValue);
  const mortgagePayment = pmt(interestRate, loanTermMonths, initialMortgageTotal);

  const initialPITI = mortgagePayment + initialTaxes + initialInsurance;
  const downPayment = initialHomeValue - initialMortgageTotal;
  const netWorthPoints = [
    {
      cashFlow: initialNetMonthlyRentalIncome - initialPITI - initialOperatingExpenses,
      equity: downPayment,
      homeValue: initialHomeValue,
      insurance: initialInsurance,
      interestAmount: 0,
      interestDeduction: 0,
      netRentalIncome: initialNetMonthlyRentalIncome,
      netWorth: downPayment,
      operatingExpenses: initialOperatingExpenses,
      piti: initialPITI,
      principal: 0,
      remainingMortgage: initialMortgageTotal,
      taxes: initialTaxes,
    },
  ];

  for (let i = netWorthPoints.length; i < loanTermMonths; i++) {
    const {
      homeValue,
      insurance,
      netRentalIncome,
      operatingExpenses,
      principal,
      remainingMortgage,
    } = netWorthPoints[i - 1];
    const isNewYear = i % 12 === 0;
    const newHomeValue = getMonthlyGrowth(homeValue, appreciationRate);
    const newTaxes = getMonthlyTaxes(propertyTaxRate, newHomeValue);
    const newInsurance = getMonthlyGrowth(insurance, inflationRate);
    const newRemainingMortgage = remainingMortgage - principal;
    const newInterestAmount = newRemainingMortgage * (interestRate / 12);
    const newPITI = mortgagePayment + newTaxes + newInsurance;
    const newOperatingExpenses = getMonthlyGrowth(operatingExpenses, inflationRate);
    const newNetRentalIncome = isNewYear
      ? netRentalIncome + netRentalIncome * appreciationRate
      : netRentalIncome;
    const newEquity = newHomeValue - newRemainingMortgage;
    const newInterestDeduction = newInterestAmount * marginalIncomeTaxRate;

    netWorthPoints.push({
      cashFlow: newNetRentalIncome - newPITI - newOperatingExpenses,
      equity: newEquity,
      homeValue: newHomeValue,
      insurance: newInsurance,
      interestAmount: newInterestAmount,
      interestDeduction: newInterestDeduction,
      netRentalIncome: newNetRentalIncome,
      netWorth: newEquity + newInterestDeduction,
      operatingExpenses: newOperatingExpenses,
      piti: newPITI,
      principal: mortgagePayment - newInterestAmount,
      remainingMortgage: newRemainingMortgage,
      taxes: newTaxes,
    });
  }

  return netWorthPoints;
};

const pmt = (annualRate: number, loanTermCount: number, totalValue: number) => {
  const monthlyRate = annualRate / 12;
  const discountFactor =
    ((1 + monthlyRate) ** loanTermCount - 1) / (monthlyRate * (1 + monthlyRate) ** loanTermCount);

  return totalValue / discountFactor;
};

const getMonthlyTaxes = (annualTaxRate: number, homeValue: number) =>
  (homeValue * annualTaxRate) / 12;

const getMonthlyGrowth = (value: number, annualGrowthRate: number) => {
  const monthlyGrowthRate = (1 + annualGrowthRate) ** (1 / 12) - 1;
  const growthAmount = value * monthlyGrowthRate;

  return value + growthAmount;
};
