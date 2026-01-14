/**
 * Interactive Bloch Sphere Navigation
 * 
 * A realistic 3D Bloch sphere visualization following standard conventions:
 * - Z-axis: |0⟩ (north) and |1⟩ (south) - computational basis
 * - X-axis: |+⟩ and |-⟩ - superposition states
 * - Y-axis: |+i⟩ and |-i⟩ - phase states
 * 
 * Features:
 * - Animated state vector (precession around Z-axis)
 * - 3D labels that rotate with the sphere (using Sprites)
 * - Career superposition metaphor
 * 
 * Performance optimized for mobile/tablet
 */

(function() {
  'use strict';

  // CONFIGURATION
  const CONFIG = {
    sphereRadius: 1.2,
    sphereSegments: 32,
    wireframeOpacity: 0.15,
    autoRotateSpeed: 0.003,
    maxFPS: 30,
    // State vector animation
    stateAnimation: {
      thetaBase: Math.PI / 4,     // Base polar angle (45° from |0⟩)
      thetaAmplitude: Math.PI / 6, // Oscillate ±30° up/down
      thetaSpeed: 0.002,           // Theta oscillation speed
      phiSpeed: 0.003,             // Precession speed around Z-axis
      phiAmplitude: Math.PI * 2    // Full rotation
    },
    colors: {
      sphere: 0x6366f1,
      wireframe: 0x818cf8,
      xAxis: 0xef4444,
      yAxis: 0x22c55e,
      zAxis: 0x3b82f6,
      stateVector: 0xfbbf24,
      equator: 0x64748b,
      hotspot: 0xf97316
    },
    hotspots: [
      { name: '|0⟩ Classical', theta: 0, phi: 0, section: '/industry/', color: 0x3b82f6, description: 'Classical ML, Computer Vision, Industry' },
      { name: '|1⟩ Quantum', theta: Math.PI, phi: 0, section: '/research/', color: 0x8b5cf6, description: 'Quantum Computing, Photonics, Research' },
      { name: '|+⟩ QML', theta: Math.PI/2, phi: 0, section: '/research/', color: 0x10b981, description: 'Quantum Machine Learning - The Bridge' },
      { name: '|-⟩ Skills', theta: Math.PI/2, phi: Math.PI, section: '/skills/', color: 0xef4444, description: 'Technical Skills & Expertise' },
      { name: '|+i⟩ Projects', theta: Math.PI/2, phi: Math.PI/2, section: '/#projects', color: 0x22c55e, description: 'Software & Research Projects' },
      { name: '|-i⟩ Papers', theta: Math.PI/2, phi: -Math.PI/2, section: '/publications/', color: 0xf59e0b, description: 'Publications & Papers' }
    ],
    // 3D Labels that rotate with sphere
    axisLabels: [
      { text: '|0⟩', pos: [0, 1.6, 0], color: '#3b82f6', size: 0.35 },
      { text: '|1⟩', pos: [0, -1.6, 0], color: '#8b5cf6', size: 0.35 },
      { text: '|+⟩', pos: [1.6, 0, 0], color: '#ef4444', size: 0.30 },
      { text: '|−⟩', pos: [-1.6, 0, 0], color: '#ef4444', size: 0.30 },
      { text: '|+i⟩', pos: [0, 0, 1.6], color: '#22c55e', size: 0.28 },
      { text: '|−i⟩', pos: [0, 0, -1.6], color: '#22c55e', size: 0.28 },
      { text: 'X', pos: [1.9, 0, 0], color: '#ef4444', size: 0.25 },
      { text: 'Y', pos: [0, 0, 1.9], color: '#22c55e', size: 0.25 },
      { text: 'Z', pos: [0, 1.9, 0], color: '#3b82f6', size: 0.25 }
    ]
  };

  // State variables
  let scene, camera, renderer, sphereGroup, stateArrowGroup, stateGlowPoint;
  let hotspotMeshes = [];
  let labelSprites = [];
  let isVisible = true;
  let animationId = null;
  let lastFrameTime = 0;
  let animationTime = 0;
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let rotationVelocity = { x: 0, y: 0 };
  let hoveredHotspot = null;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // INITIALIZATION
  function init() {
    const container = document.getElementById('bloch-sphere-container');
    if (!container) return;

    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      showFallback(container);
      return;
    }

    const width = container.clientWidth;
    const height = container.clientHeight || 400;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(2.8, 1.8, 2.8);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'low-power'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Main sphere group for rotation
    sphereGroup = new THREE.Group();
    scene.add(sphereGroup);

    // Separate group for state arrow (animates independently)
    stateArrowGroup = new THREE.Group();
    sphereGroup.add(stateArrowGroup);

    createBlochSphere();
    createAxes();
    create3DLabels();
    createStateVector();
    createHotspots();
    createTooltip(container);

    setupEventListeners(container);
    setupVisibilityObserver(container);

    if (!prefersReducedMotion) {
      animate();
    } else {
      renderer.render(scene, camera);
    }
  }

  // SPHERE CREATION
  function createBlochSphere() {
    const radius = CONFIG.sphereRadius;

    // Semi-transparent sphere
    const sphereGeometry = new THREE.SphereGeometry(radius, CONFIG.sphereSegments, CONFIG.sphereSegments);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: CONFIG.colors.sphere,
      transparent: true,
      opacity: 0.06,
      side: THREE.DoubleSide
    });
    sphereGroup.add(new THREE.Mesh(sphereGeometry, sphereMaterial));

    // Wireframe overlay
    const wireframeGeometry = new THREE.SphereGeometry(radius, 16, 12);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: CONFIG.colors.wireframe,
      wireframe: true,
      transparent: true,
      opacity: CONFIG.wireframeOpacity
    });
    sphereGroup.add(new THREE.Mesh(wireframeGeometry, wireframeMaterial));

    // Equator circle
    const equatorGeometry = new THREE.TorusGeometry(radius, 0.008, 8, 64);
    const equatorMaterial = new THREE.MeshBasicMaterial({ 
      color: CONFIG.colors.equator,
      transparent: true,
      opacity: 0.6
    });
    const equator = new THREE.Mesh(equatorGeometry, equatorMaterial);
    equator.rotation.x = Math.PI / 2;
    sphereGroup.add(equator);

    // Meridian circles
    const meridianMaterial = new THREE.MeshBasicMaterial({ 
      color: CONFIG.colors.equator,
      transparent: true,
      opacity: 0.3
    });

    const meridianXZ = new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.005, 8, 64),
      meridianMaterial
    );
    sphereGroup.add(meridianXZ);

    const meridianYZ = new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.005, 8, 64),
      meridianMaterial
    );
    meridianYZ.rotation.y = Math.PI / 2;
    sphereGroup.add(meridianYZ);
  }

  // COORDINATE AXES
  function createAxes() {
    const axisLength = CONFIG.sphereRadius * 1.4;
    const arrowHeadLength = 0.12;
    const arrowHeadRadius = 0.04;

    // X Axis (Red)
    createAxis(new THREE.Vector3(1, 0, 0), axisLength, CONFIG.colors.xAxis, arrowHeadLength, arrowHeadRadius);
    // Y Axis (Green) - maps to Z in Three.js coords
    createAxis(new THREE.Vector3(0, 0, 1), axisLength, CONFIG.colors.yAxis, arrowHeadLength, arrowHeadRadius);
    // Z Axis (Blue) - maps to Y in Three.js coords
    createAxis(new THREE.Vector3(0, 1, 0), axisLength, CONFIG.colors.zAxis, arrowHeadLength, arrowHeadRadius);
  }

  function createAxis(direction, length, color, headLength, headRadius) {
    const arrowPos = new THREE.ArrowHelper(
      direction,
      new THREE.Vector3(0, 0, 0),
      length,
      color,
      headLength,
      headRadius
    );
    sphereGroup.add(arrowPos);

    const negDir = direction.clone().negate();
    const points = [
      new THREE.Vector3(0, 0, 0),
      negDir.clone().multiplyScalar(length * 0.85)
    ];
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const lineMaterial = new THREE.LineDashedMaterial({
      color: color,
      dashSize: 0.05,
      gapSize: 0.03,
      transparent: true,
      opacity: 0.5
    });
    const line = new THREE.Line(lineGeometry, lineMaterial);
    line.computeLineDistances();
    sphereGroup.add(line);
  }

  // 3D LABELS (SPRITES) - Rotate with sphere
  function create3DLabels() {
    labelSprites = [];
    
    CONFIG.axisLabels.forEach(labelConfig => {
      const sprite = createTextSprite(labelConfig.text, labelConfig.color, labelConfig.size);
      sprite.position.set(labelConfig.pos[0], labelConfig.pos[1], labelConfig.pos[2]);
      sphereGroup.add(sprite);
      labelSprites.push(sprite);
    });
  }

  function createTextSprite(text, color, size) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 128;
    canvas.height = 64;

    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Text styling
    context.font = 'bold 40px "Times New Roman", serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // Text shadow for depth
    context.shadowColor = 'rgba(0,0,0,0.8)';
    context.shadowBlur = 4;
    context.shadowOffsetX = 2;
    context.shadowOffsetY = 2;

    // Draw text
    context.fillStyle = color;
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    // Create sprite
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false
    });

    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(size * 2, size, 1);

    return sprite;
  }

  // ANIMATED STATE VECTOR
  function createStateVector() {
    // Initial position
    updateStateVectorPosition(0);
  }

  function updateStateVectorPosition(time) {
    // Remove old state arrow and glow
    if (stateArrowGroup.children.length > 0) {
      while(stateArrowGroup.children.length > 0) {
        stateArrowGroup.remove(stateArrowGroup.children[0]);
      }
    }

    // Theta oscillates up and down, phi rotates around Z
    const thetaBase = CONFIG.stateAnimation.thetaBase;
    const thetaOsc = CONFIG.stateAnimation.thetaAmplitude * Math.sin(time * CONFIG.stateAnimation.thetaSpeed);
    const theta = thetaBase + thetaOsc;
    const phi = (time * CONFIG.stateAnimation.phiSpeed) % CONFIG.stateAnimation.phiAmplitude;
    
    const r = CONFIG.sphereRadius * 0.95;
    const x = r * Math.sin(theta) * Math.cos(phi);
    const z = r * Math.sin(theta) * Math.sin(phi);
    const y = r * Math.cos(theta);

    const direction = new THREE.Vector3(x, y, z).normalize();
    
    // State arrow
    const arrow = new THREE.ArrowHelper(
      direction,
      new THREE.Vector3(0, 0, 0),
      r,
      CONFIG.colors.stateVector,
      0.12,
      0.06
    );
    stateArrowGroup.add(arrow);

    // Glowing point at tip
    const glowGeometry = new THREE.SphereGeometry(0.07, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: CONFIG.colors.stateVector,
      transparent: true,
      opacity: 0.9
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.set(x, y, z);
    stateArrowGroup.add(glow);

    // Outer glow ring
    const ringGeometry = new THREE.TorusGeometry(0.09, 0.02, 8, 24);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: CONFIG.colors.stateVector,
      transparent: true,
      opacity: 0.4
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.set(x, y, z);
    ring.lookAt(0, 0, 0);
    stateArrowGroup.add(ring);

    // State label sprite
    const stateSprite = createTextSprite('|ψ⟩', '#fbbf24', 0.15);
    stateSprite.position.set(x * 1.25, y * 1.25, z * 1.25);
    stateArrowGroup.add(stateSprite);
  }

  // HOTSPOTS
  function createHotspots() {
    hotspotMeshes = [];
    
    CONFIG.hotspots.forEach((hotspot) => {
      const r = CONFIG.sphereRadius;
      const x = r * Math.sin(hotspot.theta) * Math.cos(hotspot.phi);
      const z = r * Math.sin(hotspot.theta) * Math.sin(hotspot.phi);
      const y = r * Math.cos(hotspot.theta);

      const geometry = new THREE.SphereGeometry(0.08, 12, 12);
      const material = new THREE.MeshBasicMaterial({
        color: hotspot.color,
        transparent: true,
        opacity: 0.85
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      mesh.userData = { hotspot: hotspot };
      sphereGroup.add(mesh);
      hotspotMeshes.push(mesh);

      // Outer ring
      const ringGeometry = new THREE.TorusGeometry(0.1, 0.015, 8, 24);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: hotspot.color,
        transparent: true,
        opacity: 0.5
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.set(x, y, z);
      ring.lookAt(0, 0, 0);
      sphereGroup.add(ring);
    });
  }

  function createTooltip(container) {
    const tooltip = document.createElement('div');
    tooltip.id = 'bloch-tooltip';
    tooltip.style.cssText = `
      position: absolute;
      padding: 10px 16px;
      background: rgba(15, 23, 42, 0.95);
      color: white;
      border-radius: 10px;
      font-size: 13px;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s;
      max-width: 220px;
      text-align: center;
      z-index: 20;
      border: 1px solid rgba(255,255,255,0.1);
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      font-family: system-ui, sans-serif;
    `;
    container.appendChild(tooltip);
  }

  // EVENT HANDLERS
  function setupEventListeners(container) {
    const canvas = renderer.domElement;

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });

    window.addEventListener('mousemove', throttle(onMouseMove, 16));
    window.addEventListener('touchmove', throttle(onTouchMove, 16), { passive: true });

    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchend', onMouseUp);

    canvas.addEventListener('click', onClick);
    window.addEventListener('resize', throttle(onResize, 200));

    container.setAttribute('tabindex', '0');
    container.addEventListener('keydown', onKeyDown);
  }

  function setupVisibilityObserver(container) {
    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
      if (isVisible && !animationId && !prefersReducedMotion) {
        animate();
      }
    }, { threshold: 0.1 });
    
    observer.observe(container);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) isVisible = false;
    });
  }

  // ANIMATION LOOP
  function animate() {
    if (!isVisible) {
      animationId = null;
      return;
    }

    animationId = requestAnimationFrame(animate);

    const now = performance.now();
    const elapsed = now - lastFrameTime;
    if (elapsed < 1000 / CONFIG.maxFPS) return;
    lastFrameTime = now;
    animationTime += elapsed;

    // Apply velocity with damping
    if (!isDragging) {
      rotationVelocity.x *= 0.95;
      rotationVelocity.y *= 0.95;
      
      if (Math.abs(rotationVelocity.y) < 0.001) {
        rotationVelocity.y = CONFIG.autoRotateSpeed;
      }
    }

    sphereGroup.rotation.x += rotationVelocity.x;
    sphereGroup.rotation.y += rotationVelocity.y;
    sphereGroup.rotation.x = Math.max(-Math.PI/3, Math.min(Math.PI/3, sphereGroup.rotation.x));

    // Animate state vector (precession)
    updateStateVectorPosition(animationTime);

    // Make labels always face camera (billboarding)
    labelSprites.forEach(sprite => {
      sprite.quaternion.copy(camera.quaternion);
    });

    renderer.render(scene, camera);
  }

  // INPUT HANDLING
  function onMouseDown(e) {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
    rotationVelocity = { x: 0, y: 0 };
  }

  function onTouchStart(e) {
    if (e.touches.length === 1) {
      isDragging = true;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      rotationVelocity = { x: 0, y: 0 };
    }
  }

  function onMouseMove(e) {
    updateHover(e.clientX, e.clientY);
    if (!isDragging) return;

    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;

    rotationVelocity.y = deltaX * 0.005;
    rotationVelocity.x = deltaY * 0.005;

    previousMousePosition = { x: e.clientX, y: e.clientY };
  }

  function onTouchMove(e) {
    if (!isDragging || e.touches.length !== 1) return;

    const deltaX = e.touches[0].clientX - previousMousePosition.x;
    const deltaY = e.touches[0].clientY - previousMousePosition.y;

    rotationVelocity.y = deltaX * 0.005;
    rotationVelocity.x = deltaY * 0.005;

    previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }

  function onMouseUp() {
    isDragging = false;
  }

  function updateHover(clientX, clientY) {
    if (!renderer) return;
    
    const rect = renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(hotspotMeshes);

    const tooltip = document.getElementById('bloch-tooltip');
    if (!tooltip) return;

    if (intersects.length > 0) {
      const hotspot = intersects[0].object.userData.hotspot;
      hoveredHotspot = hotspot;

      tooltip.innerHTML = `
        <div style="font-weight: bold; font-size: 15px; margin-bottom: 4px; font-style: italic;">${hotspot.name}</div>
        <div style="opacity: 0.8;">${hotspot.description}</div>
        <div style="margin-top: 6px; font-size: 11px; opacity: 0.6;">Click to navigate →</div>
      `;
      tooltip.style.opacity = '1';
      tooltip.style.left = (clientX - rect.left + 15) + 'px';
      tooltip.style.top = (clientY - rect.top - 15) + 'px';

      renderer.domElement.style.cursor = 'pointer';
    } else {
      hoveredHotspot = null;
      tooltip.style.opacity = '0';
      renderer.domElement.style.cursor = 'grab';
    }
  }

  function onClick() {
    if (hoveredHotspot) {
      navigateTo(hoveredHotspot.section);
    }
  }

  function onKeyDown(e) {
    switch(e.key) {
      case 'ArrowLeft':
        rotationVelocity.y = -0.1;
        e.preventDefault();
        break;
      case 'ArrowRight':
        rotationVelocity.y = 0.1;
        e.preventDefault();
        break;
      case 'ArrowUp':
        rotationVelocity.x = -0.1;
        e.preventDefault();
        break;
      case 'ArrowDown':
        rotationVelocity.x = 0.1;
        e.preventDefault();
        break;
      case 'Enter':
        if (hoveredHotspot) navigateTo(hoveredHotspot.section);
        break;
    }
  }

  function onResize() {
    const container = document.getElementById('bloch-sphere-container');
    if (!container || !camera || !renderer) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 400;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function navigateTo(target) {
    if (target.startsWith('/') || target.startsWith('http')) {
      window.location.href = target;
    } else {
      const element = document.querySelector(target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, null, target);
      }
    }
  }


  function showFallback(container) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: white;">
        <div style="font-size: 48px; margin-bottom: 16px;">🔮</div>
        <p style="font-style: italic; margin-bottom: 24px;">|ψ⟩ = α|Classical⟩ + β|Quantum⟩</p>
        <div style="display: flex; justify-content: center; gap: 24px; flex-wrap: wrap;">
          <a href="#industry-experience" style="color: #3b82f6; text-decoration: none;">|0⟩ Classical</a>
          <span style="color: #888;">⟷</span>
          <a href="#experience" style="color: #8b5cf6; text-decoration: none;">|1⟩ Quantum</a>
        </div>
      </div>
    `;
  }

  // INITIALIZATION
  function waitForThreeJs(callback) {
    if (typeof THREE !== 'undefined') {
      callback();
    } else {
      setTimeout(() => waitForThreeJs(callback), 100);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => waitForThreeJs(init));
  } else {
    waitForThreeJs(init);
  }
})();
