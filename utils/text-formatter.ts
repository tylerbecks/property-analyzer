export const formatCurrency = (value: string | number): string =>
  `$${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
