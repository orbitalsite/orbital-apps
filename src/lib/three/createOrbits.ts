/**
 * ORBITAL — Orbit Rings Creator
 * Builds 3 multi-colored orbital rings with distinct hues & alternating solid/dashed styles
 * to match the ORBITAL brand emblem and create a premium tech feel.
 */
import * as THREE from 'three';
import { THREE_CONFIG } from './config';

export function createOrbits(theme: 'light' | 'dark'): THREE.Group {
  const orbitsGroup = new THREE.Group();
  orbitsGroup.name = 'orbitsGroup';

  const colors = THREE_CONFIG.colors[theme];
  const ringConfigs = THREE_CONFIG.dimensions.orbitRings;

  ringConfigs.forEach((cfg, index) => {
    const segments = 200;
    const points: THREE.Vector3[] = [];

    // Distinct color per orbit ring
    const hexColor = theme === 'dark' 
      ? (cfg.colorDark || colors.orbits) 
      : (cfg.colorLight || colors.orbits);

    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      points.push(
        new THREE.Vector3(
          Math.cos(angle) * cfg.radius,
          Math.sin(angle) * cfg.radius * 0.05,
          Math.sin(angle) * cfg.radius
        )
      );
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    let line: THREE.Line;

    if (index % 2 === 1) {
      // Odd rings: dashed for visual variety
      const material = new THREE.LineDashedMaterial({
        color: hexColor,
        transparent: true,
        opacity: cfg.opacity,
        dashSize: 0.18,
        gapSize: 0.08,
      });
      line = new THREE.Line(geometry, material);
      line.computeLineDistances();
    } else {
      // Even rings: solid
      const material = new THREE.LineBasicMaterial({
        color: hexColor,
        transparent: true,
        opacity: cfg.opacity,
      });
      line = new THREE.Line(geometry, material);
    }

    line.name = `orbitRing_${index}`;
    line.rotation.x = cfg.tiltX;
    line.rotation.z = cfg.tiltZ;

    orbitsGroup.add(line);
  });

  return orbitsGroup;
}
