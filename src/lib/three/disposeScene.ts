/**
 * ORBITAL — 3D Scene Disposal Manager
 * Disposes all WebGL geometries, materials, renderer context, and event listeners.
 */
import * as THREE from 'three';

export function disposeScene(
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  eventListeners: Array<{ target: EventTarget; type: string; listener: EventListenerOrEventListenerObject }>
): void {
  // 1. Remove all event listeners
  eventListeners.forEach(({ target, type, listener }) => {
    target.removeEventListener(type, listener);
  });

  // 2. Traverse scene and dispose geometries/materials
  scene.traverse((object) => {
    if (object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.Line) {
      if (object.geometry) {
        object.geometry.dispose();
      }

      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((mat) => mat.dispose());
        } else {
          object.material.dispose();
        }
      }
    }
  });

  // 3. Dispose renderer
  renderer.dispose();
  if (renderer.domElement && renderer.domElement.parentNode) {
    renderer.domElement.parentNode.removeChild(renderer.domElement);
  }
}
