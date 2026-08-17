import { Component, ElementRef, OnInit, OnDestroy, ViewChild, AfterViewInit, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { EmotionService, EmotionData } from '../../services/emotion';

@Component({
  selector: 'app-emotion-spheres',
  standalone: true,
  templateUrl: './emotion-spheres.html',
  styleUrls: ['./emotion-spheres.css']
})
export class EmotionSpheresComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('rendererContainer', { static: true }) rendererContainer!: ElementRef;
  @Input() showText: boolean = true;

  
  private emotionService = inject(EmotionService);
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private animationFrameId!: number;
  private spheres: THREE.Mesh[] = [];
  private textGroups: THREE.Group[] = [];
  private font!: any;

  private emotionColors: Record<string, string> = {
    'Anger': 'red', 'Contempt': 'orangered', 'Disgust': 'darkorange', 'Envy': 'gold',
    'Guilt': 'yellow', 'Shame': 'yellowgreen', 'Fear': 'green', 'Sadness': 'lightseagreen',
    'Surprise': 'skyblue', 'Interest': 'deepskyblue', 'Hope': 'dodgerblue',
    'Relief': 'blue', 'Satisfaction': 'slateblue', 'Joy': 'mediumslateblue', 'Elation': 'mediumorchid',
    'Pride': 'darkviolet'
  };

  constructor() {}

  ngAfterViewInit(): void {
    this.initThreeJS();
    
    // Load the font, then fetch data
    const loader = new FontLoader();
    loader.load('/fonts/droid_sans_mono_regular.typeface.json', (font) => {
      this.font = font;
      this.fetchData();
    });
  }

  private initThreeJS(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.scene = new THREE.Scene();
    
    this.camera = new THREE.PerspectiveCamera(45, width / height, 10, 25000);
    this.camera.position.set(0, 0, 4000);
    
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);

    new OrbitControls(this.camera, this.renderer.domElement);

    this.animate();
  }

  private calculateDensity(currentEmotion: EmotionData, emotionsData: EmotionData[], radiusThreshold: number): number {
    const currentLatRad = THREE.MathUtils.degToRad(currentEmotion.latitude);
    const currentLonRad = THREE.MathUtils.degToRad(currentEmotion.longitude);
    let count = 0;
    emotionsData.forEach(emotion => {
      const latRad = THREE.MathUtils.degToRad(emotion.latitude);
      const lonRad = THREE.MathUtils.degToRad(emotion.longitude);
      const d = Math.acos(Math.sin(currentLatRad) * Math.sin(latRad) + Math.cos(currentLatRad) * Math.cos(latRad) * Math.cos(Math.abs(currentLonRad - lonRad))) * 6371;
      if (d <= radiusThreshold) count++;
    });
    return count;
  }

  private calculateSizeOverTime(creationTime: string, minSize: number, maxSize: number): number {
    const now = new Date().getTime();
    const elapsed = now - new Date(creationTime).getTime();
    const totalDuration = 96 * 60 * 60 * 1000;
    const sizeScale = Math.max(minSize, maxSize - ((elapsed / totalDuration) * (maxSize - minSize)));
    return sizeScale;
  }

  private fetchData(): void {
    this.emotionService.getEmotions().subscribe({
      next: (data) => {
        this.renderSpheres(data);
      },
      error: (err) => {
        console.error('Failed to load emotions:', err);
      }
    });
  }

  private renderSpheres(emotionsData: EmotionData[]): void {
    const radius = 1000;
    const maxSize = 2000;
    const initialSize = maxSize;

    emotionsData.forEach(emotion => {
      const color = this.emotionColors[emotion.emotion] || 'gray';
      const density = this.calculateDensity(emotion, emotionsData, 6000);
      
      const geometry = new THREE.SphereGeometry(initialSize, 32, 32);
      const material = new THREE.MeshBasicMaterial({ color, wireframe: true });
      const sphere = new THREE.Mesh(geometry, material);

      const latitudeInRadians = THREE.MathUtils.degToRad(emotion.latitude);
      const longitudeInRadians = THREE.MathUtils.degToRad(emotion.longitude);

      const x = radius * Math.cos(latitudeInRadians) * Math.sin(longitudeInRadians);
      const y = radius * Math.sin(latitudeInRadians);
      const z = radius * Math.cos(latitudeInRadians) * Math.cos(longitudeInRadians);

      sphere.position.set(x, y, z);
      
      sphere.userData = {
        animationParams: {
          speed: Math.random() * 0.005 + 0.001,
          amplitudeX: Math.random() * 50 + 10,
          amplitudeY: Math.random() * 50 + 10,
          amplitudeZ: Math.random() * 50 + 10,
          offsetX: Math.random() * Math.PI * 2,
          offsetY: Math.random() * Math.PI * 2,
          offsetZ: Math.random() * Math.PI * 2,
        },
        originalPosition: { x, y, z },
        creationTime: emotion.local_time,
        density,
        emotion: emotion
      };

      this.scene.add(sphere);
      this.spheres.push(sphere);

      if (emotion.text_input && emotion.text_input.trim() !== '') {
        const textGroup = this.createTextGroup(this.font, emotion.text_input, maxSize);
        textGroup.userData = { sphere, rotationSpeed: -0.01, originalScale: 1.0, emotionId: emotion._id };

        this.scene.add(textGroup);
        this.textGroups.push(textGroup);
      }
    });
  }

  private createTextGroup(font: any, text: string, sphereRadius: number): THREE.Group {
    const textGroup = new THREE.Group();
    const formattedText = `"${text}" • `;
    const textLength = formattedText.length;
    
    const maxSpacing = 0.18; // Max spacing (normal reading spacing)
    const minSpacing = (2 * Math.PI) / textLength; // Minimum spacing to fit the entire string around the circle
    const angleIncrement = Math.min(maxSpacing, minSpacing);

    const radius = sphereRadius * 1.4; 

    for (let i = 0; i < textLength; i++) {
      const charGeometry = new TextGeometry(formattedText.charAt(i), {
        font: font,
        size: sphereRadius * 0.25,
        depth: 1,
        curveSegments: 12,
        bevelEnabled: false,
      });

      const charMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const charMesh = new THREE.Mesh(charGeometry, charMaterial);

      const angle = i * angleIncrement;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);

      charMesh.position.set(x, y, 0);
      charMesh.rotation.z = angle + Math.PI / 2;

      const zRotationGroup = new THREE.Group();
      zRotationGroup.userData['isZRotationGroup'] = true;
      zRotationGroup.add(charMesh);

      textGroup.add(zRotationGroup);
    }

    return textGroup;
  }

  private animate = (): void => {
    this.animationFrameId = requestAnimationFrame(this.animate);
    
    let time = Date.now() * 0.025;
    const minSize = 400;
    const maxSize = 2000;

    // Apply the floaty animation to spheres
    this.spheres.forEach(sphere => {
      const params = sphere.userData['animationParams'];
      const originalPos = sphere.userData['originalPosition'];
      const factor = 7.5;

      sphere.position.y = originalPos.y + Math.sin(time * params.speed + params.offsetY) * params.amplitudeY * factor;
      sphere.position.x = originalPos.x + Math.sin(time * params.speed + params.offsetX) * params.amplitudeX * factor;
      sphere.position.z = originalPos.z + Math.sin(time * params.speed + params.offsetZ) * params.amplitudeZ * factor;
      
      sphere.rotation.x += 0.01;
      sphere.rotation.y += 0.01;

      // Update sphere size based on elapsed time
      const size = this.calculateSizeOverTime(sphere.userData['creationTime'], minSize, maxSize);
      const densityFactor = 0.5 / Math.sqrt(sphere.userData['density'] || 1);
      const finalSize = size * densityFactor;
      sphere.scale.set(finalSize / maxSize, finalSize / maxSize, finalSize / maxSize);

      // Update the corresponding text group size
      const textGroup = this.textGroups.find(
        (group) => group.userData['emotionId'] === sphere.userData['emotion']?._id
      );

      if (textGroup) {
        const textSizeFactor = finalSize / maxSize;
        textGroup.scale.set(textSizeFactor, textSizeFactor, textSizeFactor);
      }
    });

    // Update the text groups to track spheres and face the camera
    this.textGroups.forEach(textGroup => {
      const sphere = textGroup.userData['sphere'];
      const rotationSpeed = textGroup.userData['rotationSpeed'];
      
      if (sphere) {
        textGroup.position.copy(sphere.position);

        // Rotate characters around the Z axis
        textGroup.children.forEach(zRotationGroup => {
          if (zRotationGroup.userData['isZRotationGroup']) {
            zRotationGroup.rotation.z += rotationSpeed;
          }
        });

        // Ensure text group always faces the camera
        const direction = new THREE.Vector3();
        direction.subVectors(this.camera.position, textGroup.position).normalize();
        const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction);
        textGroup.setRotationFromQuaternion(quaternion);
      }
    });

    this.renderer.render(this.scene, this.camera);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['showText'] && this.textGroups) {
      this.textGroups.forEach(group => {
        group.visible = this.showText;
      });
    }
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.renderer.dispose();
  }
}
