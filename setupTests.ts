// optional: configure or set up a testing framework before each test
// if you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// used for __tests__/testing-library.js
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

// https://jestjs.io/docs/en/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
export const mockMatchMedia = (): void => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};
