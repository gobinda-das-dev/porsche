import './style.css'
import * as THREE from 'three';
import GUI from 'lil-gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

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
   //  scene.background = texture;
  });
}

// Load the initial environment map
loadEnvironmentMap(environmentMaps['Studio Garden']);

// Load the Porsche model
const gltfLoader = new GLTFLoader();
gltfLoader.load('./porsche.glb', (gltf) => {
  scene.add(gltf.scene);
});

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