/**
 * ORBITAL — Digital Point Cloud Planet Creator
 * Generates a spherical data point cloud with Fibonacci Sphere algorithm
 * and a wireframe geodesic grid overlay for a premium tech feel.
 */
import * as THREE from 'three';
import { THREE_CONFIG } from './config';

export function createPointPlanet(pointCount: number, theme: 'light' | 'dark'): THREE.Group {
  const planetGroup = new THREE.Group();
  planetGroup.name = 'pointPlanetGroup';

  const radius = THREE_CONFIG.dimensions.planetRadius;
  const colors = THREE_CONFIG.colors[theme];

  // ── 1. Outer Fibonacci Sphere Shell ──
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(pointCount * 3);
  const colorsArray = new Float32Array(pointCount * 3);
  const sizes = new Float32Array(pointCount);

  const primaryColor = new THREE.Color(colors.planetPoints);
  const coreColor = new THREE.Color(colors.planetInnerCore);

  const phi = (1 + Math.sqrt(5)) / 2;

  for (let i = 0; i < pointCount; i++) {
    const iNormalized = i / pointCount;
    const y = 1 - iNormalized * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = 2 * Math.PI * i / phi;

    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;

    const perturbation = 1.0 + (Math.random() - 0.5) * 0.04;
    const finalRadius = radius * perturbation;

    positions[i * 3] = x * finalRadius;
    positions[i * 3 + 1] = y * finalRadius;
    positions[i * 3 + 2] = z * finalRadius;

    const mixRatio = (y + 1) / 2.0 * 0.4 + Math.random() * 0.3;
    const pointColor = primaryColor.clone().lerp(coreColor, mixRatio);

    colorsArray[i * 3] = pointColor.r;
    colorsArray[i * 3 + 1] = pointColor.g;
    colorsArray[i * 3 + 2] = pointColor.b;

    sizes[i] = Math.random() * 2.0 + 0.8;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    size: 0.055,
    vertexColors: true,
    transparent: true,
    opacity: 0.88,
    sizeAttenuation: true,
    depthWrite: false,
  });

  const outerPoints = new THREE.Points(geometry, material);
  outerPoints.name = 'outerPlanetPoints';
  planetGroup.add(outerPoints);

  // ── 2. Dense Inner Data Core ──
  const coreCount = Math.floor(pointCount * 0.4);
  const coreGeometry = new THREE.BufferGeometry();
  const corePos = new Float32Array(coreCount * 3);

  for (let i = 0; i < coreCount; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phiAngle = Math.acos(2.0 * v - 1.0);
    const r = (radius * 0.6) * Math.cbrt(Math.random());

    corePos[i * 3] = r * Math.sin(phiAngle) * Math.cos(theta);
    corePos[i * 3 + 1] = r * Math.sin(phiAngle) * Math.sin(theta);
    corePos[i * 3 + 2] = r * Math.cos(phiAngle);
  }

  coreGeometry.setAttribute('position', new THREE.BufferAttribute(corePos, 3));
  const coreMaterial = new THREE.PointsMaterial({
    color: colors.planetInnerCore,
    size: 0.035,
    transparent: true,
    opacity: 0.5,
    sizeAttenuation: true,
    depthWrite: false,
  });

  const innerCore = new THREE.Points(coreGeometry, coreMaterial);
  innerCore.name = 'innerPlanetCore';
  planetGroup.add(innerCore);

  // ── 3. Wireframe Geodesic Grid Overlay ──
  const icoGeo = new THREE.IcosahedronGeometry(radius * 0.99, 2);
  const edgesGeo = new THREE.EdgesGeometry(icoGeo);
  const gridMaterial = new THREE.LineBasicMaterial({
    color: colors.gridLines,
    transparent: true,
    opacity: 0.12,
    depthWrite: false,
  });

  const grid = new THREE.LineSegments(edgesGeo, gridMaterial);
  grid.name = 'planetGrid';
  planetGroup.add(grid);

  icoGeo.dispose(); // dispose the intermediate geometry

  return planetGroup;
}
