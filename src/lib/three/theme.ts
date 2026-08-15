/**
 * ORBITAL — 3D Theme Manager
 * Smoothly transitions all materials between Dark and Light themes via GSAP.
 * Supports: starfield, planet core, atmosphere layers, orbits, nodes, connection lines, grid.
 */
import * as THREE from 'three';
import { gsap } from 'gsap';
import { THREE_CONFIG } from './config';

export function applyThemeToScene(scene: THREE.Scene, theme: 'light' | 'dark', duration: number = 0.6): void {
  const colors = THREE_CONFIG.colors[theme];

  // 1. Starfield
  const starfield = scene.getObjectByName('starfield') as THREE.Points;
  if (starfield && starfield.material) {
    const mat = starfield.material as THREE.PointsMaterial;
    const targetColor = new THREE.Color(colors.stars);
    gsap.to(mat.color, {
      r: targetColor.r,
      g: targetColor.g,
      b: targetColor.b,
      duration,
      ease: 'power2.out',
    });
  }

  // 2. Planet Inner Core
  const innerCore = scene.getObjectByName('innerPlanetCore') as THREE.Points;
  if (innerCore && innerCore.material) {
    const mat = innerCore.material as THREE.PointsMaterial;
    const targetColor = new THREE.Color(colors.planetInnerCore);
    gsap.to(mat.color, {
      r: targetColor.r,
      g: targetColor.g,
      b: targetColor.b,
      duration,
      ease: 'power2.out',
    });
  }

  // 3. Planet Grid
  const planetGrid = scene.getObjectByName('planetGrid') as THREE.LineSegments;
  if (planetGrid && planetGrid.material) {
    const mat = planetGrid.material as THREE.LineBasicMaterial;
    const targetColor = new THREE.Color(colors.gridLines);
    gsap.to(mat.color, {
      r: targetColor.r,
      g: targetColor.g,
      b: targetColor.b,
      duration,
      ease: 'power2.out',
    });
  }

  // 4. Atmosphere Outer Glow
  const atmosphereGlow = scene.getObjectByName('atmosphereGlow') as THREE.Mesh;
  if (atmosphereGlow && atmosphereGlow.material) {
    const mat = atmosphereGlow.material as THREE.MeshBasicMaterial;
    const targetColor = new THREE.Color(colors.atmosphereGlow);
    gsap.to(mat.color, {
      r: targetColor.r,
      g: targetColor.g,
      b: targetColor.b,
      duration,
      ease: 'power2.out',
    });
    gsap.to(mat, {
      opacity: theme === 'dark' ? 0.16 : 0.22,
      duration,
      ease: 'power2.out',
    });
  }

  // 5. Atmosphere Inner
  const atmosphereInner = scene.getObjectByName('atmosphereInner') as THREE.Mesh;
  if (atmosphereInner && atmosphereInner.material) {
    const mat = atmosphereInner.material as THREE.MeshBasicMaterial;
    const targetColor = new THREE.Color(colors.pulseGlow);
    gsap.to(mat.color, {
      r: targetColor.r,
      g: targetColor.g,
      b: targetColor.b,
      duration,
      ease: 'power2.out',
    });
    gsap.to(mat, {
      opacity: theme === 'dark' ? 0.1 : 0.12,
      duration,
      ease: 'power2.out',
    });
  }

  // 6. Equator Glow
  const equatorGlow = scene.getObjectByName('equatorGlow') as THREE.Mesh;
  if (equatorGlow && equatorGlow.material) {
    const mat = equatorGlow.material as THREE.MeshBasicMaterial;
    const targetColor = new THREE.Color(colors.atmosphereGlow);
    gsap.to(mat.color, {
      r: targetColor.r,
      g: targetColor.g,
      b: targetColor.b,
      duration,
      ease: 'power2.out',
    });
  }

  // 7. Orbit Rings (Multi-color support)
  const orbitsGroup = scene.getObjectByName('orbitsGroup') as THREE.Group;
  if (orbitsGroup) {
    const ringConfigs = THREE_CONFIG.dimensions.orbitRings;
    orbitsGroup.children.forEach((child, index) => {
      if (child instanceof THREE.Line) {
        const cfg = ringConfigs[index];
        const hexColor = cfg 
          ? (theme === 'dark' ? cfg.colorDark : cfg.colorLight) 
          : colors.orbits;
        const targetColor = new THREE.Color(hexColor);
        const mat = child.material as THREE.LineBasicMaterial;
        gsap.to(mat.color, {
          r: targetColor.r,
          g: targetColor.g,
          b: targetColor.b,
          duration,
          ease: 'power2.out',
        });
      }
    });
  }

  // 8. Data Nodes (Multi-color individual node balls support)
  const nodesGroup = scene.getObjectByName('dataNodesGroup') as THREE.Group;
  if (nodesGroup) {
    const nodePalette = THREE_CONFIG.nodeColors;

    nodesGroup.children.forEach((nodeContainer, index) => {
      if (nodeContainer instanceof THREE.Group) {
        const colorItem = nodePalette[index % nodePalette.length];
        const hexColor = theme === 'dark' ? colorItem.dark : colorItem.light;
        const targetColor = new THREE.Color(hexColor);

        // Core (child[0])
        const coreMesh = nodeContainer.children[0] as THREE.Mesh;
        if (coreMesh && coreMesh.material) {
          gsap.to((coreMesh.material as THREE.MeshBasicMaterial).color, {
            r: targetColor.r,
            g: targetColor.g,
            b: targetColor.b,
            duration,
            ease: 'power2.out',
          });
        }

        // Halo (child[1])
        const haloMesh = nodeContainer.children[1] as THREE.Mesh;
        if (haloMesh && haloMesh.material) {
          gsap.to((haloMesh.material as THREE.MeshBasicMaterial).color, {
            r: targetColor.r,
            g: targetColor.g,
            b: targetColor.b,
            duration,
            ease: 'power2.out',
          });
        }

        // Pulse ring (child[2])
        const ringMesh = nodeContainer.children[2] as THREE.Mesh;
        if (ringMesh && ringMesh.material) {
          gsap.to((ringMesh.material as THREE.MeshBasicMaterial).color, {
            r: targetColor.r,
            g: targetColor.g,
            b: targetColor.b,
            duration,
            ease: 'power2.out',
          });
        }
      }
    });
  }

  // 9. Connection Lines
  const connectionLines = scene.getObjectByName('connectionLines') as THREE.LineSegments;
  if (connectionLines && connectionLines.material) {
    const mat = connectionLines.material as THREE.LineBasicMaterial;
    const targetColor = new THREE.Color(colors.connectionLines);
    gsap.to(mat.color, {
      r: targetColor.r,
      g: targetColor.g,
      b: targetColor.b,
      duration,
      ease: 'power2.out',
    });
  }
}
