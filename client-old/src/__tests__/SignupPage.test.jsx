import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SignupPage from '../components/SignupPage/SignupPage';
import { signup } from '../services/authService';

jest.mock('../services/authService');

describe('SignupPage', () => {
  test('renders SignupPage component', () => {
    const { getByText, getByLabelText } = render(
      <MemoryRouter>
        <SignupPage />
      </MemoryRouter>
    );

    expect(getByText(/Sign Up/i)).toBeInTheDocument();
    expect(getByLabelText(/Username/i)).toBeInTheDocument();
    expect(getByLabelText(/Email/i)).toBeInTheDocument();
    expect(getByLabelText(/Password/i)).toBeInTheDocument();
  });

  test('submits signup form', async () => {
    signup.mockResolvedValue({ data: { token: 'dummy-token' } });

    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <SignupPage />
      </MemoryRouter>
    );

    fireEvent.change(getByLabelText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(getByLabelText(/Password/i), { target: { value: 'password' } });

    fireEvent.click(getByText(/Sign Up/i));

    expect(signup).toHaveBeenCalledWith('testuser', 'test@example.com', 'password');
  });
});