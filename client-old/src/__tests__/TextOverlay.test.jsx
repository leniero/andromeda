import React from 'react';
import { render } from '@testing-library/react';
import * as THREE from 'three';
import TextOverlay from '../components/TextOverlay/TextOverlay';

describe('TextOverlay', () => {
  test('renders without crashing', () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera();
    const emotionsData = [
      { _id: '1', text_input: 'Test emotion', local_time: '2024-07-01T00:00:00Z', latitude: 0, longitude: 0 },
    ];

    render(<TextOverlay emotionsData={emotionsData} scene={scene} camera={camera} />);
  });
});