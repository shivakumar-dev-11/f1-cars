import * as THREE from 'three';

let scene, camera, renderer;
let studioGroup, aeroGroup;
let targetMouseX = 0;
let targetMouseY = 0;
let currentMouseX = 0;
let currentMouseY = 0;
let targetAeroOpacity = 0;
let aeroOpacity = 0;
let targetStudioMotion = 0;
let studioMotion = 0;

const aeroCurves = [];

const curveSets = [
  [
    new THREE.Vector3(-8.5, -0.35, 0),
    new THREE.Vector3(-5.2, 0.05, 0),
    new THREE.Vector3(-1.5, 0.38, 0),
    new THREE.Vector3(2.5, 0.28, 0),
    new THREE.Vector3(7.6, 0.7, 0)
  ],
  [
    new THREE.Vector3(-8.2, -0.92, 0),
    new THREE.Vector3(-4.6, -0.72, 0),
    new THREE.Vector3(-0.8, -0.84, 0),
    new THREE.Vector3(3.8, -0.78, 0),
    new THREE.Vector3(7.7, -0.35, 0)
  ],
  [
    new THREE.Vector3(-7.5, 0.45, 0),
    new THREE.Vector3(-3.8, 0.82, 0),
    new THREE.Vector3(0.8, 1.05, 0),
    new THREE.Vector3(4.2, 0.94, 0),
    new THREE.Vector3(7.2, 1.18, 0)
  ]
];

export function initThreeScene() {
  const canvas = document.getElementById('three-canvas');
  if (!canvas) return;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 16);

  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.72;

  studioGroup = new THREE.Group();
  aeroGroup = new THREE.Group();
  scene.add(studioGroup, aeroGroup);

  createStudioReflections();
  createAeroLines();

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('resize', onWindowResize);
  animate();
}

function createStudioReflections() {
  const upperSoftbox = new THREE.Mesh(
    new THREE.PlaneGeometry(9.2, 0.16),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.08,
      depthWrite: false
    })
  );
  upperSoftbox.position.set(-2.8, 3.2, 0);
  upperSoftbox.rotation.z = -0.035;

  const lowerReflection = new THREE.Mesh(
    new THREE.PlaneGeometry(7.2, 0.1),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.045,
      depthWrite: false
    })
  );
  lowerReflection.position.set(2.5, -3.15, 0);
  lowerReflection.rotation.z = 0.045;

  const floorLine = new THREE.Mesh(
    new THREE.PlaneGeometry(16, 0.012),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.06,
      depthWrite: false
    })
  );
  floorLine.position.set(0, -3.55, 0);

  studioGroup.add(upperSoftbox, lowerReflection, floorLine);
}

function createAeroLines() {
  curveSets.forEach((points) => {
    const curve = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(90));
    const material = new THREE.LineBasicMaterial({
      color: 0xeaeaea,
      transparent: true,
      opacity: 0,
      depthWrite: false
    });
    const line = new THREE.Line(geometry, material);
    aeroGroup.add(line);
    aeroCurves.push({ line });
  });
}

function onMouseMove(event) {
  targetMouseX = (event.clientX / window.innerWidth) * 2 - 1;
  targetMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

export function setSpeedIntensity(val) {
  targetStudioMotion = Math.max(0, Math.min(1, val));
}

export function setAirflowOpacity(val) {
  targetAeroOpacity = Math.max(0, Math.min(1, val));
}

function animate() {
  requestAnimationFrame(animate);

  currentMouseX += (targetMouseX - currentMouseX) * 0.025;
  currentMouseY += (targetMouseY - currentMouseY) * 0.025;
  aeroOpacity += (targetAeroOpacity - aeroOpacity) * 0.055;
  studioMotion += (targetStudioMotion - studioMotion) * 0.04;

  camera.position.x = currentMouseX * 0.34;
  camera.position.y = currentMouseY * 0.2;
  camera.lookAt(0, 0, 0);

  studioGroup.position.x = currentMouseX * 0.12;
  studioGroup.position.y = currentMouseY * 0.06;
  studioGroup.children.forEach((mesh, index) => {
    mesh.material.opacity = [0.08, 0.045, 0.06][index] + studioMotion * 0.018;
  });

  aeroCurves.forEach((curve, index) => {
    curve.line.material.opacity = aeroOpacity * (0.16 - index * 0.025);
  });

  renderer.render(scene, camera);
}
