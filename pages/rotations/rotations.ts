import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui';
import gsap from 'gsap';

const canvas = document.querySelector('#three-canvas') as HTMLCanvasElement;

const gui = new GUI();
const store = {
  color: 0x00ff00,
};

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

const material = new THREE.MeshBasicMaterial({
  color: store.color,
  wireframe: true,
});
const BoxGeometry = new THREE.BoxGeometry(1, 1, 1, 3, 3, 3);
const cube1 = new THREE.Mesh(
  // geometry,
  BoxGeometry,
  material
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

gui.add(cube1.position, 'x').min(-3).max(3).step(0.01);
gui.add(cube1.position, 'y').min(-3).max(3).step(0.01);
gui.add(cube1, 'visible');
gui.add(cube1.material, 'wireframe');

gui.addColor(store, 'color').onChange(() => {
  material.color.set(store.color);
});
gui.add(
  {
    spin() {
      gsap.to(cube1.rotation, {
        duration: 1,
        y: cube1.rotation.y + Math.PI * 2,
      });
    },
  },
  'spin'
);

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
