import { Component, ElementRef, OnInit, OnDestroy, ViewChild, AfterViewInit, inject, Input, OnChanges, SimpleChanges, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { EmotionService, EmotionData } from '../../services/emotion';
import { LocationService } from '../../services/location';

@Component({
  selector: 'app-emotion-spheres',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './emotion-spheres.html',
  styleUrls: ['./emotion-spheres.css']
})
export class EmotionSpheresComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('container', { static: true }) containerRef!: ElementRef;
  @ViewChild('bgCanvas', { static: true }) bgCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('fgCanvas', { static: true }) fgCanvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() showText: boolean = true;

  selectedEmotion: any = null;
  overlayX: number = 0;
  overlayY: number = 0;
  private locationService = inject(LocationService);
  private emotionService = inject(EmotionService);
  private cdr = inject(ChangeDetectorRef);
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private bgRenderer!: THREE.WebGLRenderer;
  private fgRenderer!: THREE.WebGLRenderer;
  private animationFrameId!: number;
  private spheres: THREE.Mesh[] = [];
  private textGroups: THREE.Group[] = [];
  private font!: any;
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private orbitControls!: OrbitControls;
  
  private targetCameraPos = new THREE.Vector3(0, 0, 4000);
  private targetOrbitCenter = new THREE.Vector3(0, 0, 0);
  private isCameraAnimating = false;

  public formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', month: '2-digit', day: '2-digit', 
      hour: '2-digit', minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  public emotionColors: Record<string, string> = {
    'Anger': 'red', 'Contempt': 'orangered', 'Disgust': 'darkorange', 'Envy': 'gold',
    'Guilt': 'yellow', 'Shame': 'yellowgreen', 'Fear': 'green', 'Sadness': 'lightseagreen',
    'Surprise': 'skyblue', 'Interest': 'deepskyblue', 'Hope': 'dodgerblue',
    'Relief': 'blue', 'Satisfaction': 'slateblue', 'Joy': 'mediumslateblue', 'Elation': 'mediumorchid',
    'Pride': 'darkviolet'
  };

  public emotionEmojis: { [key: string]: string } = {
    Anger: '😡', Contempt: '😒', Disgust: '🤢', Envy: '😐',
    Guilt: '😣', Shame: '😳', Fear: '😨', Sadness: '😢',
    Surprise: '😲', Interest: '🧐', Hope: '🙂', Relief: '😮‍💨',
    Satisfaction: '😊', Joy: '😆', Elation: '😌', Pride: '🥹'
  };

  constructor() {}

  private pointerDownClientX = 0;
  private pointerDownClientY = 0;

  ngAfterViewInit(): void {
    this.initThreeJS();
    
    // Load the font, then fetch data
    const loader = new FontLoader();
    loader.load('/fonts/droid_sans_mono_regular.typeface.json', (font) => {
      this.font = font;
      this.fetchData();
    });
    
    // Listen for window resize
    window.addEventListener('resize', this.onWindowResize);
    // Listen for pointer interactions
    this.containerRef.nativeElement.addEventListener('pointerdown', this.onPointerDown);
    this.containerRef.nativeElement.addEventListener('pointerup', this.onPointerUp);
  }

  private initThreeJS(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.scene = new THREE.Scene();
    
    this.camera = new THREE.PerspectiveCamera(45, width / height, 10, 25000);
    this.camera.position.set(0, 0, 4000);
    // Important for dual canvas layers
    this.camera.layers.enable(0);
    this.camera.layers.enable(1);
    
    this.bgRenderer = new THREE.WebGLRenderer({ canvas: this.bgCanvasRef.nativeElement, antialias: true, alpha: true });
    this.bgRenderer.setSize(width, height);
    
    this.fgRenderer = new THREE.WebGLRenderer({ canvas: this.fgCanvasRef.nativeElement, antialias: true, alpha: true });
    this.fgRenderer.setSize(width, height);

    this.orbitControls = new OrbitControls(this.camera, this.containerRef.nativeElement);
    this.orbitControls.enableDamping = false;
    
    // Stop camera animation if user starts dragging
    this.orbitControls.addEventListener('start', () => {
      this.isCameraAnimating = false;
    });

    this.animate();
  }

  private onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.bgRenderer.setSize(window.innerWidth, window.innerHeight);
    this.fgRenderer.setSize(window.innerWidth, window.innerHeight);
  }

  private onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0) return;
    this.pointerDownClientX = event.clientX;
    this.pointerDownClientY = event.clientY;
  }

  private onPointerUp = async (event: PointerEvent) => {
    if (event.button !== 0) return;
    
    // Distinguish between a drag and a click
    const distance = Math.hypot(event.clientX - this.pointerDownClientX, event.clientY - this.pointerDownClientY);
    if (distance > 5) return; // it was a drag, ignore click logic
    
    if ((event.target as HTMLElement).closest('.emotion-detail-overlay')) return;

    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.spheres, false);

    if (intersects.length > 0) {
      const selectedSphere = intersects[0].object as THREE.Mesh;
      const emotionData = selectedSphere.userData['emotion'];
      
      const size = this.calculateSizeOverTime(selectedSphere.userData['creationTime'], 400, 2000);
      const densityFactor = 0.5 / Math.sqrt(selectedSphere.userData['density'] || 1);
      const finalSize = size * densityFactor;
      
      const direction = new THREE.Vector3().subVectors(this.camera.position, selectedSphere.position).normalize();
      const zoomDistance = finalSize * 3; // Dynamically zoom based on size
      
      const isMobile = window.innerWidth <= 768;
      // Calculate offset so the sphere is centered on the left half of the screen (only on desktop)
      const right = new THREE.Vector3().crossVectors(this.camera.up, direction).normalize();
      const offsetAmount = isMobile ? 0 : finalSize * 1.5; // push camera right, sphere goes left
      
      this.targetOrbitCenter.copy(selectedSphere.position).add(right.clone().multiplyScalar(offsetAmount));
      this.targetCameraPos.copy(selectedSphere.position).add(direction.multiplyScalar(zoomDistance)).add(right.clone().multiplyScalar(offsetAmount));
      
      this.isCameraAnimating = true;

      let dist = null;
      try {
        const userLoc = await this.locationService.getLocation();
        if (userLoc) {
          const R = 6371; // Earth's radius in km
          const dLat = THREE.MathUtils.degToRad(emotionData.latitude - userLoc.latitude);
          const dLon = THREE.MathUtils.degToRad(emotionData.longitude - userLoc.longitude);
          const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(THREE.MathUtils.degToRad(userLoc.latitude)) * Math.cos(THREE.MathUtils.degToRad(emotionData.latitude)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2); 
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
          dist = R * c;
        }
      } catch (err) {
        console.error("Could not calculate distance", err);
      }

      this.selectedEmotion = {
        emotion: emotionData,
        distance: dist
      };
      
      // Move selected to layer 1 for sharp rendering
      this.spheres.forEach(s => s.layers.set(0));
      selectedSphere.layers.set(1);
      
      // We don't dim them anymore, CSS blur handles the background canvas!
      this.spheres.forEach(s => {
        const mat = s.material as THREE.MeshBasicMaterial;
        mat.opacity = 1;
      });
      // Hide all 3D text for now, so it doesn't clutter the blur
      this.textGroups.forEach(tg => tg.visible = false);
      
      this.cdr.detectChanges();
    } else {
      this.closeDetail();
    }
  }

  public closeDetail() {
    this.selectedEmotion = null;
    this.targetCameraPos.set(0, 0, 4000);
    this.targetOrbitCenter.set(0, 0, 0);
    this.isCameraAnimating = true;
    
    // Reset layers and visibility
    this.spheres.forEach(s => {
      s.layers.set(0);
      const mat = s.material as THREE.MeshBasicMaterial;
      mat.opacity = 1;
    });
    this.textGroups.forEach(tg => tg.visible = this.showText);
    
    this.cdr.detectChanges();
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
    
    // Split text into two lines if it's too long
    const maxLengthPerLine = 60;
    const lines = [];
    
    if (text.length > maxLengthPerLine) {
      const words = text.split(' ');
      let currentLine = '';
      let i = 0;
      
      // Try to split evenly
      while (i < words.length && currentLine.length + words[i].length < text.length / 2) {
        currentLine += words[i] + ' ';
        i++;
      }
      lines.push(`"${currentLine.trim()}"`);
      
      currentLine = '';
      while (i < words.length) {
        currentLine += words[i] + ' ';
        i++;
      }
      lines.push(`"${currentLine.trim()}" • `);
    } else {
      lines.push(`"${text}" • `);
    }

    const baseRadius = sphereRadius * 1.4; 

    lines.forEach((lineText, lineIndex) => {
      const textLength = lineText.length;
      const maxSpacing = 0.18; // Max spacing
      const minSpacing = (2 * Math.PI) / textLength;
      const angleIncrement = Math.min(maxSpacing, minSpacing);
      
      // Outer line gets slightly larger radius
      const currentRadius = baseRadius + (lineIndex * sphereRadius * 0.3);

      for (let i = 0; i < textLength; i++) {
        const charGeometry = new TextGeometry(lineText.charAt(i), {
          font: font,
          size: sphereRadius * 0.25,
          depth: 1,
          curveSegments: 12,
          bevelEnabled: false,
        });

        const charMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const charMesh = new THREE.Mesh(charGeometry, charMaterial);

        const angle = i * angleIncrement;
        const x = currentRadius * Math.cos(angle);
        const y = currentRadius * Math.sin(angle);

        charMesh.position.set(x, y, 0);
        charMesh.rotation.z = angle + Math.PI / 2;

        const zRotationGroup = new THREE.Group();
        zRotationGroup.userData['isZRotationGroup'] = true;
        zRotationGroup.add(charMesh);

        textGroup.add(zRotationGroup);
      }
    });

    return textGroup;
  }

  private animate = (): void => {
    this.animationFrameId = requestAnimationFrame(this.animate);
    
    let time = Date.now() * 0.025;
    const minSize = 400;
    const maxSize = 2000;

    // Apply the floaty animation to spheres
    this.spheres.forEach(sphere => {
      // Freeze movement if an emotion is selected
      if (!this.selectedEmotion) {
        const params = sphere.userData['animationParams'];
        const originalPos = sphere.userData['originalPosition'];
        const factor = 7.5;

        sphere.position.y = originalPos.y + Math.sin(time * params.speed + params.offsetY) * params.amplitudeY * factor;
        sphere.position.x = originalPos.x + Math.sin(time * params.speed + params.offsetX) * params.amplitudeX * factor;
        sphere.position.z = originalPos.z + Math.sin(time * params.speed + params.offsetZ) * params.amplitudeZ * factor;
        
        sphere.rotation.x += 0.01;
        sphere.rotation.y += 0.01;
      }

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

    if (this.isCameraAnimating) {
      // Tween camera position
      this.camera.position.lerp(this.targetCameraPos, 0.05);
      // Tween orbit controls target
      this.orbitControls.target.lerp(this.targetOrbitCenter, 0.05);
      this.orbitControls.update();
      
      if (this.camera.position.distanceTo(this.targetCameraPos) < 1) {
        this.isCameraAnimating = false;
      }
    } else {
      this.orbitControls.update();
    }

    // Update overlay position if an emotion is selected
    if (this.selectedEmotion) {
      const selectedSphere = this.spheres.find(s => s.userData['emotion']?._id === this.selectedEmotion.emotion._id);
      if (selectedSphere) {
        const vector = selectedSphere.position.clone();
        vector.project(this.camera);
        
        const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
        const y = -(vector.y * 0.5 - 0.5) * window.innerHeight;
        
        // Offset text slightly to the right of the sphere
        this.overlayX = x + 100;
        this.overlayY = y;
        this.cdr.detectChanges();
      }
    }

    // Render background layer (0)
    this.camera.layers.set(0);
    this.bgRenderer.render(this.scene, this.camera);
    
    // Render foreground layer (1) for selected sphere
    this.camera.layers.set(1);
    this.fgRenderer.render(this.scene, this.camera);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['showText'] && this.textGroups) {
      this.textGroups.forEach(group => {
        // Only show if we don't have a selected emotion (to keep blur clean)
        group.visible = this.showText && !this.selectedEmotion;
      });
    }
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.bgRenderer?.dispose();
    this.fgRenderer?.dispose();
  }
}
