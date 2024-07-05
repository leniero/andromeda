import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../components/LoginPage/LoginPage.jsx';

test('renders LoginPage component', () => {
  const { getByText, getByLabelText } = render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );
  expect(getByText(/Login/i)).toBeInTheDocument();
  expect(getByLabelText(/Email/i)).toBeInTheDocument();
  expect(getByLabelText(/Password/i)).toBeInTheDocument();
});

test('submits login form', () => {
  const { getByLabelText, getByText } = render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );

  fireEvent.change(getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
  fireEvent.change(getByLabelText(/Password/i), { target: { value: 'password' } });
  fireEvent.click(getByText(/Login/i));

  // Add more assertions as needed
});