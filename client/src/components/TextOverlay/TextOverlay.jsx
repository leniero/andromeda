import { useEffect } from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import './TextOverlay.module.css';

const TextOverlay = ({ emotionsData, scene, camera, textMeshRef }) => {
  useEffect(() => {
    if (!camera || !scene) {
      console.error('Camera or Scene is not defined');
      return;
    }

    const loader = new FontLoader();
    loader.load('/fonts/SFProDisplay_Regular.json', font => {
      emotionsData.forEach(emotion => {
        const sphere = scene.children.find(
          obj => obj.userData && obj.userData.emotion._id === emotion._id
        );

        if (sphere) {
          const textGroup = createTextGroup(font, emotion, sphere.geometry.parameters.radius);
          textGroup.userData = { sphere, emotion, rotationSpeed: -0.0025 }; // Adjust this value for constant z-axis rotation
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
  }, [emotionsData, scene, camera, textMeshRef]);

  const createTextGroup = (font, emotion, sphereRadius) => {
    const textGroup = new THREE.Group();
    const textLength = emotion.text_input.length;
    const angleIncrement = (2 * Math.PI) / textLength;
    const radius = sphereRadius * 1.4; // Adjust the multiplier to set text distance from the sphere

    for (let i = 0; i < textLength; i++) {
      const charGeometry = new TextGeometry(emotion.text_input.charAt(i), {
        font: font,
        size: sphereRadius * 0.25, // Adjust the multiplier to set the text size relative to the sphere
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

      // Create a group for Z rotation
      const zRotationGroup = new THREE.Group();
      zRotationGroup.userData.isZRotationGroup = true;
      zRotationGroup.add(charMesh);

      textGroup.add(zRotationGroup);
    }

    return textGroup;
  };

  return null; // This component does not render anything itself
};

export default TextOverlay;