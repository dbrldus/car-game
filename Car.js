import * as THREE from "three";

const vehicleColors = ["#e74c3c", "#2ecc71", "#f1c40f", "#e67e22"];

export function Car() {
  const car = new THREE.Group();

  const color = pickRandom(vehicleColors);

  const main = new THREE.Mesh(
    new THREE.BoxBufferGeometry(60, 30, 15),
    new THREE.MeshLambertMaterial({ color })
  );
  main.position.z = 12;
  car.add(main);

  const carFrontTexture = getCarFrontTexture();
  carFrontTexture.center = new THREE.Vector2(0.5, 0.5);
  carFrontTexture.rotation = Math.PI / 2;

  const carBackTexture = getCarFrontTexture();
  carBackTexture.center = new THREE.Vector2(0.5, 0.5);
  carBackTexture.rotation = -Math.PI / 2;

  const carLeftSideTexture = getCarSideTexture();
  carLeftSideTexture.flipY = false;
  const carRightSideTexture = getCarSideTexture();

  const cabin = new THREE.Mesh(new THREE.BoxBufferGeometry(33, 24, 12), [
    new THREE.MeshLambertMaterial({ map: carFrontTexture }),
    new THREE.MeshLambertMaterial({ map: carBackTexture }),
    new THREE.MeshLambertMaterial({ map: carLeftSideTexture }),
    new THREE.MeshLambertMaterial({ map: carRightSideTexture }),
    new THREE.MeshLambertMaterial({ color: 0xffffff }),
    new THREE.MeshLambertMaterial({ color: 0xffffff }),
  ]);
  cabin.position.x = -6;
  cabin.position.z = 25.5;
  car.add(cabin);

  const backWheel = new THREE.Mesh(
    new THREE.BoxBufferGeometry(12, 33, 12),
    new THREE.MeshLambertMaterial({ color: 0x333333 })
  );
  backWheel.position.z = 6;
  backWheel.position.x = -18;
  car.add(backWheel);

  const frontWheel = new THREE.Mesh(
    new THREE.BoxBufferGeometry(12, 33, 12),
    new THREE.MeshLambertMaterial({ color: 0x333333 })
  );
  frontWheel.position.z = 6;
  frontWheel.position.x = 18;
  car.add(frontWheel);

  return car;
}

function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getCarFrontTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 32;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 64, 32);
  ctx.fillStyle = "#666666";
  ctx.fillRect(8, 8, 48, 24);

  return new THREE.CanvasTexture(canvas);
}

function getCarSideTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 32;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 128, 32);
  ctx.fillStyle = "#666666";
  ctx.fillRect(10, 8, 38, 24);
  ctx.fillRect(58, 8, 60, 24);

  return new THREE.CanvasTexture(canvas);
}
