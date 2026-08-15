/**
 * ORBITAL — Starfield Creator
 * Generates a procedural 3D starry sky using Points & BufferGeometry.
 */
import * as THREE from 'three';
import { THREE_CONFIG } from './config';

export function createStarfield(count: number, theme: 'light' | 'dark'): THREE.Points {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const opacities = new Float32Array(count);

  const radius = THREE_CONFIG.dimensions.starfieldRadius;

  for (let i = 0; i < count; i++) {
    // Distribute randomly in 3D sphere shell
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = radius * Math.cbrt(Math.random());

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);

    // Varied star size and opacity for realistic depth
    sizes[i] = Math.random() * 1.5 + 0.5;
    opacities[i] = Math.random() * 0.6 + 0.2;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const colors = THREE_CONFIG.colors[theme];
  const material = new THREE.PointsMaterial({
    color: colors.stars,
    size: 0.04,
    transparent: true,
    opacity: 0.75,
    sizeAttenuation: true,
    depthWrite: false,
  });

  const starfield = new THREE.Points(geometry, material);
  starfield.name = 'starfield';
  return starfield;
}
