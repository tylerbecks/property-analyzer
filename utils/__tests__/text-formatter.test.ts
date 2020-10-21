import { formatCurrency } from '../text-formatter';

test('it formats a single digit', () => {
  expect(formatCurrency('4')).toBe('$4');
});

test('it formats 1 thousand with 1 comma', () => {
  expect(formatCurrency('1000')).toBe('$1,000');
});

test('it formats 1 million with 1 comma', () => {
  expect(formatCurrency('1234567')).toBe('$1,234,567');
});