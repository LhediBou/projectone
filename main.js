// Setup
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x020205, 1);
container.appendChild(renderer.domElement);

// Post-processing (using global THREE placeholders for addons)
const renderScene = new THREE.RenderPass(scene, camera);
const bloomPass = new THREE.UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5, // strength
    0.4, // radius
    0.85 // threshold
);

const composer = new THREE.EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

// Particles
const particleCount = 20000;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);
const sizes = new Float32Array(particleCount);

for (let i = 0; i < particleCount; i++) {
    const r = Math.random() * 5 + 2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

    const mix = Math.random();
    colors[i * 3] = mix > 0.8 ? 0.7 : 1;
    colors[i * 3 + 1] = mix > 0.8 ? 0.8 : 1;
    colors[i * 3 + 2] = 1;
    
    sizes[i] = Math.random() * 2;
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

const material = new THREE.PointsMaterial({
    size: 0.012,
    vertexColors: true,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
});

const particleSystem = new THREE.Points(geometry, material);
scene.add(particleSystem);

// Animation logic
let startTime = Date.now();
const duration = 5000;

function animate() {
    const elapsed = Date.now() - startTime;
    const progress = (elapsed % duration) / duration; // Always loop for dev visibility

    // Gentle rotation
    particleSystem.rotation.y += 0.0008;
    particleSystem.rotation.x += 0.0004;

    // Movement: simulate "Aether" flow
    const posAttribute = geometry.attributes.position;
    for (let i = 0; i < 500; i++) { // Only update a subset for performance if needed, or all
        const idx = Math.floor(Math.random() * particleCount);
        const x = posAttribute.getX(idx);
        const y = posAttribute.getY(idx);
        posAttribute.setX(idx, x + Math.sin(elapsed * 0.001 + idx) * 0.002);
        posAttribute.setY(idx, y + Math.cos(elapsed * 0.001 + idx) * 0.002);
    }
    posAttribute.needsUpdate = true;

    // Camera zoom in/out effect
    camera.position.z = 5 - Math.sin(progress * Math.PI) * 0.5;

    // Render with post-processing
    composer.render();
    requestAnimationFrame(animate);
}

animate();

// Resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});

window.captureFrame = () => {
    renderer.render(scene, camera);
    return renderer.domElement.toDataURL('image/png');
};
