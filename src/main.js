import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Create the scene
const scene = new THREE.Scene();

// Set the background color of the scene to white
scene.background = new THREE.Color(0xffffff); // White background

// Create the camera
const camera = new THREE.PerspectiveCamera(
  75, // Field of view
  window.innerWidth / window.innerHeight, // Aspect ratio
  0.1, // Near clipping plane
  1000 // Far clipping plane
);

// Create the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 1); // Set the clear color to white
document.body.appendChild(renderer.domElement);

// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.enablePan = true;
controls.update();

// Add lights to the scene
const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2); // Bright white light
directionalLight.position.set(5, 5, 5); // Position of the light
scene.add(directionalLight);

// Load a GLTF model
const loader = new GLTFLoader();
const modelPath = '/assets/models/gltf/Typical_LiftLobby.gltf'; // Path to the model

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

  // Update controls (required for damping)
  controls.update();

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
