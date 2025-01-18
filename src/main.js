import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { lastClickedButton } from './caller.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

export const scene = new THREE.Scene();
scene.background = new THREE.Color(0xd6d6d6);

// Create a loader for the HDR texture
const rgbeLoader = new RGBELoader();

// Load the HDR texture (replace with the path to your HDR file)
rgbeLoader.load(
    'src/assets/HDR/kloofendal_48d_partly_cloudy_puresky_4k.hdr',  // Path to the HDR file
    (hdrEquirect) => {
        // The HDR image is loaded successfully

        // Set the scene background to the HDR texture
        hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = hdrEquirect;

        // Set the environment map for the scene (use HDR for reflections)
        scene.environment = hdrEquirect;

        // You can adjust the intensity of the HDR light
        hdrEquirect.intensity = 1.0; // Default intensity
    },
    undefined,
    (error) => {
        console.error('An error occurred while loading the HDR texture:', error);
    }
)

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

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Directional Light with Shadows
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
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
const spotLight = new THREE.SpotLight(0xffa95c, 1.5);
spotLight.position.set(-15, 30, 15);
spotLight.angle = Math.PI / 4;
spotLight.penumbra = 0.2;
spotLight.decay = 2;
spotLight.distance = 100;
spotLight.castShadow = true;
scene.add(spotLight);

// Hemisphere Light
const hemisphereLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 0.5);
scene.add(hemisphereLight);


// Load the textures
const textureLoader = new THREE.TextureLoader();

// Load the individual textures (replace with actual file paths)
const diffuseTexture = textureLoader.load('src/assets/textures/ground_textures/rocky_terrain_02_diff_2k.jpg');
const normalTexture = textureLoader.load('src/assets/textures/ground_textures/rocky_terrain_02_nor_gl_2k.jpg');
const specularTexture = textureLoader.load('src/assets/textures/ground_textures/rocky_terrain_02_spec_2k.jpg');
const aoTexture = textureLoader.load('src/assets/textures/ground_textures/rocky_terrain_02_arm_2k.jpg');  // Ambient Occlusion map

// Ground Plane with Textures
const planeGeometry = new THREE.PlaneGeometry(100, 100);

// Ensure that UVs are initialized properly before modifying them
if (!planeGeometry.attributes.uv) {
    planeGeometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(planeGeometry.attributes.position.count * 2), 2));
}

// Scale factor to adjust texture size
const scale = 0.5;  // Adjust this value to fit the texture

// Recreate the UVs for the plane to scale the textures
const uvs = planeGeometry.attributes.uv.array;
for (let i = 0; i < uvs.length; i++) {
    uvs[i] *= scale;    // Scale the UVs
}

// Create material with textures
const planeMaterial = new THREE.MeshStandardMaterial({
    map: diffuseTexture,        // Diffuse texture (Base Color)
    normalMap: normalTexture,   // Normal map
    specularMap: specularTexture, // Specular map
    aoMap: aoTexture,           // Ambient Occlusion map
    color: 0xdddddd,            // Base color, can be modified if necessary
    transparent: true,
    opacity: 1,
});

// To ensure the AO map is applied correctly, we need to set the uv2 coordinates
planeGeometry.setAttribute('uv2', new THREE.BufferAttribute(planeGeometry.attributes.uv.array, 2));

// Create the mesh and rotate it to be horizontal
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.name = 'ground';

// Add the plane to the scene
scene.add(plane);

// Load a GLTF model
const loader = new GLTFLoader();
const modelPath = '/assets/models/Typical_LiftLobby.glb'; // Path to the model

loader.load(
  console.log("Loading model...");
  
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
