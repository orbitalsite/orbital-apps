/**
 * ORBITAL — OrbitalScene Manager
 * Orchestrates the complete 3D scene lifecycle with:
 * - Point cloud planet with geodesic grid
 * - Layered atmosphere glow
 * - 5 orbit rings (solid + dashed)
 * - Animated data nodes with pulse rings
 * - Dynamic connection lines (neural network feel)
 * - Mouse parallax, breathing animation, theme transitions
 */
import * as THREE from 'three';
import { THREE_CONFIG } from './config';
import { getQualityTier, type QualityTier } from './responsive';
import { createStarfield } from './createStarfield';
import { createPointPlanet } from './createPointPlanet';
import { createAtmosphere } from './createAtmosphere';
import { createOrbits } from './createOrbits';
import { createDataNodes, type DataNodeObject } from './createDataNodes';
import { createConnectionLines, updateConnectionLines } from './createConnectionLines';
import { applyThemeToScene } from './theme';
import { disposeScene } from './disposeScene';

export interface OrbitalSceneManagerOptions {
  container: HTMLElement;
  theme: 'light' | 'dark';
}

export class OrbitalSceneManager {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;

  private starfield: THREE.Points;
  private planetGroup: THREE.Group;
  private atmosphereGroup: THREE.Group;
  private orbitsGroup: THREE.Group;
  private dataNodesGroup: THREE.Group;
  private dataNodesList: DataNodeObject[] = [];
  private connectionLines: THREE.LineSegments;

  private quality: QualityTier;
  private animationFrameId: number = 0;
  private clock: THREE.Clock;
  private isReducedMotion: boolean;
  private isDisposed: boolean = false;

  private mouse = { targetX: 0, targetY: 0, currentX: 0, currentY: 0 };
  private eventListeners: Array<{ target: EventTarget; type: string; listener: EventListenerOrEventListenerObject }> = [];

