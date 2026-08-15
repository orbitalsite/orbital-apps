/**
 * ORBITAL — 3D Responsive Helper
 * Determines quality tier based on viewport size.
 */
import { THREE_CONFIG } from './config';

export interface QualityTier {
  planetPoints: number;
  starCount: number;
  nodeCount: number;
  pixelRatioLimit: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export function getQualityTier(width: number): QualityTier {
  const { desktop, tablet, mobile } = THREE_CONFIG.quality;

  if (width >= desktop.minWidth) {
    return {
      ...desktop,
      isMobile: false,
      isTablet: false,
      isDesktop: true,
    };
  }

  if (width >= tablet.minWidth) {
    return {
      ...tablet,
      isMobile: false,
      isTablet: true,
      isDesktop: false,
    };
  }

  return {
    ...mobile,
    isMobile: true,
    isTablet: false,
    isDesktop: false,
  };
}
