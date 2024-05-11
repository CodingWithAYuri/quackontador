// Import all necessary dependencies at the top of your test file
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../components/LoginForm';
import { BrowserRouter as Router } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

// Mock react-router-dom's useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Use the actual for all non-hook parts
  useNavigate: jest.fn() // This needs to return a function that acts as navigate
}));

// Mock the HttpClient
jest.mock('../components/HttpClient', () => {
  const originalModule = jest.requireActual('../components/HttpClient');

  return {
    __esModule: true,
    default: jest.fn(() => ({
      get: jest.fn((url) => {
        if (url === '/api-login') {
          return Promise.resolve({ data: { id: 1, name: 'User', email: 'test@example.com' } });
        }
        return Promise.reject(new Error("Not found"));
      })
    })),
    ...originalModule,
  };
});

describe('LoginForm Component', () => {
  const mockNavigate = jest.fn(); // Create a mock function for navigate
  let consoleSpy;

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset mockNavigate to a fresh spy in each test
    useNavigate.mockReturnValue(mockNavigate);

    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    // Restore console.log to its original state
    consoleSpy.mockRestore();
  });

  test('should handle user login', async () => {
    render(<Router><LoginForm /></Router>);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/'); // Check if navigate has been called with '/'
    }, { timeout: 1000 });

    // Verify that console.log was called
    expect(consoleSpy).toHaveBeenCalled();

    // Check if any call to console.log included the specific substring
    const substring = "Login successful";
    const messageWasLogged = consoleSpy.mock.calls.some(callArgs => 
        callArgs.some(arg => typeof arg === 'string' && arg.includes(substring))
    );

    expect(messageWasLogged).toBe(true);
  });
});
