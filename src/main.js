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
