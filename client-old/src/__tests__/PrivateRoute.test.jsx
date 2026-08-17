import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';
import HomePage from '../components/HomePage/HomePage';
import LoginPage from '../components/LoginPage/LoginPage';

describe('PrivateRoute', () => {
  test('redirects to login if not authenticated', () => {
    localStorage.removeItem('token'); // Ensure token is not present
    const { getByText } = render(
      <MemoryRouter initialEntries={['/home']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<PrivateRoute />}>
            <Route path="/home" element={<HomePage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(getByText(/Login/i)).toBeInTheDocument();
  });

  test('renders the component if authenticated', () => {
    localStorage.setItem('token', 'dummy-token'); // Set a dummy token
    const { getByText } = render(
      <MemoryRouter initialEntries={['/home']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<PrivateRoute />}>
            <Route path="/home" element={<HomePage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(getByText(/Hey hey!/i)).toBeInTheDocument();
  });
});