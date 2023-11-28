import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui';

const canvas = document.querySelector('#three-canvas') as HTMLCanvasElement;
const gui = new GUI();

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f1729);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
directionalLight.position.set(4, 6, 4);
scene.add(directionalLight);
const hemisphereLight = new THREE.HemisphereLight(0x0000ff, 0xff0000, 0.9);
scene.add(hemisphereLight);

const pointLight = new THREE.PointLight(0xff9fff, 1.5);
pointLight.position.set(2, 3, 4);
scene.add(pointLight);

const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7;
material.roughness = 0.2;

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), material);
sphere.position.set(-1.5, 0, 0);

const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 16, 32),
  material
);
torus.position.set(1.5, 0, 0);

const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), material);
floor.rotation.x = -Math.PI * 0.5;
floor.position.set(0, -1.5, 0);

scene.add(sphere, cube, torus, floor);

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

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.5 * elapsedTime;
  cube.rotation.x = 0.5 * elapsedTime;
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

gui
  .add(ambientLight, 'intensity')
  .min(0)
  .max(3)
  .step(0.001)
  .name('Ambient Light');
gui
  .add(directionalLight, 'intensity')
  .min(0)
  .max(3)
  .step(0.001)
  .name('Directional Light');
gui
  .add(hemisphereLight, 'intensity')
  .min(0)
  .max(3)
  .step(0.001)
  .name('Hemisphere Light');
gui
  .add(directionalLight.position, 'x')
  .min(-5)
  .max(5)
  .step(0.001)
  .name('Directional Light Position X');
gui
  .add(directionalLight.position, 'y')
  .min(-5)
  .max(5)
  .step(0.001)
  .name('Directional Light Position Y');

gui.add(material, 'metalness').min(0).max(1).step(0.001).name('Metalness');
gui.add(material, 'roughness').min(0).max(1).step(0.001).name('Roughness');

window.addEventListener('dblclick', () => {
  if (document.fullscreenElement) {
    return document.exitFullscreen();
  }
  canvas.requestFullscreen();
});
