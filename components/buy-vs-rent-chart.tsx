import Chart, { ChartData, ChartTooltipItem } from 'chart.js';
import { add, format, startOfMonth } from 'date-fns';
import { useEffect, useRef } from 'react';

import { getBuyWaterfall } from '../utils/home-purchase-utils';
import { formatCurrency } from '../utils/text-formatter';

const CHART_RED = 'rgb(255, 99, 132)';
const CHART_BLUE = 'rgb(54, 162, 235)';
const MONTHS_IN_YEAR = 12;

export const getRentNetWorthDataPoints = (
  initialInvestment: number,
  months: number,
  annualMarketRate: number
): number[] => {
  const monthlyGrowthRate = (1 + annualMarketRate) ** (1 / MONTHS_IN_YEAR) - 1;
  const netWorthPoints = [initialInvestment];

  for (let i = netWorthPoints.length; i < months; i++) {
    const lastMonthNetWorth = netWorthPoints[i - 1];
    const growthAmount = lastMonthNetWorth * monthlyGrowthRate;

    netWorthPoints.push(lastMonthNetWorth + growthAmount);
  }

  return netWorthPoints;
};

const getLabels = (months: number) => {
  const monthLabels = [startOfMonth(new Date())];

  for (let i = 1; i < months - 1; i++) {
    const lastMonth = monthLabels[i - 1];
    monthLabels.push(add(lastMonth, { months: 1 }));
  }

  return monthLabels.map((date) => format(date, 'MMM yyyy'));
};

interface Props {
  annualInterestRate: number;
  annualMarketRate: number;
  downPayment: number;
  loanTermYears: number;
  purchasePrice: number;
  insurance: number;
  mortgageTotal: number;
  operatingExpenses: number;
  propertyTaxRate: number;
  inflationRate: number;
  appreciationRate: number;
  netMonthlyRentalIncome: number;
  marginalTaxRate: number;
}

const BuyVsRentChart: React.FC<Props> = ({
  downPayment,
  loanTermYears,
  annualMarketRate,
  purchasePrice,
  annualInterestRate,
  insurance,
  mortgageTotal,
  operatingExpenses,
  propertyTaxRate,
  inflationRate,
  appreciationRate,
  netMonthlyRentalIncome,
  marginalTaxRate,
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const loanTermMonths = loanTermYears * MONTHS_IN_YEAR;
  const labels = getLabels(loanTermMonths);
  const rentPoints = getRentNetWorthDataPoints(downPayment, loanTermMonths, annualMarketRate);

  const buyRows = getBuyWaterfall(
    purchasePrice,
    insurance,
    mortgageTotal,
    operatingExpenses,
    propertyTaxRate,
    annualInterestRate,
    inflationRate,
    appreciationRate,
    loanTermMonths,
    netMonthlyRentalIncome,
    marginalTaxRate
  );
  const buyPoints = buyRows.map(({ netWorth }) => netWorth);

  useEffect(() => {
    if (chartRef?.current) {
      const lineChartData = {
        labels,
        datasets: [
          {
            label: 'Rent',
            borderColor: CHART_BLUE,
            backgroundColor: CHART_BLUE,
            fill: false,
            data: rentPoints,
          },
          {
            label: 'Buy',
            borderColor: CHART_RED,
            backgroundColor: CHART_RED,
            fill: false,
            data: buyPoints,
          },
        ],
      };

      new Chart(chartRef.current, {
        type: 'line',
        data: lineChartData,
        options: {
          responsive: true,
          title: {
            display: true,
            text: 'Rent vs. Buy',
          },
          tooltips: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: (tooltipItem: ChartTooltipItem, data: ChartData) => {
                if (!data.datasets || !tooltipItem.datasetIndex) {
                  return '';
                }

                let label = data.datasets[tooltipItem.datasetIndex].label || '';

                if (label) {
                  label += ': ';
                }

                label += formatCurrency(tooltipItem.yLabel as number | string);
                return label;
              },
            },
          },
          hover: {
            mode: 'nearest',
            intersect: true,
          },
          scales: {
            xAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                },
              },
            ],
            yAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                },
                ticks: {
                  callback: (value: number) => formatCurrency(value),
                },
              },
            ],
          },
        },
      });
    }
  }, [labels, rentPoints, buyPoints]);

  return <canvas id="buy-vs-rent-chart" ref={chartRef} aria-label="Buy versus Rent Chart" />;
};

export default BuyVsRentChart;
