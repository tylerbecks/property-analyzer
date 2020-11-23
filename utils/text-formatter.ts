export const formatCurrency = (value: string | number): string => {
  if (typeof value === 'string') {
    value = Number(value);
  }

  value = Math.round((value + Number.EPSILON) * 100) / 100;

  return `$${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
