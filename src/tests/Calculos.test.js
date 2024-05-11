import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Calculos from '../components/Calculos';  

describe('Calculos Component', () => {
  test('renders the initial UI correctly', () => {
    render(<Calculos />);
    expect(screen.getByText('Calculadora')).toBeInTheDocument();
    expect(screen.getByText('Calcular')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  test('updates input field when value is changed', () => {
    render(<Calculos />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '3000' } });
    expect(input).toHaveValue('3000');
  });

  test('shows calculation results after form submission with valid input', async () => {
    render(<Calculos />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '3000' } });
    fireEvent.click(screen.getByText('Calcular'));

    expect(await screen.findByText('INSS')).toBeInTheDocument();
    expect(await screen.findByText('Imposto de Renda')).toBeInTheDocument();
  });

  test('does not show calculation results with invalid input', () => {
    render(<Calculos />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '-100' } });
    fireEvent.click(screen.getByText('Calcular'));

    expect(screen.queryByText('INSS')).not.toBeInTheDocument();
    expect(screen.queryByText('Imposto de Renda')).not.toBeInTheDocument();
  });

  test('correctly calculates INSS and IRPF for given salary', () => {
    render(<Calculos />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '3000' } });
    fireEvent.click(screen.getByText('Calcular'));

    // Using data-testid to assert specific outputs based on the logic provided in the original component
    const inssClt = screen.getByTestId('inssClt');
    const irpfClt = screen.getByTestId('irpfClt');

    expect(inssClt).toHaveTextContent('258.82');
    expect(irpfClt).toHaveTextContent('68.56');
  });
});
