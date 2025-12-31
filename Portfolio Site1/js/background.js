/*==================== THREE.JS BACKGROUND ====================*/

document.addEventListener('DOMContentLoaded', () => {
    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.error('Three.js is not loaded');
        return;
    }

    // Get the container element
    const container = document.querySelector('.background-container');
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById('background-canvas'),
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    
    const posArray = new Float32Array(particlesCount * 3);
    const scaleArray = new Float32Array(particlesCount);
    
    // Fill the arrays with random positions and scales
    for (let i = 0; i < particlesCount * 3; i += 3) {
        // Position
        posArray[i] = (Math.random() - 0.5) * 100; // x
        posArray[i + 1] = (Math.random() - 0.5) * 100; // y
        posArray[i + 2] = (Math.random() - 0.5) * 100; // z
        
        // Scale
        scaleArray[i / 3] = Math.random();
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('scale', new THREE.BufferAttribute(scaleArray, 1));
    
    // Create material
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.2,
        sizeAttenuation: true,
        transparent: true,
        alphaTest: 0.5,
        opacity: 0.8
    });
    
    // Create a gradient texture for particles
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2
    );
    
    // Get CSS variables for colors
    const computedStyle = getComputedStyle(document.documentElement);
    const primaryColor = computedStyle.getPropertyValue('--primary-color').trim() || '#6e57e0';
    const secondaryColor = computedStyle.getPropertyValue('--secondary-color').trim() || '#00d9ff';
    
    gradient.addColorStop(0, secondaryColor);
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const texture = new THREE.CanvasTexture(canvas);
    particlesMaterial.map = texture;
    
    // Create the particle system
    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);
    
    // Add some larger glowing spheres
    const glowingSpheres = [];
    const sphereCount = 5;
    
    for (let i = 0; i < sphereCount; i++) {
        const geometry = new THREE.SphereGeometry(Math.random() * 0.5 + 0.5, 32, 32);
        
        // Create a shader material for the glow effect
        const material = new THREE.ShaderMaterial({
            uniforms: {
                glowColor: { value: new THREE.Color(i % 2 === 0 ? primaryColor : secondaryColor) },
                viewVector: { value: camera.position }
            },
            vertexShader: `
                uniform vec3 viewVector;
                varying float intensity;
                void main() {
                    vec3 vNormal = normalize(normalMatrix * normal);
                    vec3 vNormel = normalize(normalMatrix * viewVector);
                    intensity = pow(0.6 - dot(vNormal, vNormel), 2.0);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 glowColor;
                varying float intensity;
                void main() {
                    vec3 glow = glowColor * intensity;
                    gl_FragColor = vec4(glow, 1.0);
                }
            `,
            side: THREE.FrontSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        });
        
        const sphere = new THREE.Mesh(geometry, material);
        
        // Random position
        sphere.position.x = (Math.random() - 0.5) * 60;
        sphere.position.y = (Math.random() - 0.5) * 60;
        sphere.position.z = (Math.random() - 0.5) * 60;
        
        // Random rotation speed
        sphere.userData = {
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.01,
                y: (Math.random() - 0.5) * 0.01,
                z: (Math.random() - 0.5) * 0.01
            },
            movementSpeed: {
                x: (Math.random() - 0.5) * 0.05,
                y: (Math.random() - 0.5) * 0.05,
                z: (Math.random() - 0.5) * 0.05
            },
            movementRange: {
                x: { min: sphere.position.x - 10, max: sphere.position.x + 10 },
                y: { min: sphere.position.y - 10, max: sphere.position.y + 10 },
                z: { min: sphere.position.z - 10, max: sphere.position.z + 10 }
            },
            movementDirection: {
                x: Math.random() > 0.5 ? 1 : -1,
                y: Math.random() > 0.5 ? 1 : -1,
                z: Math.random() > 0.5 ? 1 : -1
            }
        };
        
        scene.add(sphere);
        glowingSpheres.push(sphere);
    }
    
    // Add some connecting lines between spheres
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending
    });
    
    const lines = [];
    
    for (let i = 0; i < glowingSpheres.length; i++) {
        for (let j = i + 1; j < glowingSpheres.length; j++) {
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(6); // 2 points, 3 coordinates each
            
            // Initial positions will be updated in the animation loop
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            
            const line = new THREE.Line(geometry, lineMaterial);
            scene.add(line);
            
            lines.push({
                line,
                sphereA: glowingSpheres[i],
                sphereB: glowingSpheres[j]
            });
        }
    }
    
    // Mouse interaction
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    
    document.addEventListener('mousemove', (event) => {
        // Calculate mouse position in normalized device coordinates
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate the particle system
        particleSystem.rotation.x += 0.0005;
        particleSystem.rotation.y += 0.0005;
        
        // Update glowing spheres
        glowingSpheres.forEach(sphere => {
            // Rotate
            sphere.rotation.x += sphere.userData.rotationSpeed.x;
            sphere.rotation.y += sphere.userData.rotationSpeed.y;
            sphere.rotation.z += sphere.userData.rotationSpeed.z;
            
            // Move
            sphere.position.x += sphere.userData.movementSpeed.x * sphere.userData.movementDirection.x;
            sphere.position.y += sphere.userData.movementSpeed.y * sphere.userData.movementDirection.y;
            sphere.position.z += sphere.userData.movementSpeed.z * sphere.userData.movementDirection.z;
            
            // Check boundaries and reverse direction if needed
            if (sphere.position.x <= sphere.userData.movementRange.x.min || 
                sphere.position.x >= sphere.userData.movementRange.x.max) {
                sphere.userData.movementDirection.x *= -1;
            }
            
            if (sphere.position.y <= sphere.userData.movementRange.y.min || 
                sphere.position.y >= sphere.userData.movementRange.y.max) {
                sphere.userData.movementDirection.y *= -1;
            }
            
            if (sphere.position.z <= sphere.userData.movementRange.z.min || 
                sphere.position.z >= sphere.userData.movementRange.z.max) {
                sphere.userData.movementDirection.z *= -1;
            }
            
            // Update shader uniforms
            sphere.material.uniforms.viewVector.value = camera.position;
        });
        
        // Update connecting lines
        lines.forEach(({ line, sphereA, sphereB }) => {
            const positions = line.geometry.attributes.position.array;
            
            positions[0] = sphereA.position.x;
            positions[1] = sphereA.position.y;
            positions[2] = sphereA.position.z;
            
            positions[3] = sphereB.position.x;
            positions[4] = sphereB.position.y;
            positions[5] = sphereB.position.z;
            
            line.geometry.attributes.position.needsUpdate = true;
        });
        
        // Mouse interaction
        raycaster.setFromCamera(mouse, camera);
        
        // Move camera slightly based on mouse position
        camera.position.x += (mouse.x * 5 - camera.position.x) * 0.01;
        camera.position.y += (mouse.y * 5 - camera.position.y) * 0.01;
        camera.lookAt(scene.position);
        
        // Render the scene
        renderer.render(scene, camera);
    }
    
    animate();
});