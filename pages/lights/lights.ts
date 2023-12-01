import * as THREE from 'three';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui';

const canvas = document.querySelector('#three-canvas') as HTMLCanvasElement;
const gui = new GUI();

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f1729);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
directionalLight.shadow.mapSize.x = 4096
directionalLight.shadow.mapSize.y = 4096
directionalLight.position.set(4, 6, 4);
directionalLight.castShadow = true;
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 20;
directionalLight.shadow.camera.top = 8;
directionalLight.shadow.camera.bottom = -8;
directionalLight.shadow.camera.left = -15;
directionalLight.shadow.camera.right = 15;
scene.add(directionalLight);

const hemisphereLight = new THREE.HemisphereLight(0x0000ff, 0xff0000, 0.9);
scene.add(hemisphereLight);

const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 6, 3, 1);
rectAreaLight.position.set(-2, -1, 0);
rectAreaLight.rotation.set(0, 5, 0);
scene.add(rectAreaLight);

const pointLight = new THREE.PointLight(0xff9fff, 1.5);
pointLight.castShadow = true;
pointLight.position.set(2, 3, 4);
scene.add(pointLight);

const spotLight = new THREE.SpotLight(0x00ff00, 10, 10, Math.PI * 0.1);
spotLight.position.set(0, 2, 3);
scene.add(spotLight);

const hemisphereLightHelper = new THREE.HemisphereLightHelper(
  hemisphereLight,
  0.2
);
scene.add(hemisphereLightHelper);

const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  0.2
);

scene.add(directionalLightHelper);

const directionalLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
scene.add(directionalLightCameraHelper);

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

const pointLightHelper = new THREE.PointLightHelper(pointLight);
scene.add(pointLightHelper);

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaLightHelper);

const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7;
material.roughness = 0.2;

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), material);
sphere.position.set(-3, 0, 0);

const bouncingSphere = new THREE.Mesh(new THREE.SphereGeometry(0.5), material);
bouncingSphere.position.set(0, 0, 0);
bouncingSphere.castShadow = true;
scene.add(bouncingSphere);

const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 16, 32),
  material
);
torus.position.set(3, 0, 0);

const floor = new THREE.Mesh(new THREE.PlaneGeometry(15, 15), material);
floor.rotation.x = -Math.PI * 0.5;
floor.position.set(0, -1.5, 0);
floor.receiveShadow = true;

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
renderer.shadowMap.enabled = true;
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

  bouncingSphere.position.x = Math.cos(elapsedTime) * 6;
  bouncingSphere.position.z = Math.sin(elapsedTime) * 6;
  bouncingSphere.position.y = Math.abs(Math.sin(elapsedTime * 3)) - 1;

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
  .add(rectAreaLight, 'intensity')
  .min(0)
  .max(20)
  .step(0.001)
  .name('Rect Light');
gui.add(spotLight, 'intensity').min(0).max(20).step(0.001).name('Spot Light');
gui.add(spotLight, 'penumbra').min(0).max(1).step(0.001).name('Spot Penumbra');
gui.add(pointLight, 'intensity').min(0).max(20).step(0.001).name('Point Light');
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
