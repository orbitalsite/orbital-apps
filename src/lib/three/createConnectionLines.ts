/**
 * ORBITAL — Connection Lines Creator
 * Creates subtle animated connection lines between data nodes,
 * giving the scene a network/constellation software feel.
 */
import * as THREE from 'three';
import { THREE_CONFIG } from './config';

export function createConnectionLines(theme: 'light' | 'dark'): THREE.LineSegments {
  const colors = THREE_CONFIG.colors[theme];

  const maxConnections = 30;
  const positions = new Float32Array(maxConnections * 6);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setDrawRange(0, 0);

  const material = new THREE.LineBasicMaterial({
    color: colors.connectionLines,
    transparent: true,
    opacity: THREE_CONFIG.animation.connectionLineOpacity,
    depthWrite: false,
  });

  const lines = new THREE.LineSegments(geometry, material);
  lines.name = 'connectionLines';
  return lines;
}

/**
 * Update connection lines based on current node positions.
 * Draws lines between nodes that are within maxDistance of each other.
 */
export function updateConnectionLines(
  lines: THREE.LineSegments,
  nodePositions: THREE.Vector3[],
  maxDistance: number = 3.5
): void {
  const posAttr = lines.geometry.getAttribute('position') as THREE.BufferAttribute;
  const positions = posAttr.array as Float32Array;
  let vertexIndex = 0;
  let lineCount = 0;
  const maxLines = 30;

  for (let i = 0; i < nodePositions.length && lineCount < maxLines; i++) {
    for (let j = i + 1; j < nodePositions.length && lineCount < maxLines; j++) {
      const dist = nodePositions[i].distanceTo(nodePositions[j]);
      if (dist < maxDistance) {
        positions[vertexIndex++] = nodePositions[i].x;
        positions[vertexIndex++] = nodePositions[i].y;
        positions[vertexIndex++] = nodePositions[i].z;
        positions[vertexIndex++] = nodePositions[j].x;
        positions[vertexIndex++] = nodePositions[j].y;
        positions[vertexIndex++] = nodePositions[j].z;
        lineCount++;
      }
    }
  }

  posAttr.needsUpdate = true;
  lines.geometry.setDrawRange(0, lineCount * 2);
}
