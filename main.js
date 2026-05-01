// Initialization
const canvas = document.getElementById('bg-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true, // Transparent background
  antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Camera position
camera.position.z = 50;

// Particle System
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 4000; // Dense particle field

const posArray = new Float32Array(particlesCount * 3);
const colorsArray = new Float32Array(particlesCount * 3);

// Futuristic color palette
const color1 = new THREE.Color('#00f0ff'); // Neon Blue
const color2 = new THREE.Color('#ff003c'); // Neon Pink/Red
const color3 = new THREE.Color('#9d00ff'); // Neon Purple

for(let i = 0; i < particlesCount * 3; i+=3) {
    // Spread particles across a wide area (creating a sphere/cube distribution)
    posArray[i] = (Math.random() - 0.5) * 200; // x
    posArray[i+1] = (Math.random() - 0.5) * 200; // y
    posArray[i+2] = (Math.random() - 0.5) * 200; // z

    // Randomize colors
    const rand = Math.random();
    let selectedColor = color1;
    if (rand > 0.66) {
        selectedColor = color2;
    } else if (rand > 0.33) {
        selectedColor = color3;
    }

    colorsArray[i] = selectedColor.r;
    colorsArray[i+1] = selectedColor.g;
    colorsArray[i+2] = selectedColor.b;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

// Custom material for glowing particles
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.4,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending // Essential for the neon glow effect
});

const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particleMesh);

// Mouse Interactivity
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
});

// Resize handler
window.addEventListener('resize', () => {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Scroll interaction (parallax based on scroll)
let scrollY = 0;
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Constant slow rotation
    particleMesh.rotation.y = elapsedTime * 0.05;
    particleMesh.rotation.z = elapsedTime * 0.02;

    // Parallax effect with mouse
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;
    
    // Smooth interpolation for mouse interaction
    particleMesh.rotation.y += 0.05 * (targetX - particleMesh.rotation.y);
    particleMesh.rotation.x += 0.05 * (targetY - particleMesh.rotation.x);

    // Scroll effect - move particles up as user scrolls down
    camera.position.y = -scrollY * 0.02;

    renderer.render(scene, camera);
}

animate();
