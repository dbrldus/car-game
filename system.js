import { Car } from "./Car";
import { GameEnd, GameStart } from "./leaderboard";
import { camera, playerCar, renderer, scene } from "./main";
import { arcCenterX, trackRadius } from "./Track";

let ready;
let playerAngleMoved;
let score;
const scoreElement = document.getElementById("score");
let otherVehicles = [];
let lastTimestamp;
const speed = 0.002;
let accelerate = false;
let decelerate = false;
const playerAngleInitial = Math.PI;

reset();

function reset() {
  playerAngleMoved = 0;
  movePlayerCar(0);
  score = 0;
  scoreElement.innerText = `Score : ${score}`;

  lastTimestamp = undefined;

  otherVehicles.forEach((vehicle) => {
    scene.remove(vehicle.mesh);
  });
  otherVehicles = [];

  renderer.render(scene, camera);
  ready = true;
}

function startGame() {
  if (ready) {
    ready = false;
    GameStart();
    renderer.setAnimationLoop(animation);
  }
}

window.addEventListener("keydown", (event) => {
  if (event.key == "ArrowUp") {
    startGame();
    accelerate = true;
    return;
  }

  if (event.key == "ArrowDown") {
    decelerate = true;
    return;
  }

  if (event.key == "R" || event.key == "r") {
    reset();
    return;
  }
});

window.addEventListener("keyup", (event) => {
  if (event.key == "ArrowUp") {
    accelerate = false;
    return;
  }

  if (event.key == "ArrowDown") {
    decelerate = false;
    return;
  }
});

function animation(timestamp) {
  if (!lastTimestamp) {
    lastTimestamp = timestamp;
    return;
  }

  const timeDelta = timestamp - lastTimestamp;
  movePlayerCar(timeDelta);

  const laps = Math.floor(Math.abs(playerAngleMoved) / (Math.PI * 2));
  if (laps != score) {
    score = laps;
    scoreElement.innerText = `Score : ${score}`;
  }

  if (otherVehicles.length < (laps + 1) / 7) {
    addVehicle();
  }

  moveOtherVehicles(timeDelta);
  hitDetection();

  renderer.render(scene, camera);
  lastTimestamp = timestamp;
}

function movePlayerCar(timeDelta) {
  const playerSpeed = getPlayerSpeed();
  playerAngleMoved -= playerSpeed * timeDelta;

  const totalPlayerAngle = playerAngleInitial + playerAngleMoved;
  const playerX = Math.cos(totalPlayerAngle) * trackRadius - arcCenterX;
  const playerY = Math.sin(totalPlayerAngle) * trackRadius;
  playerCar.position.x = playerX;
  playerCar.position.y = playerY;
  playerCar.rotation.z = totalPlayerAngle - Math.PI / 2;
}

function getPlayerSpeed() {
  if (accelerate) return speed * 2;
  if (decelerate) return speed * 0.4;
  return speed;
}

function addVehicle() {
  const mesh = Car();
  scene.add(mesh);

  const clockwise = Math.random() >= 0.5;
  const angle = clockwise ? Math.PI / 2 : -Math.PI / 2;

  const speed = getVehicleSpeed();
  otherVehicles.push({ mesh, clockwise, angle, speed });
}

function getVehicleSpeed() {
  const minSpeed = 1;
  const maxSpeed = 2;
  return minSpeed + Math.random() * (maxSpeed - minSpeed);
}

function moveOtherVehicles(timeDelta) {
  otherVehicles.forEach((vehicle) => {
    if (vehicle.clockwise) {
      vehicle.angle -= speed * timeDelta * vehicle.speed;
    } else {
      vehicle.angle += speed * timeDelta * vehicle.speed;
    }

    const vehicleX = Math.cos(vehicle.angle) * trackRadius + arcCenterX;
    const vehicleY = Math.sin(vehicle.angle) * trackRadius;
    const rotation =
      vehicle.angle + (vehicle.clockwise ? -Math.PI / 2 : Math.PI / 2);

    vehicle.mesh.position.x = vehicleX;
    vehicle.mesh.position.y = vehicleY;
    vehicle.mesh.rotation.z = rotation;
  });
}

function getHitZonePosition(center, angle, clockwise, distance) {
  const directionAngle = angle + clockwise ? -Math.PI / 2 : Math.PI / 2;
  return {
    x: center.x + Math.cos(directionAngle) * distance,
    y: center.y + Math.sin(directionAngle) * distance,
  };
}

function hitDetection() {
  const playerHitZone1 = getHitZonePosition(
    playerCar.position,
    playerAngleInitial + playerAngleMoved,
    true,
    15
  );
  const playerHitZone2 = getHitZonePosition(
    playerCar.position,
    playerAngleInitial + playerAngleMoved,
    true,
    -15
  );

  const hit = otherVehicles.some((vehicle) => {
    const vehicleHitZone1 = getHitZonePosition(
      vehicle.mesh.position,
      vehicle.angle,
      vehicle.clockwise,
      15
    );

    const vehicleHitZone2 = getHitZonePosition(
      vehicle.mesh.position,
      vehicle.angle,
      vehicle.clockwise,
      -15
    );

    if (getDistance(playerHitZone1, vehicleHitZone1) < 40) return true;
    if (getDistance(playerHitZone1, vehicleHitZone2) < 40) return true;
    if (getDistance(playerHitZone2, vehicleHitZone1) < 40) return true;
  });
  if (hit) {
    renderer.setAnimationLoop(null);
    GameEnd(score);
  }
}

function getDistance(coord1, coord2) {
  return Math.sqrt((coord2.x - coord1.x) ** 2 + (coord2.y - coord1.y) ** 2);
}
