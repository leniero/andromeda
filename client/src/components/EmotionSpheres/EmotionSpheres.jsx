import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import styles from './EmotionSpheres.module.css';

const EmotionSpheres = ({ emotionsData, width, height, setScene, setCamera, textMeshRef }) => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const activeTextMeshRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.5, 10000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    rendererRef.current = renderer;

    new OrbitControls(camera, renderer.domElement);
    camera.position.set(0, 0, 4800);
    camera.updateProjectionMatrix();

    const emotionColors = {
      'Anger': 'red', 'Contempt': 'orangered', 'Disgust': 'darkorange', 'Envy': 'gold',
      'Guilt': 'yellow', 'Shame': 'yellowgreen', 'Fear': 'green', 'Sadness': 'lightseagreen',
      'Surprise': 'skyblue', 'Interest': 'deepskyblue', 'Hope': 'dodgerblue',
      'Relief': 'blue', 'Satisfaction': 'slateblue', 'Joy': 'mediumslateblue', 'Elation': 'mediumorchid',
      'Pride': 'darkviolet'
    };

    // Step 1: Implement a function to calculate density
    const calculateDensity = (currentEmotion, emotionsData, radiusThreshold) => {
      const currentLatRad = THREE.MathUtils.degToRad(currentEmotion.latitude);
      const currentLonRad = THREE.MathUtils.degToRad(currentEmotion.longitude);
      let count = 0;
      emotionsData.forEach(emotion => {
        const latRad = THREE.MathUtils.degToRad(emotion.latitude);
        const lonRad = THREE.MathUtils.degToRad(emotion.longitude);
        // Calculate spherical distance
        const d = Math.acos(Math.sin(currentLatRad) * Math.sin(latRad) + Math.cos(currentLatRad) * Math.cos(latRad) * Math.cos(Math.abs(currentLonRad - lonRad))) * 6371;
        if (d <= radiusThreshold) count++;
      });
      return count;
    };

  // Modify the scaleSize function to include density
  const scaleSize = (localTime, oldestTime, newestTime, minSize, maxSize, density) => {
    const timeScale = (new Date(localTime).getTime() - new Date(oldestTime).getTime()) / (new Date(newestTime).getTime() - new Date(oldestTime).getTime());
    // Adjust size based on density, more density means smaller size
    const densityFactor = 1 / Math.sqrt(density); // Example adjustment, can be modified
    return (timeScale * (maxSize - minSize) + minSize) * densityFactor;
  };

    const minSize = 75;
    const maxSize = 350;

    const oldestTime = new Date(Math.min(...emotionsData.map(e => new Date(e.local_time).getTime())));
    const newestTime = new Date(Math.max(...emotionsData.map(e => new Date(e.local_time).getTime())));

    // Step 3 & 4: Adjust sphere size based on density within the forEach loop
    emotionsData.forEach(emotion => {
      const color = emotionColors[emotion.emotion] || 'gray';
      // Calculate density for each emotion
      const density = calculateDensity(emotion, emotionsData, 1500); // 500 km as an example threshold
      const size = scaleSize(emotion.local_time, oldestTime, newestTime, minSize, maxSize, density);
      const geometry = new THREE.SphereGeometry(size, 32, 32);
      const material = new THREE.MeshBasicMaterial({ color });
      const sphere = new THREE.Mesh(geometry, material);

      const latitudeInRadians = THREE.MathUtils.degToRad(emotion.latitude);
      const longitudeInRadians = THREE.MathUtils.degToRad(emotion.longitude);
      const radius = 1500;

      const x = radius * Math.cos(latitudeInRadians) * Math.sin(longitudeInRadians);
      const y = radius * Math.sin(latitudeInRadians);
      const z = radius * Math.cos(latitudeInRadians) * Math.cos(longitudeInRadians);

      sphere.position.set(x, y, z);
      sphere.userData = { text_input: emotion.text_input, emotion };
      sphere.originalPosition = { x, y, z };

      sphere.animationParams = {
        speed: Math.random() * 0.005 + 0.001,
        amplitudeX: Math.random() * 50 + 10,
        amplitudeY: Math.random() * 50 + 10,
        amplitudeZ: Math.random() * 50 + 10,
        offsetX: Math.random() * Math.PI * 2,
        offsetY: Math.random() * Math.PI * 2,
        offsetZ: Math.random() * Math.PI * 2,
      };

      scene.add(sphere);
    });

    const applyTextEffects = (textMesh) => {
      textMesh.children.forEach((charMesh) => {
        if (charMesh.material && charMesh.material.color) {
          charMesh.material.color.setHex(0x000000); // Change text color to black
        }
        charMesh.rotationSpeed = 0.05; // Increase rotation speed
      });

      const ringGeometry = new THREE.RingGeometry(300, 320, 32);
      const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.copy(textMesh.position);
      ring.lookAt(camera.position); // Make sure the ring faces the camera
      textMesh.add(ring);
    };

    const resetTextEffects = (textMesh) => {
      textMesh.children.forEach((charMesh) => {
        if (charMesh.material && charMesh.material.color) {
          charMesh.material.color.setHex(0xffffff); // Reset text color to white
        }
        charMesh.rotationSpeed = 0.001; // Reset rotation speed
      });

      const ring = textMesh.children.find(child => child.geometry && child.geometry.type === 'RingGeometry');
      if (ring) {
        textMesh.remove(ring);
      }
    };

    const handleMouseClick = (event) => {
      const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children);

      if (intersects.length > 0) {
        const sphere = intersects[0].object;
        console.log('Sphere clicked:', sphere.userData);

        const textMesh = textMeshRef.current.find(
          (mesh) => mesh.userData.emotion._id === sphere.userData.emotion._id
        );

        if (textMesh) {
          console.log('Text mesh found:', textMesh);

          // Reset the previous text effects if another sphere is clicked
          if (activeTextMeshRef.current && activeTextMeshRef.current !== textMesh) {
            resetTextEffects(activeTextMeshRef.current);
          }

          applyTextEffects(textMesh);
          activeTextMeshRef.current = textMesh;

          // Reset text effects after 7 seconds
          setTimeout(() => {
            resetTextEffects(textMesh);
            activeTextMeshRef.current = null;
          }, 7000);
        }
      } else {
        // If clicking on the background, reset active text effects
        if (activeTextMeshRef.current) {
          resetTextEffects(activeTextMeshRef.current);
          activeTextMeshRef.current = null;
        }
      }
    };

    container.addEventListener('click', handleMouseClick);

    const animate = () => {
      requestAnimationFrame(animate);

      let time = Date.now() * 0.025;

      scene.children.forEach((sphere) => {
        if (sphere instanceof THREE.Mesh && sphere.userData && sphere.originalPosition) {
          const factor = 7.5;
          const params = sphere.animationParams;
          sphere.position.y =
            sphere.originalPosition.y +
            Math.sin(time * params.speed + params.offsetY) * params.amplitudeY * factor;
          sphere.position.x =
            sphere.originalPosition.x +
            Math.sin(time * params.speed + params.offsetX) * params.amplitudeX * factor;
          sphere.position.z =
            sphere.originalPosition.z +
            Math.sin(time * params.speed + params.offsetZ) * params.amplitudeZ * factor;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    setScene(scene);
    setCamera(camera);

    return () => {
      container.removeEventListener('click', handleMouseClick);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [emotionsData, width, height, setScene, setCamera, textMeshRef]);

  return <div className={styles.visualizationContainer} ref={containerRef} />;
};

export default EmotionSpheres;