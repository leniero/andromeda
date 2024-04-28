import * as THREE from 'https://cdn.skypack.dev/three@0.136.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, raycaster, mouse;
const emotionColors = { 'Anger': 'red', 'Contempt': 'orangered', 'Disgust': 'darkorange', 'Envy': 'gold',
'Guilt': 'yellow', 'Shame': 'yellowgreen', 'Fear': 'green', 'Sadness': 'lightseagreen',
'Surprise': 'skyblue', 'Interest': 'deepskyblue', 'Hope': 'dodgerblue',
'Relief': 'blue', 'Satisfaction': 'slateblue', 'Joy': 'mediumslateblue', 'Elation': 'mediumorchid',
'Pride': 'darkviolet' };


if (document.body.id === 'eclouds') {
    function initVisualization(oldestTime, newestTime,emotions) {
        console.log('Initializing visualization with data:', emotionsData);

        emotions = emotionsData.map(emotion => ({
            ...emotion,
            local_time: new Date(emotion.local_time)
        }));
        const minSize = 100; // Minimum sphere size
        const maxSize = 500; // Maximum sphere size

        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
        renderer.clear();

        // Set up the scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000); // Set to black or any other color you prefer
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 1500;
        camera.fov = 125;  // Adjust this value as needed
        camera.updateProjectionMatrix();
        console.log('Camera position:', camera.position);
        console.log('Created camera:', camera);
        console.log('Created renderer:', renderer);

        const controls = new OrbitControls(camera, renderer.domElement);
        
        const ambientLight = new THREE.AmbientLight(0xffffff); // soft white light
        scene.add(ambientLight);

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 1, 1).normalize();
        scene.add(light);

        // Find the min and max latitude and longitude among your data
        const minLat = Math.min(...emotions.map(e => e.latitude));
        const maxLat = Math.max(...emotions.map(e => e.latitude));
        const minLon = Math.min(...emotions.map(e => e.longitude));
        const maxLon = Math.max(...emotions.map(e => e.longitude));

        // Normalize a value from a given range to a new range
        function normalize(value, oldMin, oldMax, newMin, newMax) {
            return (value - oldMin) / (oldMax - oldMin) * (newMax - newMin) + newMin;
        }    
        
    

        // Process emotions data and create spheres
        let spheres = emotions.map((emotion,index) => {
            console.log(`Emotion at index ${index}:`, emotion); // Log each emotion object
            const color = emotionColors[emotion.emotion];
            const size = scaleSize(emotion.local_time, oldestTime, newestTime, minSize, maxSize);            
            const sphereGeometry = new THREE.SphereGeometry(size, 20, 250);
            const sphereMaterial = new THREE.MeshLambertMaterial({ color: color, depthTest: true });
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            console.log('Created sphere:', sphere);

            // Convert latitude and longitude to radians
            let latitudeInRadians = THREE.MathUtils.degToRad(emotion.latitude);
            let longitudeInRadians = THREE.MathUtils.degToRad(emotion.longitude);

            // Radius of the globe
            let radius = 1000;

            // Convert spherical coordinates to Cartesian coordinates for the original position
            let x = radius * Math.cos(latitudeInRadians) * Math.sin(longitudeInRadians);
            let y = radius * Math.sin(latitudeInRadians);
            let z = radius * Math.cos(latitudeInRadians) * Math.cos(longitudeInRadians);
            
            sphere.position.set(x, y, z);

            // Store the original position
            sphere.originalPosition = { x: x, y: y, z: z };

            // Assign a random offset to each sphere
            // sphere.offset = Math.random(1,20); 
            
            sphere.userData = { 
                text_input: emotion.text_input,
                emotion: emotion.emotion // If you wish to use other properties
            };

            // Assign unique animation parameters for each sphere
            sphere.animationParams = {
                speed: Math.random() * 0.005 + 0.001, // Random speed between 0.001 and 0.006
                amplitudeX: Math.random() * 50 + 10, // Random amplitude between 10 and 60
                amplitudeY: Math.random() * 50 + 10,
                amplitudeZ: Math.random() * 50 + 10,
                offsetX: Math.random() * Math.PI * 2, // Random phase between 0 and 2*PI
                offsetY: Math.random() * Math.PI * 2,
                offsetZ: Math.random() * Math.PI * 2,
            };

            scene.add(sphere);
            console.log('Scene:', scene);
            return sphere;
        });

        // Add raycaster and mouse for interactivity
        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();
    
        // Add event listener for mouse move
        document.addEventListener('mousemove', onMouseMove, false);

        // Start the animation loop
        function animate() {
            requestAnimationFrame(animate);

            // Current time
            let time = Date.now() * 0.025;

            // Update sphere positions based on unique animation parameters
            spheres.forEach(sphere => {

                const factor = 7.5;
                const params = sphere.animationParams;
                sphere.position.y = sphere.originalPosition.y + Math.sin(time * params.speed + params.offsetY) * params.amplitudeY * factor;
                sphere.position.x = sphere.originalPosition.x + Math.sin(time * params.speed + params.offsetX) * params.amplitudeX * factor;
                sphere.position.z = sphere.originalPosition.z + Math.sin(time * params.speed + params.offsetZ) * params.amplitudeZ * factor;
            });

            renderer.render(scene, camera);
            controls.update();
        }

        animate();
    }

    // Updated scaleSize function with additional logs
    function scaleSize(localTime, oldestTime, newestTime, minSize, maxSize) {
        // Convert times to milliseconds for comparison
        const localMilliseconds = new Date(localTime).getTime();
        const oldestMilliseconds = new Date(oldestTime).getTime();
        const newestMilliseconds = new Date(newestTime).getTime();

        const normalizedTime = (localMilliseconds - oldestMilliseconds) / (newestMilliseconds - oldestMilliseconds);
        
        // Scale the size within the range of minSize to maxSize
        const size = normalizedTime * (maxSize - minSize) + minSize;
        console.log(`Time: ${localTime} - Size: ${size}`); // Logging the size
        return size;
    }
        
    function onMouseMove(event) {
        // Convert mouse position to normalized device coordinates
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Update the picking ray with the camera and mouse position
        raycaster.setFromCamera(mouse, camera);

        // Calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObjects(scene.children);

        const textOverlay = document.getElementById('textOverlay');

        if (intersects.length > 0) {
            const firstIntersectedObject = intersects[0].object;
            const emotionData = firstIntersectedObject.userData;

            // Show and position the text overlay
            textOverlay.style.display = 'block';
            textOverlay.style.left = `${event.clientX + 15}px`; // Offset by 15px for a nicer look
            textOverlay.style.top = `${event.clientY + 15}px`;

            // Set the text content based on the sphere's user data
            textOverlay.textContent = emotionData.text_input;
        } else {
            // Hide the text overlay if not hovering over a sphere
            textOverlay.style.display = 'none';
        }

    }


    function mapLatitude(latitude) {
        // Assuming the latitude range is -90 to 90
        // Normalize to a range of -1 to 1
        return (latitude / 90);
    }

    function mapLongitude(longitude) {
        // Assuming the longitude range is -180 to 180
        // Normalize to a range of -1 to 1
        return (longitude / 180);
    }

    
            
    function getEmotionColor(emotion) {
        // Define colors for each emotion
        const emotionColors = {
            'Anger': 'red', 'Contempt': 'orangered', 'Disgust': 'darkorange', 'Envy': 'gold',
            'Guilt': 'yellow', 'Shame': 'yellowgreen', 'Fear': 'green', 'Sadness': 'lightseagreen',
            'Surprise': 'skyblue', 'Interest': 'deepskyblue', 'Hope': 'dodgerblue',
            'Relief': 'blue', 'Satisfaction': 'slateblue', 'Joy': 'mediumslateblue', 'Elation': 'mediumorchid',
            'Pride': 'darkviolet'
        };
        return emotionColors[emotion] || 'gray'; // Default to gray if the emotion isn't listed
    }

    // Fetch emotion data and initialize visualization
    fetch('/get_emotions')
        .then(response => response.json())
        .then(data => {
            console.log('Emotions data received:', data); // Log data to the console
            let emotionsData = data; // Set emotionsData to the fetched data
            console.log('emotionsData:', emotionsData);

            // Find the oldest and newest times
            let oldestTime = new Date(Math.min(...emotionsData.map(e => new Date(e.local_time).getTime())));
            let newestTime = new Date(Math.max(...emotionsData.map(e => new Date(e.local_time).getTime())));
    
            initVisualization(oldestTime, newestTime);  // Initialize visualization
        })
        .catch(error => console.error('Error fetching emotions:', error));



    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', function() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });
}

