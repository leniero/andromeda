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
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    rendererRef.current = renderer;

    new OrbitControls(camera, renderer.domElement);
    camera.position.set(0, 0, 1500);
    camera.updateProjectionMatrix();

    const emotionColors = {
      'Anger': 'red', 'Contempt': 'orangered', 'Disgust': 'darkorange', 'Envy': 'gold',
      'Guilt': 'yellow', 'Shame': 'yellowgreen', 'Fear': 'green', 'Sadness': 'lightseagreen',
      'Surprise': 'skyblue', 'Interest': 'deepskyblue', 'Hope': 'dodgerblue',
      'Relief': 'blue', 'Satisfaction': 'slateblue', 'Joy': 'mediumslateblue', 'Elation': 'mediumorchid',
      'Pride': 'darkviolet'
    };

    const scaleSize = (localTime, oldestTime, newestTime, minSize, maxSize) => {
      const localMilliseconds = new Date(localTime).getTime();
      const oldestMilliseconds = new Date(oldestTime).getTime();
      const newestMilliseconds = new Date(newestTime).getTime();
      const normalizedTime = (localMilliseconds - oldestMilliseconds) / (newestMilliseconds - oldestMilliseconds);
      return normalizedTime * (maxSize - minSize) + minSize;
    };

    const minSize = 50;
    const maxSize = 200;

    const oldestTime = new Date(Math.min(...emotionsData.map(e => new Date(e.local_time).getTime())));
    const newestTime = new Date(Math.max(...emotionsData.map(e => new Date(e.local_time).getTime())));

    emotionsData.forEach(emotion => {
      const color = emotionColors[emotion.emotion] || 'gray';
      const size = scaleSize(emotion.local_time, oldestTime, newestTime, minSize, maxSize);
      const geometry = new THREE.SphereGeometry(size, 32, 32);
      const material = new THREE.MeshBasicMaterial({ color });
      const sphere = new THREE.Mesh(geometry, material);

      const latitudeInRadians = THREE.MathUtils.degToRad(emotion.latitude);
      const longitudeInRadians = THREE.MathUtils.degToRad(emotion.longitude);
      const radius = 1000;

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