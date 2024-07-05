import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import WelcomePage from '../components/WelcomePage/WelcomePage.jsx';

test('renders WelcomePage component', () => {
  const { getByText } = render(
    <MemoryRouter>
      <WelcomePage />
    </MemoryRouter>
  );
  expect(getByText(/Let's get you started on Andromeda./i)).toBeInTheDocument();
});