/**
 * ORBITAL — Data Nodes Creator
 * Generates sleek glowing node spheres with pulsing halos positioned along orbital rings.
 * Data node balls are rendered smaller with alternating Sapphire Blue & Fiery Crimson Red hues.
 */
import * as THREE from 'three';
import { THREE_CONFIG } from './config';

export interface DataNodeObject {
  mesh: THREE.Group;
  orbitIndex: number;
  angle: number;
  speed: number;
}

export function createDataNodes(count: number, theme: 'light' | 'dark'): { group: THREE.Group; nodes: DataNodeObject[] } {
  const nodesGroup = new THREE.Group();
  nodesGroup.name = 'dataNodesGroup';

  const ringConfigs = THREE_CONFIG.dimensions.orbitRings;
  const nodePalette = THREE_CONFIG.nodeColors;
  const nodesData: DataNodeObject[] = [];

  for (let i = 0; i < count; i++) {
    const orbitIndex = i % ringConfigs.length;
    const ringCfg = ringConfigs[orbitIndex];

    // Alternating Sapphire Blue and Fiery Crimson Red node balls
    const colorItem = nodePalette[i % nodePalette.length];
    const nodeHexColor = theme === 'dark' ? colorItem.dark : colorItem.light;

    const nodeContainer = new THREE.Group();

    // Child[0]: Node core sphere (sleek smaller ball, 0.055 radius)
    const sphereGeo = new THREE.SphereGeometry(0.055, 16, 16);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: nodeHexColor,
      transparent: true,
      opacity: 0.95,
    });
    const core = new THREE.Mesh(sphereGeo, sphereMat);
    nodeContainer.add(core);

    // Child[1]: Node halo glow (proportional 0.12 radius)
    const haloGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const haloMat = new THREE.MeshBasicMaterial({
      color: nodeHexColor,
      transparent: true,
      opacity: 0.35,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    nodeContainer.add(halo);

    // Child[2]: Animated pulse ring
    const ringGeo = new THREE.RingGeometry(0.11, 0.14, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: nodeHexColor,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const pulseRing = new THREE.Mesh(ringGeo, ringMat);
    nodeContainer.add(pulseRing);

    const initialAngle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
    const speed = (0.002 + Math.random() * 0.002) * (i % 2 === 0 ? 1 : -1);

    // Initial position on ring
    const x = Math.cos(initialAngle) * ringCfg.radius;
    const y = Math.sin(initialAngle) * ringCfg.radius * 0.05;
    const z = Math.sin(initialAngle) * ringCfg.radius;

    const posVec = new THREE.Vector3(x, y, z);
    posVec.applyAxisAngle(new THREE.Vector3(1, 0, 0), ringCfg.tiltX);
    posVec.applyAxisAngle(new THREE.Vector3(0, 0, 1), ringCfg.tiltZ);

    nodeContainer.position.copy(posVec);
    nodesGroup.add(nodeContainer);

    nodesData.push({
      mesh: nodeContainer,
      orbitIndex,
      angle: initialAngle,
      speed,
    });
  }

  return { group: nodesGroup, nodes: nodesData };
}
