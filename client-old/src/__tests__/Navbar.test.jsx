import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';

describe('Navbar', () => {
  test('renders Navbar component', () => {
    const { getByText } = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(getByText(/Home/i)).toBeInTheDocument();
    expect(getByText(/eCloud/i)).toBeInTheDocument();
  });

  test('shows login and sign up links when not authenticated', () => {
    localStorage.removeItem('token'); // Ensure token is not present
    const { getByText } = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(getByText(/Login/i)).toBeInTheDocument();
    expect(getByText(/Sign Up/i)).toBeInTheDocument();
  });

  test('shows dashboard and logout links when authenticated', () => {
    localStorage.setItem('token', 'dummy-token'); // Set a dummy token
    const { getByText } = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(getByText(/Dashboard/i)).toBeInTheDocument();
    expect(getByText(/Logout/i)).toBeInTheDocument();
  });

  test('handles logout', () => {
    localStorage.setItem('token', 'dummy-token'); // Set a dummy token
    const { getByText } = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    fireEvent.click(getByText(/Logout/i));
    expect(localStorage.getItem('token')).toBeNull(); // Token should be removed
  });
});