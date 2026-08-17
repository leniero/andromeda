import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import MyAccount from '../components/MyAccount/MyAccount.jsx';

jest.mock('axios');

test('renders MyAccount component', async () => {
  axios.get.mockResolvedValue({
    data: { username: 'testuser', email: 'test@example.com' }
  });

  const { getByText } = render(
    <MemoryRouter>
      <MyAccount />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(getByText(/My Account/i)).toBeInTheDocument();
    expect(getByText(/@testuser/i)).toBeInTheDocument();
    expect(getByText(/test@example.com/i)).toBeInTheDocument();
  });
});