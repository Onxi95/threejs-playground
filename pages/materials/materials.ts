import GUI from 'lil-gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
const textureLoader = new THREE.TextureLoader();
const doorColorTexture = textureLoader.load('./textures/door/color.jpg');
const doorAlphaTexture = textureLoader.load('./textures/door/alpha.jpg');
const doorAmbientOcclusionTexture = textureLoader.load(
  './textures/door/ambientOcclusion.jpg'
);
const doorHeightTexture = textureLoader.load('./textures/door/height.jpg');
const doorNormalTexture = textureLoader.load('./textures/door/normal.jpg');
const doorMetalnessTexture = textureLoader.load(
  './textures/door/metalness.jpg'
);
const doorRoughnessTexture = textureLoader.load(
  './textures/door/roughness.jpg'
);
const matcapTexture = textureLoader.load('./textures/matcaps/1.png');
const gradientTexture = textureLoader.load('./textures/gradients/3.jpg');
doorColorTexture.colorSpace = THREE.SRGBColorSpace;
matcapTexture.colorSpace = THREE.SRGBColorSpace;

const canvas = document.querySelector('#three-canvas') as HTMLCanvasElement;

const gui = new GUI();

const store = {
  color: 0xffffff,
};

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f1729);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(2, 3, 4);
scene.add(pointLight);

const material = new THREE.MeshPhysicalMaterial();
material.metalness = 0.7;
material.roughness = 0.2;
material.transmission = 1;

const rgbeLoader = new RGBELoader();
rgbeLoader.load('./textures/environmentMap/2k.hdr', (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = environmentMap;
  scene.environment = environmentMap;
});

gui.add(material, 'metalness').min(0).max(1).step(0.0001);
gui.add(material, 'roughness').min(0).max(1).step(0.0001);
gui.add(material, 'transmission').min(0).max(1).step(0.0001);

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), material);
sphere.position.set(-1.5, 0, 0);

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 16, 32),
  material
);
torus.position.set(1.5, 0, 0);

scene.add(sphere, plane, torus);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight
);
camera.position.set(0, 0, 10);
scene.add(camera);

const orbit = new OrbitControls(camera, canvas);
orbit.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

const cursor = {
  x: 0,
  y: 0,
};

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  sphere.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.5 * elapsedTime;
  plane.rotation.x = 0.5 * elapsedTime;
  torus.rotation.x = 0.5 * elapsedTime;

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
  orbit.update();
};

tick();
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('mousemove', (event) => {
  cursor.x = event.clientX / window.innerWidth - 0.5;
  cursor.y = -(event.clientY / window.innerHeight - 0.5);
});

window.addEventListener('dblclick', () => {
  if (document.fullscreenElement) {
    return document.exitFullscreen();
  }
  canvas.requestFullscreen();
});
