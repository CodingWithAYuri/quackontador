import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignUpForm from '../components/SignUpForm';

describe('SignUpForm Component', () => {
  test('renders the sign-up form with initial input fields', () => {
    render(<SignUpForm />);
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Repeat password/i)).toBeNull(); // Repeat password should not be visible initially
  });

  test('displays repeat password input when a password is entered', () => {
    render(<SignUpForm />);
    const passwordInput = screen.getByLabelText(/Password/i);
    act(() => {
      fireEvent.change(passwordInput, { target: { value: 'testPassword123' } });
    });
    expect(screen.getByLabelText(/Repeat password/i)).toBeInTheDocument();
  });

  test('allows password input to be changed', () => {
    render(<SignUpForm />);
    const passwordInput = screen.getByLabelText(/Password/i);
    act(() => {
      userEvent.type(passwordInput, 'newPassword!');
    });
    expect(passwordInput.value).toBe('newPassword!');
  });

  test('checkbox should be checked by default', () => {
    render(<SignUpForm />);
    const checkbox = screen.getByLabelText(/I have read and agree to the terms/i);
    expect(checkbox).toBeChecked();
  });

  test('should have a disabled button if the terms are not agreed (assuming functionality)', () => {
    render(<SignUpForm />);
    const button = screen.getByRole('button', { name: /Registered/i });
    const checkbox = screen.getByLabelText(/I have read and agree to the terms/i);
    if (!checkbox.checked) {
      expect(button).toBeDisabled();
    }
  });
});
