import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

const canvas = document.querySelector('#three-canvas') as HTMLCanvasElement;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f1729);

const group1 = new THREE.Group();

const fontLoader = new FontLoader();
fontLoader.load('/helvetiker_bold.typeface.json', (font) => {
  const textGeometry = new TextGeometry('Sowel', {
    font,
    size: 0.5,
    height: 0.2,
    curveSegments: 6,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  });
  textGeometry.computeBoundingBox();
  textGeometry.center();
  const textMaterial = new THREE.MeshNormalMaterial();
  // textMaterial.wireframe = true;
  const text = new THREE.Mesh(textGeometry, textMaterial);
  group1.add(text);
});

scene.add(group1);

const geometry = new THREE.SphereGeometry(0.1, 32, 32);
const material = new THREE.MeshNormalMaterial();

for (let i = 0; i < 100; i++) {
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.x = (Math.random() - 0.5) * 10;
  sphere.position.y = (Math.random() - 0.5) * 10;
  sphere.position.z = (Math.random() - 0.5) * 10;

  const scale = (Math.random() - 0.5) * 10;

  sphere.scale.set(scale, scale, scale);

  scene.add(sphere);
}

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
  const elapssedTime = clock.getElapsedTime();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
  orbit.update();
  group1.rotation.x = elapssedTime * 0.2;
  group1.rotation.y = elapssedTime * 0.2;
  group1.rotation.z = elapssedTime * 0.2;
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
