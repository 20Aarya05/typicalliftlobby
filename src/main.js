import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
let lastClickedButton = 'overview';

// Create the scene
const scene = new THREE.Scene();

// Set the background color of the scene to white
scene.background = new THREE.Color(0xffffff); // White background

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

let ceiling;
export { ceiling };
const loader = new GLTFLoader();
let model;
loader.load(
    'src/assets/models/Typical_LiftLobby.glb',
    (gltf) => {
        model = gltf.scene;
        model.position.set(0, 0.2, 0);
        scene.add(model);

        ceiling = model.getObjectByName("Cube634");
        if (ceiling) {
            ceiling.visible = true; 
        } else {
            console.warn("Ceiling not found in the model.");
        }

        model.traverse((child) => {
            console.log(`Name: ${child.name}, Type: ${child.type}`);
        });

        const box = new THREE.Box3().setFromObject(model);

        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        const boundingBoxGeometry = new THREE.BoxGeometry(size.x, size.y, size.z); // Scale the height
        const boundingBoxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true, visible: false });
        const boundingBoxMesh = new THREE.Mesh(boundingBoxGeometry, boundingBoxMaterial);

        boundingBoxMesh.position.copy(center);

        scene.add(boundingBoxMesh);
    },
    undefined,
    (error) => {
        console.error('An error occurred while loading the model:', error);
    }
);


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 5, 0);

const moveSpeed = 0.25;
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
let isMoving = false; 

//modelbox
const boxGeometry = new THREE.BoxGeometry(13, 3, 15.5);
const boxMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    wireframe: true,
    transparent: true,
    opacity: 0
});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(0.35, 1.5, 0.2);
scene.add(box);

// Position the camera
camera.position.y = 10;

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
