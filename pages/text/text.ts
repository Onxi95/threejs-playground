import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

const canvas = document.querySelector('#three-canvas') as HTMLCanvasElement;

const store = {
  color: 0xffffff,
};

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f1729);

const fontLoader = new FontLoader();
fontLoader.load('/helvetiker_bold.typeface.json', (font) => {
  const textGeometry = new TextGeometry('Hello', {
    font,
    size: 0.5,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  const textMaterial = new THREE.MeshBasicMaterial();
  const text = new THREE.Mesh(textGeometry, textMaterial);
  scene.add(text);
});

const material = new THREE.MeshBasicMaterial({
  color: store.color,
  wireframe: true,
});
const BoxGeometry = new THREE.BoxGeometry(1, 1, 1, 3, 3, 3);
const cube1 = new THREE.Mesh(BoxGeometry, material);
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

window.addEventListener('dblclick', () => {
  if (document.fullscreenElement) {
    return document.exitFullscreen();
  }
  canvas.requestFullscreen();
});
