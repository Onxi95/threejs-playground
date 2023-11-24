import * as THREE from 'three';

const canvas = document.querySelector('#three-canvas') as HTMLCanvasElement;

const scene = new THREE.Scene();

const group = new THREE.Group();
scene.add(group);

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);

cube1.position.set(-1, 0, 0);
group.add(cube1);

const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);

group.add(cube2);
cube2.position.set(1, 0, 0);

const sizes = {
  width: 800,
  height: 600,
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(0, 0, 3);
scene.add(camera);

camera.lookAt(group.position);

const renderer = new THREE.WebGLRenderer({
  canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

const clock = new THREE.Clock();

const tick = () => {
  const timeDelta = clock.getElapsedTime();
  group.rotation.y = timeDelta * Math.PI;
  group.rotation.x = timeDelta * Math.PI;
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
