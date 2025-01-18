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
const modelPath = "src/assets/models/Typical_LiftLobby.glb"; // Using the model name from the previous code

loader.load(
  modelPath, // Path to the GLTF model
  (gltf) => {
    // On model load, add it to the scene
    const model = gltf.scene;
    model.position.set(0, 0.2, 0); // Set the model position

    scene.add(model);

    // Handle the ceiling object, if found
    const ceiling = model.getObjectByName("Cube634");
    if (ceiling) {
      ceiling.visible = true;
    } else {
      console.warn("Ceiling not found in the model.");
    }

    // Log child objects' names and types
    model.traverse((child) => {
      console.log(`Name: ${child.name}, Type: ${child.type}`);
    });

    // Add a bounding box for the model
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const boundingBoxGeometry = new THREE.BoxGeometry(size.x, size.y, size.z); // Scale the height
    const boundingBoxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true, visible: false });
    const boundingBoxMesh = new THREE.Mesh(boundingBoxGeometry, boundingBoxMaterial);

    boundingBoxMesh.position.copy(center);
    scene.add(boundingBoxMesh);

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
