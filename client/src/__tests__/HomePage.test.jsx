import React from 'react';
import { render, screen } from '@testing-library/react';
import LogEmotion from '../components/LogEmotion/LogEmotion.jsx';
import '@testing-library/jest-dom/extend-expect';

describe('HomePage', () => {
  test('renders the heading', () => {
    render(<LogEmotion />);
    const headingElement = screen.getByText(/Right here. Right now. I feel/i);
    expect(headingElement).toBeInTheDocument();
  });
});