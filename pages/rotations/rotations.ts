import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
const canvas = document.querySelector('#three-canvas') as HTMLCanvasElement;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f1729);

const count = 3;
const positionsArray = new Float32Array(count * 3 * 3);
for (let i = 0; i < count * 3 * 3; i++) {
  positionsArray[i] = (Math.random() - 0.5) * 5;
}

const geometry = new THREE.BufferGeometry();
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
geometry.setAttribute('position', positionsAttribute);

const cube1 = new THREE.Mesh(
  // new THREE.BoxGeometry(1, 1, 1, 3, 3, 3),
  geometry,
  new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
);
cube1.position.set(0, 0, 0);
scene.add(cube1);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight
);
camera.position.set(0, 0, 10);
scene.add(camera);

const orbit = new OrbitControls(camera, canvas);
orbit.enableDamping = true;
camera.lookAt(cube1.position);

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

const tick = () => {
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
