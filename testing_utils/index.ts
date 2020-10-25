import { waitFor } from '@testing-library/react';

export const waitForResponse = (time = 0): Promise<unknown> =>
  waitFor(() => new Promise((resolve) => setTimeout(resolve, time)));
