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
//function animate() {
  //  requestAnimationFrame(animate);
   // planet.rotation.y += 0.004;  // Rotación del planeta sobre su eje Y
    //renderer.render(scene, camera);
//}




// Crear la estrella fugaz
const starGeometry = new THREE.SphereGeometry(0.05, 16, 16);
const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const shootingStar = new THREE.Mesh(starGeometry, starMaterial);
shootingStar.position.set(-5, 2, -8); // Posición inicial
scene.add(shootingStar);

// Crear el rastro de la estrella fugaz
const trailGeometry = new THREE.BufferGeometry();
const trailMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.5, transparent: true });
const trailVertices = new Float32Array(6); // Línea entre 2 puntos
trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailVertices, 3));
const starTrail = new THREE.Line(trailGeometry, trailMaterial);
scene.add(starTrail);


// Animación de la estrella fugaz
function animateShootingStar() {
    if (shootingStar.position.x < 5) {
        shootingStar.position.x += 0.1; // Movimiento hacia la derecha
        shootingStar.position.y -= 0.03; // Movimiento descendente
        shootingStar.position.z += 0.05; // Movimiento hacia adelante

        // Actualizar rastro
        const positions = starTrail.geometry.attributes.position.array;
        positions[0] = shootingStar.position.x;
        positions[1] = shootingStar.position.y;
        positions[2] = shootingStar.position.z;
        positions[3] = shootingStar.position.x - 0.5;
        positions[4] = shootingStar.position.y + 0.2;
        positions[5] = shootingStar.position.z - 0.5;
        starTrail.geometry.attributes.position.needsUpdate = true;
    } else {
        shootingStar.position.set(-5, 2, -5); // Reiniciar posición
    }
}


// Crear el platillo volador
const ufoGroup = new THREE.Group();

// **Disco Principal** (más pequeño)
const ufoDiskGeometry = new THREE.CylinderGeometry(0.2, 0.4, 0.1, 64); // Tamaño del disco
const ufoDiskMaterial = new THREE.MeshStandardMaterial({
    color: 0x444444, // Gris oscuro
    metalness: 0.8,
    roughness: 0.4,
});
const ufoDisk = new THREE.Mesh(ufoDiskGeometry, ufoDiskMaterial);
ufoDisk.rotation.x = Math.PI / 2; // Orientación horizontal
ufoGroup.add(ufoDisk);

// **Cúpula Superior**
const ufoDomeGeometry = new THREE.SphereGeometry(0.1, 32, 32, 0, Math.PI); // Media esfera
const ufoDomeMaterial = new THREE.MeshStandardMaterial({
    color: 0x555555, // Gris oscuro
    metalness: 0.8,
    roughness: 0.3,
});
const ufoDome = new THREE.Mesh(ufoDomeGeometry, ufoDomeMaterial);
ufoDome.position.y = 0.1; // Ubicar sobre el disco
ufoGroup.add(ufoDome);

// **Luz Central Azul**
const centerLightGeometry = new THREE.SphereGeometry(0.05, 16, 16); // Esfera pequeña para la luz central
const centerLightMaterial = new THREE.MeshBasicMaterial({ color: 0x00ccff }); // Luz azul brillante
const centerLight = new THREE.Mesh(centerLightGeometry, centerLightMaterial);
centerLight.position.set(0, -0.02, 0); // Debajo del disco
ufoGroup.add(centerLight);

// **Rayo de Luz Azul**
const rayGeometry = new THREE.CylinderGeometry(0.05, 0.4, 2, 32, 1, true); // Forma de cono invertido
const rayMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ccff,
    opacity: 0.2, // Semi-transparente
    transparent: true,
});
const ray = new THREE.Mesh(rayGeometry, rayMaterial);
ray.position.y = -1; // Posicionado debajo del disco
ufoGroup.add(ray);

// Configuración inicial del platillo
ufoGroup.position.set(0, 1, -10); // Inicialmente en el fondo
scene.add(ufoGroup);

// **Animación del Platillo Volador (Movimiento Lineal)**
function animateUFO() {
    if (ufoGroup.position.z < 3) {
        ufoGroup.position.z += 0.05; // Movimiento hacia adelante
    } else {
        ufoGroup.position.set(0, 1, -10); // Reiniciar posición
    }
}



// **Partículas**
const particlesGroup = new THREE.Group(); // Crear un grupo para las partículas
const sphereCount = 900; // Número de partículas
const particles = []; // Arreglo para almacenar las partículas

for (let i = 0; i < sphereCount; i++) {
    const geometry = new THREE.SphereGeometry(0.1, 8, 8); // Pequeñas esferas como partículas
    const material = new THREE.MeshBasicMaterial({
        color: 0x888888, // gris oscuro
        transparent: true,
        opacity: Math.random() * 0.7 + 0.3, // Opacidad aleatoria
    });
    const particle = new THREE.Mesh(geometry, material);
    particle.position.set(
        Math.random() * 100 - 50, // Posición aleatoria en X
        Math.random() * 100 - 50, // Posición aleatoria en Y
        Math.random() * -200 // Profundidad aleatoria en Z
    );
    particles.push(particle); // Agregar la partícula al arreglo
    particlesGroup.add(particle); // Agregar al grupo de partículas
}

scene.add(particlesGroup); // Agregar las partículas a la escena principal

// **Animación de las Partículas**
function animateParticles() {
    particles.forEach((particle) => {
        particle.position.z += 0.2; // Movimiento hacia adelante en Z
        if (particle.position.z > 100) {
            // Reiniciar posición cuando salga del campo de visión
            particle.position.z = Math.random() * -200;
            particle.position.x = Math.random() * 100 - 50;
            particle.position.y = Math.random() * 100 - 50;
        }
        // Variar ligeramente la opacidad para simular parpadeo
        particle.material.opacity = Math.random() * 0.7 + 0.3;
    });
}



// Animación general
function animate() {
    requestAnimationFrame(animate);

    // Rotación del planeta
    planet.rotation.y += 0.004;

    // Animar el platillo y la estrella fugaz
    animateUFO();
    animateShootingStar();
    animateParticles();

    renderer.render(scene, camera);
}

// Ajustar tamaño del renderizador
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

// Iniciar la animación
animate();

