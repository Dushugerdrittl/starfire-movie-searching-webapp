import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Movie Search heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Movie Search/i);
  expect(headingElement).toBeInTheDocument();
});
