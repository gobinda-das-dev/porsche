import './style.css'
import * as THREE from 'three';
import GUI from 'lil-gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

const gui = new GUI();

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Load environment map
const rgbeLoader = new RGBELoader();
const environmentMaps = {
  'Qwantani Dusk': 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/qwantani_dusk_2_1k.hdr',
  'Hochsal Field': 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/hochsal_field_1k.hdr',
  'Rogland Moonlit Night': 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/rogland_moonlit_night_1k.hdr',
  'Studio Garden': 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_garden_1k.hdr',
  'Metro Vijzelgracht': 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/metro_vijzelgracht_1k.hdr'
};

function loadEnvironmentMap(url) {
  rgbeLoader.load(url, function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    scene.background = texture;
  });
}

// Load the initial environment map
loadEnvironmentMap(environmentMaps['Studio Garden']);

// Create a sphere geometry
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x0077ff,
  transparent: true,
  roughness: 0,
  reflectivity: 0,
  clearcoat: 1
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

// Add GUI controls for MeshPhysicalMaterial and MeshStandardMaterial properties
const materialFolder = gui.addFolder('Sphere Material');
materialFolder.addColor(sphereMaterial, 'color').name('Color');
materialFolder.add(sphereMaterial, 'roughness', 0, 1).name('Roughness');
materialFolder.add(sphereMaterial, 'metalness', 0, 1).name('Metalness');
materialFolder.add(sphereMaterial, 'reflectivity', 0, 1).name('Reflectivity');
materialFolder.add(sphereMaterial, 'clearcoat', 0, 1).name('Clearcoat');
materialFolder.add(sphereMaterial, 'clearcoatRoughness', 0, 1).name('Clearcoat Roughness');

materialFolder.open();

// Add GUI controls for environment map selection
const environmentFolder = gui.addFolder('Environment');
environmentFolder.add({ map: 'Studio Garden' }, 'map', Object.keys(environmentMaps)).name('Environment Map').onChange((value) => {
  loadEnvironmentMap(environmentMaps[value]);
});

environmentFolder.open();

function animate() {
    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);
}

animate();