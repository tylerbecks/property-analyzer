import { getRentNetWorthDataPoints } from '../buy-vs-rent-chart';

describe('getRentNetWorthDataPoints', () => {
  test('returns the correct number of months', () => {
    const rentPoints = getRentNetWorthDataPoints(100, 12, 0.1);

    expect(rentPoints.length).toBe(12);
  });

  test.skip('grows at correct rate with annual market rate', () => {
    const rentPoints = getRentNetWorthDataPoints(100, 24, 0.1);

    expect(rentPoints[11]).toBe(110);
    expect(rentPoints[23]).toBe(121);
  });
});
