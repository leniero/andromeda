import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import EmotionForm from '../components/EmotionForm/EmotionForm.jsx';

const mock = new MockAdapter(axios);

describe('EmotionForm', () => {
  let container = null;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
    mock.reset();
  });

  test('renders EmotionForm component', () => {
    act(() => {
      const root = createRoot(container);
      root.render(<EmotionForm />);
    });

    const select = container.querySelector('select');
    expect(select).toBeInTheDocument();
  });

  test('submits form', async () => {
    const onEmotionSubmitted = jest.fn();

    mock.onPost(`${process.env.REACT_APP_API_URL}emotions/record_emotion`).reply(200, {});

    await act(async () => {
      const root = createRoot(container);
      root.render(<EmotionForm setEmotion={jest.fn()} onEmotionSubmitted={onEmotionSubmitted} />);
    });

    fireEvent.change(container.querySelector('select'), { target: { value: 'Joy' } });
    fireEvent.change(container.querySelector('textarea'), { target: { value: 'I feel happy' } });

    await act(async () => {
      fireEvent.submit(container.querySelector('form'));
    });

    await