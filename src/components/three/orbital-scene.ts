/**
 * ORBITAL — Three.js Orbital Scene
 * Procedural 3D visualization inspired by the ORBITAL logo.
 * Features: orbital rings, particles, glowing node, slow rotation.
 * Lightweight, code-generated — no external 3D models.
 */

import * as THREE from 'three';

interface OrbitalSceneOptions {
  container: HTMLElement;
  theme: 'light' | 'dark';
}

export class OrbitalScene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private container: HTMLElement;
  private animationId: number = 0;
  private clock: THREE.Clock;
  private orbitGroup: THREE.Group;
  private particles: THREE.Points;
  private glowSphere: THREE.Mesh;
  private rings: THREE.Line[] = [];
  private isReduced: boolean;
  private isMobile: boolean;
  private resizeObserver: ResizeObserver;
  private disposed: boolean = false;

  // Color palette
  private colors = {
    dark: {
      primary: 0x3B8BEB,
      glow: 0x4DC9F6,
      ring: 0x2A6FC4,
      particle: 0x5DA8F5,
      bg: 0x0A0E17,
    },
    light: {
      primary: 0x1B3A5C,
      glow: 0x3B8BEB,
      ring: 0x5A7FA0,
      particle: 0x3B8BEB,
      bg: 0xFFFFFF,
    },
  };

  constructor(options: OrbitalSceneOptions) {
    this.container = options.container;
    this.isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isMobile = window.innerWidth < 768;
    this.clock = new THREE.Clock();

    // Setup scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      50,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, this.isMobile ? 7 : 5.5);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !this.isMobile,
      powerPreference: 'low-power',
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    // Create orbit group
    this.orbitGroup = new THREE.Group();
    this.scene.add(this.orbitGroup);

    // Build scene elements
    this.glowSphere = this.createGlowSphere(options.theme);
    this.createOrbitalRings(options.theme);
    this.particles = this.createParticles(options.theme);

    // Handle resize
    this.resizeObserver = new ResizeObserver(() => this.onResize());
    this.resizeObserver.observe(this.container);

    // Listen for theme changes
    window.addEventListener('theme-change', ((e: CustomEvent) => {
      this.updateTheme(e.detail.theme);
    }) as EventListener);

    // Start animation
    if (!this.isReduced) {
      this.animate();
    } else {
      // Render one static frame
      this.orbitGroup.rotation.x = 0.3;
      this.orbitGroup.rotation.y = 0.5;
      this.renderer.render(this.scene, this.camera);
    }
  }

  private createGlowSphere(theme: 'light' | 'dark'): THREE.Mesh {
    const colors = this.colors[theme];
    const geometry = new THREE.SphereGeometry(0.12, 16, 16);
    const material = new THREE.MeshBasicMaterial({
      color: colors.glow,
      transparent: true,
      opacity: 0.9,
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(1.8, 0, 0);

    // Outer glow
    const glowGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: colors.glow,
      transparent: true,
      opacity: 0.15,
    });
    const glowOuter = new THREE.Mesh(glowGeometry, glowMaterial);
    sphere.add(glowOuter);

    this.orbitGroup.add(sphere);
    return sphere;
  }

  private createOrbitalRings(theme: 'light' | 'dark'): void {
    const colors = this.colors[theme];
    const ringConfigs = [
      { radius: 1.8, tilt: { x: 0.4, z: 0.3 }, opacity: 0.6 },
      { radius: 2.2, tilt: { x: -0.2, z: -0.5 }, opacity: 0.3 },
      { radius: 2.6, tilt: { x: 0.6, z: 0.1 }, opacity: 0.15 },
    ];

    // Reduce rings on mobile
    const ringsToCreate = this.isMobile ? ringConfigs.slice(0, 2) : ringConfigs;

    ringsToCreate.forEach((config) => {
      const points: THREE.Vector3[] = [];
      const segments = this.isMobile ? 64 : 128;
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        points.push(
          new THREE.Vector3(
            Math.cos(angle) * config.radius,
            Math.sin(angle) * config.radius * 0.08,
            Math.sin(angle) * config.radius
          )
        );
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: colors.ring,
        transparent: true,
        opacity: config.opacity,
      });

      const ring = new THREE.Line(geometry, material);
      ring.rotation.x = config.tilt.x;
      ring.rotation.z = config.tilt.z;
      this.orbitGroup.add(ring);
      this.rings.push(ring);
    });
  }

  private createParticles(theme: 'light' | 'dark'): THREE.Points {
    const colors = this.colors[theme];
    const count = this.isMobile ? 80 : 200;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Distribute in a spherical shell
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 2.5 + Math.random() * 2.5;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      sizes[i] = Math.random() * 2 + 0.5;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      color: colors.particle,
      size: 0.03,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    this.scene.add(points);
    return points;
  }

  private animate = (): void => {
    if (this.disposed) return;
    this.animationId = requestAnimationFrame(this.animate);

    const elapsed = this.clock.getElapsedTime();

    // Slow orbital rotation
    this.orbitGroup.rotation.y = elapsed * 0.15;
    this.orbitGroup.rotation.x = Math.sin(elapsed * 0.1) * 0.15 + 0.3;

    // Glow sphere constant scale (no pulsing)
    if (this.glowSphere) {
      this.glowSphere.scale.setScalar(1.0);
    }

    // Subtle particle drift
    if (this.particles) {
      this.particles.rotation.y = elapsed * 0.03;
      this.particles.rotation.x = elapsed * 0.02;
    }

    // Ring subtle animation
    this.rings.forEach((ring, i) => {
      ring.rotation.y = elapsed * (0.05 + i * 0.02);
    });

    this.renderer.render(this.scene, this.camera);
  };

  private onResize(): void {
    if (this.disposed) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  updateTheme(theme: 'light' | 'dark'): void {
    const colors = this.colors[theme];

    // Update glow sphere
    (this.glowSphere.material as THREE.MeshBasicMaterial).color.setHex(colors.glow);
    const glowChild = this.glowSphere.children[0] as THREE.Mesh;
    if (glowChild) {
      (glowChild.material as THREE.MeshBasicMaterial).color.setHex(colors.glow);
    }

    // Update rings
    this.rings.forEach((ring) => {
      (ring.material as THREE.LineBasicMaterial).color.setHex(colors.ring);
    });

    // Update particles
    (this.particles.material as THREE.PointsMaterial).color.setHex(colors.particle);
  }

  /** Apply scroll-based parallax offset */
  applyScroll(scrollY: number, containerTop: number, viewportHeight: number): void {
    if (this.isReduced || this.disposed) return;
    const progress = (scrollY - containerTop + viewportHeight) / (viewportHeight * 2);
    const clamped = Math.max(0, Math.min(1, progress));
    this.orbitGroup.position.y = (clamped - 0.5) * 0.5;
  }

  dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.animationId);
    this.resizeObserver.disconnect();

    // Cleanup Three.js
    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.Line || obj instanceof THREE.Points) {
        obj.geometry?.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material?.dispose();
        }
      }
    });

    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
