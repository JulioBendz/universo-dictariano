import * as THREE from 'three';
// import './script.js'; // Asegúrate de que las rutas sean correctas

// import { Scene, PerspectiveCamera, WebGLRenderer, TextureLoader, SphereGeometry, MeshStandardMaterial, Mesh, PointLight } from 'three';

// Crea la escena, cámara y renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Fondo espacial
const spaceTexture = new THREE.TextureLoader().load('/assets/2k_stars.jpg');
scene.background = spaceTexture;

// Crea la esfera (planeta) con la textura de la Tierra
const planetTexture = new THREE.TextureLoader().load('/assets/earthx5400x2700.jpg');
const planetGeometry = new THREE.SphereGeometry(1, 32, 32);
const planetMaterial = new THREE.MeshStandardMaterial({ map: planetTexture });
const planet = new THREE.Mesh(planetGeometry, planetMaterial);
scene.add(planet);

// Añade luz para que el planeta sea visible

// const light = new THREE.PointLight(0xffffff, 1.5, 150); // Aumenta la intensidad y el alcance

// Luz principal (simula el sol)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5); // Aumenta la intensidad y el alcance
directionalLight.position.set(3, 3, 3); // Ubica la luz en una posición lejana y diagonal al planeta
scene.add(directionalLight);

// Luz ambiental para rellenar sombras
 const ambientLight = new THREE.AmbientLight(0x404040, 0.4); // Luz suave en todo el ambiente
// scene.add(ambientLight);

 const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x333333, 0.9); // Azul cielo y gris oscuro para el suelo
// scene.add(hemisphereLight);

// Posición inicial de la cámara
camera.position.z = 3;

// Función de animación para rotar el planeta
function animate() {
    requestAnimationFrame(animate);
    planet.rotation.y += 0.004;  // Rotación del planeta sobre su eje Y
    renderer.render(scene, camera);
}

// Ajustar tamaño del renderizador y cámara al cambiar el tamaño de la ventana
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

// Iniciar la animación
animate();