  constructor(options: OrbitalSceneManagerOptions) {
    this.container = options.container;
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.clock = new THREE.Clock();

    this.quality = getQualityTier(window.innerWidth);

    // 1. Scene
    this.scene = new THREE.Scene();

    // 2. Camera
    const aspect = this.container.clientWidth / this.container.clientHeight || 1;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    const cameraZ = this.quality.isMobile ? 8.2 : (this.quality.isTablet ? 7.2 : 6.5);
    this.camera.position.set(0, 0, cameraZ);

    // 3. Renderer (100% transparent background)
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !this.quality.isMobile,
      powerPreference: 'low-power',
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.quality.pixelRatioLimit));
    this.container.appendChild(this.renderer.domElement);

    // 4. Build scene elements
    this.starfield = createStarfield(this.quality.starCount, options.theme);
    this.scene.add(this.starfield);

    this.planetGroup = createPointPlanet(this.quality.planetPoints, options.theme);
    this.scene.add(this.planetGroup);

    this.atmosphereGroup = createAtmosphere(options.theme);
    this.scene.add(this.atmosphereGroup);

    this.orbitsGroup = createOrbits(options.theme);
    this.scene.add(this.orbitsGroup);

    const { group: nodesGrp, nodes: nodesList } = createDataNodes(this.quality.nodeCount, options.theme);
    this.dataNodesGroup = nodesGrp;
    this.dataNodesList = nodesList;
    this.scene.add(this.dataNodesGroup);

    this.connectionLines = createConnectionLines(options.theme);
    this.scene.add(this.connectionLines);

    // Position 3D core offset for desktop text balance
    this.updateSceneOffset();

    // 5. Setup listeners
    this.setupListeners();

    // 6. Start animation or static frame
    if (!this.isReducedMotion) {
      this.animate();
    } else {
      this.renderStaticFrame();
    }
  }

  private updateSceneOffset(): void {
    if (this.quality.isDesktop) {
      const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
      const offsetX = isRtl ? -1.1 : 1.1;
      this.planetGroup.position.x = offsetX;
      this.atmosphereGroup.position.x = offsetX;
      this.orbitsGroup.position.x = offsetX;
      this.dataNodesGroup.position.x = offsetX;
      this.connectionLines.position.x = offsetX;
    } else {
      this.planetGroup.position.x = 0;
      this.atmosphereGroup.position.x = 0;
      this.orbitsGroup.position.x = 0;
      this.dataNodesGroup.position.x = 0;
      this.connectionLines.position.x = 0;
    }
  }

  /** Check if WebGL is supported by browser */
  public static isWebGLSupported(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch {
      return false;
    }
  }

  private setupListeners(): void {
    // Mousemove parallax (Desktop only)
    if (this.quality.isDesktop && !this.isReducedMotion) {
      const onMouseMove = (e: Event) => {
        const mouseEvent = e as MouseEvent;
        this.mouse.targetX = (mouseEvent.clientX / window.innerWidth - 0.5) * 2;
        this.mouse.targetY = (mouseEvent.clientY / window.innerHeight - 0.5) * 2;
      };

      window.addEventListener('mousemove', onMouseMove, { passive: true });
      this.eventListeners.push({ target: window, type: 'mousemove', listener: onMouseMove });
    }

    // Theme change event
    const onThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ theme: 'light' | 'dark' }>;
      if (customEvent.detail && customEvent.detail.theme) {
        applyThemeToScene(this.scene, customEvent.detail.theme);
      }
    };

    window.addEventListener('theme-change', onThemeChange);
    this.eventListeners.push({ target: window, type: 'theme-change', listener: onThemeChange });

    // Resize listener
    const onResize = () => {
      if (this.isDisposed) return;
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;
      if (width === 0 || height === 0) return;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);

      this.quality = getQualityTier(window.innerWidth);
      const cameraZ = this.quality.isMobile ? 8.2 : (this.quality.isTablet ? 7.2 : 6.5);
      this.camera.position.set(0, 0, cameraZ);
      this.updateSceneOffset();
    };

    window.addEventListener('resize', onResize, { passive: true });
    this.eventListeners.push({ target: window, type: 'resize', listener: onResize });
  }

  private animate = (): void => {
    if (this.isDisposed) return;
    this.animationFrameId = requestAnimationFrame(this.animate);

    const elapsed = this.clock.getElapsedTime();
    const { animation } = THREE_CONFIG;

    // 1. Planet rotation
    this.planetGroup.rotation.y += THREE_CONFIG.speeds.planetRotationY;
    this.planetGroup.rotation.x += THREE_CONFIG.speeds.planetRotationX;

    // 2. Constant scale (steady 3D globe, no forward/backward pulsing)
    this.planetGroup.scale.setScalar(1.0);
    this.atmosphereGroup.scale.setScalar(1.0);

    // 3. Starfield rotation
    this.starfield.rotation.y += THREE_CONFIG.speeds.starfieldRotationY;

    // 4. Orbits slow tilt oscillation
    this.orbitsGroup.rotation.y = Math.sin(elapsed * 0.2) * 0.1;
    this.orbitsGroup.rotation.x = Math.cos(elapsed * 0.15) * 0.08;

    // 5. Data nodes animation along orbits + pulse effects
    const ringConfigs = THREE_CONFIG.dimensions.orbitRings;
    const nodeWorldPositions: THREE.Vector3[] = [];

    this.dataNodesList.forEach((node, idx) => {
      node.angle += node.speed;
      const ringCfg = ringConfigs[node.orbitIndex];

      const x = Math.cos(node.angle) * ringCfg.radius;
      const y = Math.sin(node.angle) * ringCfg.radius * 0.05;
      const z = Math.sin(node.angle) * ringCfg.radius;

      const posVec = new THREE.Vector3(x, y, z);
      posVec.applyAxisAngle(new THREE.Vector3(1, 0, 0), ringCfg.tiltX);
      posVec.applyAxisAngle(new THREE.Vector3(0, 0, 1), ringCfg.tiltZ);

      node.mesh.position.copy(posVec);
      nodeWorldPositions.push(posVec.clone());

      // Halo pulse (child[1])
      const halo = node.mesh.children[1];
      if (halo) {
        const pulseScale = 1 + Math.sin(elapsed * animation.nodePulseSpeed + idx * 0.7) * animation.nodePulseAmplitude;
        halo.scale.setScalar(pulseScale);
      }

      // Pulse ring rotation (child[2])
      const ring = node.mesh.children[2];
      if (ring) {
        ring.rotation.z += 0.015;
        ring.rotation.x = Math.sin(elapsed * 1.5 + idx) * 0.3;
      }
    });

    // 6. Update connection lines between nearby nodes
    updateConnectionLines(this.connectionLines, nodeWorldPositions);

    // 7. Mouse parallax (smooth interpolation)
    if (this.quality.isDesktop) {
      this.mouse.currentX += (this.mouse.targetX - this.mouse.currentX) * THREE_CONFIG.parallax.ease;
      this.mouse.currentY += (this.mouse.targetY - this.mouse.currentY) * THREE_CONFIG.parallax.ease;

      this.scene.rotation.y = this.mouse.currentX * THREE_CONFIG.parallax.factorX;
      this.scene.rotation.x = -this.mouse.currentY * THREE_CONFIG.parallax.factorY;
    }

    this.renderer.render(this.scene, this.camera);
  };

  private renderStaticFrame(): void {
    this.planetGroup.rotation.y = 0.3;
    this.planetGroup.rotation.x = 0.2;
    this.renderer.render(this.scene, this.camera);
  }

  public dispose(): void {
    this.isDisposed = true;
    cancelAnimationFrame(this.animationFrameId);
    disposeScene(this.scene, this.renderer, this.eventListeners);
  }
}
