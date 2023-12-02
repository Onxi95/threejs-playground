import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const canvas = document.querySelector('#three-canvas') as HTMLCanvasElement;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f1729);

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.02,
  color: new THREE.Color(0xffffff),
});
const backgroundParticles = new THREE.BufferGeometry();
const backgroundParticlesMaterial = new THREE.PointsMaterial({
  size: 0.02,
});
backgroundParticlesMaterial.vertexColors = true;

const count = 100_000;

const particlePositions = new Float32Array(count * 3);
const particleColors = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  particlePositions[i] = (Math.random() - 0.5) * 2 * Math.PI;
  particleColors[i] = Math.random();
}

backgroundParticles.setAttribute(
  'position',
  new THREE.BufferAttribute(particlePositions, 3)
);
backgroundParticles.setAttribute(
  'color',
  new THREE.BufferAttribute(particleColors, 3)
);

scene.add(new THREE.Points(backgroundParticles, backgroundParticlesMaterial));

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

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const x = backgroundParticles.attributes.position.array[i3];
    backgroundParticles.attributes.position.array[i3 + 1] = Math.tan(
      x + elapsedTime
    );

    backgroundParticles.attributes.position.needsUpdate = true;
  }

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
