import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RingNavigation from '../components/RingNavigation/RingNavigation';

describe('RingNavigation', () => {
  test('renders RingNavigation component', () => {
    const { getByText } = render(
      <MemoryRouter>
        <RingNavigation setIsBlurred={jest.fn()} />
      </MemoryRouter>
    );

    expect(getByText(/X/i)).toBeInTheDocument();
  });

  test('toggles menu visibility', () => {
    const { getByText } = render(
      <MemoryRouter>
        <RingNavigation setIsBlurred={jest.fn()} />
      </MemoryRouter>
    );

    fireEvent.click(getByText(/X/i)); // Open menu
    expect(getByText(/LIST/i)).toBeInTheDocument();
    expect(getByText(/ME/i)).toBeInTheDocument();
    expect(getByText(/LOG/i)).toBeInTheDocument();

    fireEvent.click(getByText(/X/i)); // Close menu
    expect(() => getByText(/LIST/i)).toThrow();
  });
});