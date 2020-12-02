import Chart, { ChartData, ChartTooltipItem } from 'chart.js';
import { add, format, startOfMonth } from 'date-fns';
import { useEffect, useRef } from 'react';

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
  buyPoints: number[];
  downPayment: number;
  annualMarketRate: number;
  loanTermYears: number;
}

const BuyVsRentChart: React.FC<Props> = ({
  downPayment,
  loanTermYears,
  annualMarketRate,
  buyPoints,
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const loanTermMonths = loanTermYears * MONTHS_IN_YEAR;
  const labels = getLabels(loanTermMonths);
  const rentPoints = getRentNetWorthDataPoints(downPayment, loanTermMonths, annualMarketRate);

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
                if (data.datasets === undefined || tooltipItem.datasetIndex === undefined) {
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

  return (
    <div>
      <canvas id="buy-vs-rent-chart" ref={chartRef} aria-label="Buy versus Rent Chart" />
      <p>This chart assumes the following:</p>
      <ul>
        <li>Interest Rate: 2.75%</li>
        <li>Loan Term: 30 years</li>
        <li>Marginal Income Tax Rate: 32%</li>
        <li>Market Rate of Return (used to calculate your net worth growth while renting): 7%</li>
      </ul>
    </div>
  );
};

export default BuyVsRentChart;
