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
  radius: 5,
  branches: 5,
  spin: 1,
  randomness: 0.2,
  power: 3,
  insideColor: 0x0e30dd,
  outsideColor: 0x451b83,
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
gui
  .add(store, 'radius')
  .min(1)
  .max(20)
  .step(0.01)
  .onFinishChange(generateGalaxy);
gui
  .add(store, 'branches')
  .min(2)
  .max(20)
  .step(1)
  .onFinishChange(generateGalaxy);
gui.add(store, 'spin').min(-5).max(5).step(0.01).onFinishChange(generateGalaxy);
gui
  .add(store, 'randomness')
  .min(0)
  .max(2)
  .step(0.001)
  .onFinishChange(generateGalaxy);
gui
  .add(store, 'power')
  .min(1)
  .max(10)
  .step(0.001)
  .onFinishChange(generateGalaxy);
gui.addColor(store, 'insideColor').onFinishChange(generateGalaxy);
gui.addColor(store, 'outsideColor').onFinishChange(generateGalaxy);

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
  const colors = new Float32Array(store.count * 3);

  const insideColor = new THREE.Color(store.insideColor);
  const outsideColor = new THREE.Color(store.outsideColor);

  for (let i = 0; i < store.count * 3; i++) {
    const i3 = i * 3;

    const radius = Math.random() * store.radius;
    const branchAngle = ((i % store.branches) / store.branches) * Math.PI * 2;
    const spinAngle = store.spin * radius;

    const mixedColor = insideColor
      .clone()
      .lerp(outsideColor, radius / store.radius);

    const randomX =
      Math.pow(Math.random(), store.power) *
      (Math.random() < 0.5 ? 1 : -1) *
      store.randomness *
      radius;
    const randomY =
      Math.pow(Math.random(), store.power) *
      (Math.random() < 0.5 ? 1 : -1) *
      store.randomness *
      radius;
    const randomZ =
      Math.pow(Math.random(), store.power) *
      (Math.random() < 0.5 ? 1 : -1) *
      store.randomness *
      radius;

    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;

    positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;
  }

  material = new THREE.PointsMaterial({
    size: store.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  points = new THREE.Points(geometry, material);
  scene.add(points);

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
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
