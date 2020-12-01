import { round } from './num-helpers';

export const formatCurrency = (value: string | number): string => {
  if (typeof value === 'string') {
    value = Number(value);
  }

  value = round(value);

  if (Math.round(value) !== value) {
    value = value.toFixed(2);
  }

  return `$${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
