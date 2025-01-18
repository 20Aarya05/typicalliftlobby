import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { lastClickedButton } from './caller.js';

// Create the scene
const scene = new THREE.Scene();

// Set the background color of the scene to white
scene.background = new THREE.Color(0xffffff); // White background

// Create the camera
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 15, 30);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 1.5 : 1); 
const canvasContainer = document.getElementById('canvas-container');
canvasContainer.appendChild(renderer.domElement);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera); 
}

window.addEventListener('resize', onWindowResize);

/// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);  // Reduced intensity
scene.add(ambientLight);

// Directional Light with Shadows
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);  // Reduced intensity
directionalLight.position.set(10, 20, 10);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048; // High resolution shadow map
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 100;
directionalLight.shadow.camera.left = -20;
directionalLight.shadow.camera.right = 20;
directionalLight.shadow.camera.top = 20;
directionalLight.shadow.camera.bottom = -20;
scene.add(directionalLight);

// Spotlight
const spotLight = new THREE.SpotLight(0xffa95c, 1);  // Reduced intensity
spotLight.position.set(-15, 30, 15);
spotLight.angle = Math.PI / 4;
spotLight.penumbra = 0.2;
spotLight.decay = 2;
spotLight.distance = 100;
spotLight.castShadow = true;
scene.add(spotLight);

// Hemisphere Light
const hemisphereLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 0.3);  // Reduced intensity
scene.add(hemisphereLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2); // Bright white light
directionalLight.position.set(5, 5, 5); // Position of the light
scene.add(directionalLight);

// Load a GLTF model
const loader = new GLTFLoader();
const modelPath = '/assets/models/Typical_LiftLobby.glb'; // Path to the model

loader.load(
  modelPath, // Path to the GLTF model
  (gltf) => {
    // On model load, add it to the scene
    gltf.scene.scale.set(20, 20, 20); // Adjust the scale if needed
    scene.add(gltf.scene);
    gltf.scene.position.set(0, 0, 0); // Set the position of the model if needed

    console.log("Model loaded successfully");
  },
  (xhr) => {
    // onProgress callback (optional)
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  (error) => {
    // Error handling
    console.error('Error loading model:', error);
  }
);

// Position the camera
camera.position.y = 500;

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Render the scene
  renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the animation
animate();
