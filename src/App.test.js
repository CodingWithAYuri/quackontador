import { render, screen } from '@testing-library/react';
import App from './App';

test('renders navigation link to calculations page', () => {
  render(<App />);
  const linkElement = screen.getByText(/Vamos aos cálculos!/i);
  expect(linkElement).toBeInTheDocument();
});
