import '@testing-library/jest-dom';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Automatically unmount and cleanup DOM after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia for responsive/reduced-motion tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
