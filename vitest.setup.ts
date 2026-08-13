import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// React Testing Library doesn't auto-unmount between tests unless the test
// runner's globals are registered — clean up explicitly so component trees
// from one test don't leak into the next.
afterEach(() => {
  cleanup();
});
