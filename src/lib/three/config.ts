/**
 * ORBITAL — 3D Scene Configuration
 * Centralized settings for point counts, colors, speeds, and responsive tiers.
 */

export const THREE_CONFIG = {
  // Quality Tiers based on screen width
  quality: {
    desktop: {
      minWidth: 1024,
      planetPoints: 2500,
      starCount: 1500,
      nodeCount: 6,
      pixelRatioLimit: 1.5,
    },
    tablet: {
      minWidth: 768,
      planetPoints: 1200,
      starCount: 800,
      nodeCount: 5,
      pixelRatioLimit: 1.25,
    },
    mobile: {
      minWidth: 0,
      planetPoints: 500,
      starCount: 300,
      nodeCount: 3,
      pixelRatioLimit: 1.0,
    },
  },

  // Color Palettes for Dark and Light Modes
  colors: {
    dark: {
      bg: 0x0A0E17,
      planetPoints: 0x3B8BEB,
      planetInnerCore: 0x4DC9F6,
      stars: 0x5DA8F5,
      orbits: 0x3B8BEB,
      nodes: 0x4DC9F6,
      nodeGlow: 0x5DA8F5,
      atmosphereGlow: 0x1B3A5C,
      connectionLines: 0x2A6FC4,
      gridLines: 0x1B3A5C,
      pulseGlow: 0x4DC9F6,
    },
    light: {
      bg: 0xF8FAFC,
      planetPoints: 0x1B3A5C,
      planetInnerCore: 0x3B8BEB,
      stars: 0x94A3B8,
      orbits: 0x3B8BEB,
      nodes: 0x0284C7,
      nodeGlow: 0x38BDF8,
      atmosphereGlow: 0xBAE6FD,
      connectionLines: 0x3B8BEB,
      gridLines: 0x94A3B8,
      pulseGlow: 0x0284C7,
    },
  },

  // Alternating Sapphire Blue & Fiery Crimson Red node ball color palette
  nodeColors: [
    { dark: 0x3B8BEB, light: 0x0284C7 }, // 1. Electric Sapphire Blue
    { dark: 0xFF2A4B, light: 0xDC2626 }, // 2. Fiery Crimson Red
    { dark: 0x4DC9F6, light: 0x0284C7 }, // 3. Vibrant Cyan Blue
    { dark: 0xFF3333, light: 0xB91C1C }, // 4. Fiery Flame Red
    { dark: 0x5DA8F5, light: 0x2563EB }, // 5. Deep Sky Blue
    { dark: 0xFF4D4D, light: 0xEF4444 }, // 6. Intense Crimson Red
  ],

  // Speeds (radians per frame / tick multiplier)
  speeds: {
    planetRotationY: 0.0012,
    planetRotationX: 0.0004,
    starfieldRotationY: 0.00015,
    orbitRotationZ: 0.0008,
    nodeOrbitSpeed: 0.003,
  },

  // Animation settings
  animation: {
    nodePulseSpeed: 2.0,
    nodePulseAmplitude: 0.15,
    corePulseSpeed: 0,
    corePulseAmplitude: 0.0,
    connectionLineOpacity: 0.12,
  },

  // Geometry dimensions & Multi-color Orbit Rings Configuration
  dimensions: {
    planetRadius: 1.6,
    orbitRings: [
      { 
        radius: 2.2, 
        tiltX: 0.45, 
        tiltZ: 0.25, 
        opacity: 0.75, 
        colorDark: 0x4DC9F6, // Vibrant Cyan Glow
        colorLight: 0x0284C7 
      },
      { 
        radius: 2.7, 
        tiltX: -0.35, 
        tiltZ: -0.4, 
        opacity: 0.65, 
        colorDark: 0x3B8BEB, // Deep Electric Blue
        colorLight: 0x2A6FC4 
      },
      { 
        radius: 3.2, 
        tiltX: 0.55, 
        tiltZ: 0.15, 
        opacity: 0.55, 
        colorDark: 0x6DB4F7, // Bright Metallic Sky
        colorLight: 0x3B8BEB 
      },
    ],
    starfieldRadius: 18,
  },

  // Parallax sensitivity
  parallax: {
    factorX: 0.12,
    factorY: 0.12,
    ease: 0.04,
  },
};
