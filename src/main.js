import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const names = [
  "Ar-Rahman", "Ar-Rahim", "Al-Malik", "Al-Quddus", "As-Salam"
];

const questions = [
  { question: "Allahın ən mərhəmətli adı hansıdır?", answer: "Ar-Rahman" },
  { question: "Allahın ən bağışlayıcı adı hansıdır?", answer: "Ar-Rahim" },
  { question: "Allahın hökmranlıq edən adı hansıdır?", answer: "Al-Malik" },
  { question: "Allahın müqəddəs adı hansıdır?", answer: "Al-Quddus" },
  { question: "Allahın sülh verən adı hansıdır?", answer: "As-Salam" }
];

let currentQuestionIndex = 0;

const questionDiv = document.createElement('div');
questionDiv.style.position = 'absolute';
questionDiv.style.top = '20px';
questionDiv.style.left = '50%';
questionDiv.style.transform = 'translateX(-50%)';
questionDiv.style.color = '#fff';
questionDiv.style.fontSize = '28px';
questionDiv.style.fontWeight = '600';
questionDiv.style.textAlign = 'center';
questionDiv.style.background = 'linear-gradient(135deg, #1e3c72, #2a5298)';
questionDiv.style.padding = '15px 30px';
questionDiv.style.borderRadius = '15px';
questionDiv.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.3)';
questionDiv.style.userSelect = 'none';
questionDiv.style.width = '80%';
questionDiv.style.maxWidth = '600px';
questionDiv.style.zIndex = '10';
document.body.appendChild(questionDiv);

function showQuestion() {
  if (currentQuestionIndex < questions.length) {
    questionDiv.textContent = questions[currentQuestionIndex].question;
  } else {
    questionDiv.textContent = "🎉 Quiz bitdi! Təbriklər! 🎉";
  }
}
showQuestion();

const scene = new THREE.Scene();
const canvasBg = document.createElement('canvas');
canvasBg.width = 32; canvasBg.height = 32;
const ctx = canvasBg.getContext('2d');
const gradient = ctx.createLinearGradient(0, 0, 32, 32);
gradient.addColorStop(0, '#141e30');
gradient.addColorStop(1, '#243b55');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 32, 32);
const bgTexture = new THREE.CanvasTexture(canvasBg);
scene.background = bgTexture;

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 8;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x243b55);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const clickable = [];

function createTextSprite(message) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const context = canvas.getContext('2d');

  // Arxa fon
  context.fillStyle = 'rgba(0, 0, 0, 0.6)';
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Mətn
  context.fillStyle = 'white';
  context.font = 'bold 36px Arial';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(message, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(2.5, 1.2, 1);
  return sprite;
}

names.forEach((name, i) => {
  const geometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
  const material = new THREE.MeshStandardMaterial({ color: new THREE.Color(`hsl(${(i * 360 / names.length)}, 80%, 50%)`), metalness: 0.5, roughness: 0.3 });
  const cube = new THREE.Mesh(geometry, material);

  const angle = i * ((Math.PI * 2) / names.length);
  const radius = 3;
  cube.position.x = Math.cos(angle) * radius;
  cube.position.y = Math.sin(angle) * radius;

  cube.userData = { name };
  clickable.push(cube);
  scene.add(cube);

  // Yazı (sprite ilə)
  const label = createTextSprite(name);
  label.position.set(cube.position.x, cube.position.y + 1.4, cube.position.z);
  label.renderOrder = 999; // Həmişə üstdə göstərilsin
  scene.add(label);
});

function createMosque() {
  const mosque = new THREE.Group();

  // Baza - silindr
  const baseGeometry = new THREE.CylinderGeometry(1.5, 1.5, 1, 64);
  const baseMaterial = new THREE.MeshStandardMaterial({ color: 0xC2B280, metalness: 0.7, roughness: 0.2 });
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  mosque.add(base);

  // Qapı - qutu
  const doorGeometry = new THREE.BoxGeometry(0.6, 1, 0.1);
  const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x5B3A29, metalness: 0.6, roughness: 0.3 });
  const door = new THREE.Mesh(doorGeometry, doorMaterial);
  door.position.set(0, -0.5, 1.5);
  mosque.add(door);

  // Minarə - silindr
  const minaretGeometry = new THREE.CylinderGeometry(0.2, 0.3, 3, 32);
  const minaretMaterial = new THREE.MeshStandardMaterial({ color: 0x8D8D8D, metalness: 0.8, roughness: 0.1 });
  const minaret = new THREE.Mesh(minaretGeometry, minaretMaterial);
  minaret.position.set(1.8, 1, 0);
  mosque.add(minaret);

  // Minarənin ucu - konus
  const coneGeometry = new THREE.ConeGeometry(0.3, 0.6, 32);
  const coneMaterial = new THREE.MeshStandardMaterial({ color: 0x6D6D6D, metalness: 0.9, roughness: 0.15 });
  const cone = new THREE.Mesh(coneGeometry, coneMaterial);
  cone.position.set(1.8, 2.1, 0);
  mosque.add(cone);

  mosque.position.set(0, -3, 0);
  scene.add(mosque);
}
createMosque();

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onClick(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(clickable);

  if (intersects.length > 0 && currentQuestionIndex < questions.length) {
    const selected = intersects[0].object.userData.name;
    const correctAnswer = questions[currentQuestionIndex].answer;

    if (selected === correctAnswer) {
      alert("✅ Doğru cavab: " + selected);
      currentQuestionIndex++;
      showQuestion();
    } else {
      alert("❌ Səhv cavab: " + selected);
    }
  }
}
window.addEventListener('click', onClick);

const radius = 3;
let time = 0;

function animate() {
  requestAnimationFrame(animate);
  time += 0.01;

  clickable.forEach((cube, i) => {
    // Orbit hərəkəti
    const angle = time + (i * (Math.PI * 2) / clickable.length);
    cube.position.x = Math.cos(angle) * radius;
    cube.position.y = Math.sin(angle) * radius;

    // Öz oxu ətrafında fırlanma
    cube.rotation.x += 0.02 + i * 0.005;
    cube.rotation.y += 0.02 + i * 0.005;

    // Rəngin yumşaq dəyişməsi HSL ilə
    const hue = (time * 50 + i * (360 / clickable.length)) % 360;
    cube.material.color.setHSL(hue / 360, 0.8, 0.5);
  });

  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
