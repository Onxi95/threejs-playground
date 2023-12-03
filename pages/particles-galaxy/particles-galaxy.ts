import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui';
const canvas = document.querySelector('#three-canvas') as HTMLCanvasElement;

const gui = new GUI();
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f1729);

const store = {
  count: 100_000,
  size: 0.02,
};

gui
  .add(store, 'count')
  .min(100)
  .max(1_000_000)
  .step(100)
  .onFinishChange(generateGalaxy);
gui
  .add(store, 'size')
  .min(0.01)
  .max(0.1)
  .step(0.01)
  .onFinishChange(generateGalaxy);

let geometry: THREE.BufferGeometry;
let material: THREE.PointsMaterial;
let points: THREE.Points;

function generateGalaxy() {
  if (geometry || material || points) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }
  geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(store.count * 3);

  for (let i = 0; i < store.count * 3; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 2 * Math.PI;
    positions[i3 + 2] = (Math.random() - 0.5) * 2 * Math.PI;
    positions[i3 + 1] = (Math.random() - 0.5) * 2 * Math.PI;
  }

  material = new THREE.PointsMaterial({
    size: store.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  points = new THREE.Points(geometry, material);
  scene.add(points);

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
}

generateGalaxy();

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
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

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

window.addEventListener('dblclick', () => {
  if (document.fullscreenElement) {
    return document.exitFullscreen();
  }
  canvas.requestFullscreen();
});
