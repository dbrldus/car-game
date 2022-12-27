import * as THREE from "three";
import { Car } from "./Car";
import { renderMap } from "./Track";

export const scene = new THREE.Scene();

export const playerCar = Car();
scene.add(playerCar);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(100, -300, 400);
scene.add(dirLight);

const aspectRatio = window.innerWidth / window.innerHeight;
const cameraWidth = 1200;
const cameraHeight = cameraWidth / aspectRatio;

export const camera = new THREE.OrthographicCamera(
  cameraWidth / -2,
  cameraWidth / 2,
  cameraHeight / 2,
  cameraHeight / -2,
  0,
  1000
);

camera.position.set(0, -210, 300);
camera.lookAt(0, 0, 0);

scene.add(camera);

renderMap(cameraWidth, cameraHeight * 2);

export const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

document.body.appendChild(renderer.domElement);
