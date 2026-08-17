import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ChangePassword from '../components/ChangePassword/ChangePassword.jsx';

test('renders ChangePassword component', () => {
  const { getByText, getByLabelText } = render(
    <MemoryRouter>
      <ChangePassword />
    </MemoryRouter>
  );
  expect(getByText(/Change Password/i)).toBeInTheDocument();
  expect(getByLabelText(/Current Password/i)).toBeInTheDocument();
  expect(getByLabelText(/New Password/i)).toBeInTheDocument();
  expect(getByLabelText(/Confirm New Password/i)).toBeInTheDocument();
});

test('submits change password form', () => {
  const { getByLabelText, getByText } = render(
    <MemoryRouter>
      <ChangePassword />
    </MemoryRouter>
  );

  fireEvent.change(getByLabelText(/Current Password/i), { target: { value: 'current_password' } });
  fireEvent.change(getByLabelText(/New Password/i), { target: { value: 'new_password' } });
  fireEvent.change(getByLabelText(/Confirm New Password/i), { target: { value: 'new_password' } });
  fireEvent.click(getByText(/Change Password/i));

  // Add more assertions as needed
});