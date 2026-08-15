/**
 * ORBITAL — Layered Atmosphere Glow Creator
 * Multi-layer atmospheric glow with outer halo, inner glow, and equatorial ring.
 */
import * as THREE from 'three';
import { THREE_CONFIG } from './config';

export function createAtmosphere(theme: 'light' | 'dark'): THREE.Group {
  const atmosphereGroup = new THREE.Group();
  atmosphereGroup.name = 'atmosphereGroup';

  const radius = THREE_CONFIG.dimensions.planetRadius;
  const colors = THREE_CONFIG.colors[theme];

  // Layer 1: Outer atmosphere shell
  const outerGeo = new THREE.SphereGeometry(radius * 1.15, 32, 32);
  const outerMat = new THREE.MeshBasicMaterial({
    color: colors.atmosphereGlow,
    transparent: true,
    opacity: theme === 'dark' ? 0.16 : 0.22,
    side: THREE.BackSide,
    depthWrite: false,
  });
  const outerAtmo = new THREE.Mesh(outerGeo, outerMat);
  outerAtmo.name = 'atmosphereGlow';
  atmosphereGroup.add(outerAtmo);

  // Layer 2: Inner glow layer (tighter, slightly brighter)
  const innerGeo = new THREE.SphereGeometry(radius * 1.06, 32, 32);
  const innerMat = new THREE.MeshBasicMaterial({
    color: colors.pulseGlow,
    transparent: true,
    opacity: theme === 'dark' ? 0.1 : 0.12,
    side: THREE.BackSide,
    depthWrite: false,
  });
  const innerAtmo = new THREE.Mesh(innerGeo, innerMat);
  innerAtmo.name = 'atmosphereInner';
  atmosphereGroup.add(innerAtmo);

  // Layer 3: Equatorial glow ring
  const torusGeo = new THREE.TorusGeometry(radius * 1.22, 0.02, 8, 64);
  const torusMat = new THREE.MeshBasicMaterial({
    color: colors.atmosphereGlow,
    transparent: true,
    opacity: 0.1,
    depthWrite: false,
  });
  const equatorRing = new THREE.Mesh(torusGeo, torusMat);
  equatorRing.name = 'equatorGlow';
  equatorRing.rotation.x = Math.PI / 2;
  atmosphereGroup.add(equatorRing);

  return atmosphereGroup;
}
