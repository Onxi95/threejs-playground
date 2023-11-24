import * as THREE from 'three';

const canvas = document.querySelector('#three-canvas') as HTMLCanvasElement;

const scene = new THREE.Scene();

const group = new THREE.Group();
scene.add(group);

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
);

cube1.position.set(-1, 0, 0);
group.add(cube1);

const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
);

group.add(cube2);
cube2.position.set(1, 0, 0);

window.addEventListener('resize', () => {
  console.log('hi');
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight
);
camera.position.set(0, 0, 3);
scene.add(camera);

camera.lookAt(group.position);

const renderer = new THREE.WebGLRenderer({
  canvas,
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

const clock = new THREE.Clock();

const tick = () => {
  const timeDelta = clock.getElapsedTime();
  group.rotation.y = Math.cos(timeDelta) * Math.PI;
  group.rotation.x = Math.cos(timeDelta) * Math.PI;
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
