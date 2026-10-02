import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    global.fetch = jest.fn((url) => {
      const response = {
        ok: true,
        text: async () => JSON.stringify([]),
      };

      return Promise.resolve(response);
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('renders the admissions dashboard heading', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/student admission system/i)).toBeInTheDocument();
    });
  });
});
