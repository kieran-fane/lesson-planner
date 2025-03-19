import {it, beforeAll} from 'vitest';
import {render} from '@testing-library/react';
import App from '../App';

import loader from '../data/loader';

/**
 * Do not modify this function.
 */
beforeAll(() => {
  loader();
});

/**
 *
 */
it('Renders', async () => {
  render(<App />);
});
