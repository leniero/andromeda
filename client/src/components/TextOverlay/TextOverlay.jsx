import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import './TextOverlay.module.css';

const TextOverlay = ({ emotionsData, scene, camera }) => {
  const textMeshRef = useRef([]);

  useEffect(() => {
    if (!camera) {
      console.error('Camera is not defined');
      return;
    }

    const loader = new FontLoader();
    loader.load('/fonts/SFProDisplay_Regular.json', font => {
      emotionsData.forEach(emotion => {
        const sphere = scene.children.find(
          obj => obj.userData && obj.userData.emotion._id === emotion._id
        );

        if (sphere) {
          const textGroup = createTextGroup(font, emotion);
          textGroup.userData = { sphere, emotion, rotationSpeed: -(Math.random() * 0.0005 + 0.00025) };
          scene.add(textGroup);
          textMeshRef.current.push(textGroup);
          console.log('Text group added:', textGroup);
        }
      });
    });

    return () => {
      textMeshRef.current.forEach(textGroup => scene.remove(textGroup));
      textMeshRef.current = [];
    };
  }, [emotionsData, scene, camera]);

  const createTextGroup = (font, emotion) => {
    const textGroup = new THREE.Group();
    const textLength = emotion.text_input.length;
    const angleIncrement = (2 * Math.PI) / textLength;
    const radius = 250; // Radius for circular text layout

    for (let i = 0; i < textLength; i++) {
      const charGeometry = new TextGeometry(emotion.text_input.charAt(i), {
        font: font,
        size: 45,
        depth: 1,
        curveSegments: 24,
        bevelEnabled: false,
      });

      const charMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const charMesh = new THREE.Mesh(charGeometry, charMaterial);

      const angle = i * angleIncrement;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);

      charMesh.position.set(x, y, 0);
      charMesh.rotation.z = angle + Math.PI / 2; // Facing outward

      textGroup.add(charMesh);
    }

    return textGroup;
  };

  useEffect(() => {
    const animate = () => {
      requestAnimationFrame(animate);

      textMeshRef.current.forEach(textGroup => {
        const { sphere, rotationSpeed } = textGroup.userData;
        if (sphere) {
          textGroup.position.copy(sphere.position);
          textGroup.rotation.z += rotationSpeed; // Rotate around the Z axis
        }
      });
    };

    animate();
  }, [camera]);

  return null; // This component does not render anything itself
};

export default TextOverlay;