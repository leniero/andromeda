import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import EmotionList from '../components/EmotionList/EmotionList';
import '@testing-library/jest-dom/extend-expect';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

describe('EmotionList', () => {
  beforeEach(() => {
    mock.reset();
  });

  test('fetches and displays emotions', async () => {
    const emotions = [
      { _id: '1', emotion: 'Joy', text_input: 'Feeling great!', local_time: '2024-06-26T12:00:00Z' },
      { _id: '2', emotion: 'Sadness', text_input: 'Feeling down', local_time: '2024-06-26T13:00:00Z' },
    ];
    mock.onGet('https://f176-82-5-177-229.ngrok-free.app/api/emotions/get_emotions').reply(200, emotions);

    render(<EmotionList />);

    await waitFor(() => {
      expect(screen.getByText(/Feeling great!/i)).toBeInTheDocument();
      expect(screen.getByText(/Feeling down/i)).toBeInTheDocument();
    });
  });

  test('displays error message when fetching emotions fails', async () => {
    mock.onGet('https://f176-82-5-177-229.ngrok-free.app/api/emotions/get_emotions').reply(500);

    render(<EmotionList />);

    await waitFor(() => {
      expect(screen.getByText(/Error fetching emotions/i)).toBeInTheDocument();
    });
  });
});