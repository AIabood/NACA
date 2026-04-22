import { useRef, useEffect, useCallback } from "react";
import * as THREE from "three";

/**
 * useRaycaster
 * Fires `onHit(planet)` when the user's pointer intersects a mesh,
 * and `onMiss()` when the pointer leaves all meshes.
 *
 * @param {React.RefObject} cameraRef   – ref to THREE.Camera
 * @param {THREE.Object3D[]} targets    – array of meshes to test
 * @param {{ onHit, onMiss }} callbacks
 */
export default function useRaycaster(cameraRef, targets, { onHit, onMiss }) {
  const raycaster = useRef(new THREE.Raycaster());
  const mouse     = useRef(new THREE.Vector2());
  const hovering  = useRef(false);

  const handleMove = useCallback(
    (e) => {
      const { clientX, clientY } = e.touches ? e.touches[0] : e;
      mouse.current.x =  (clientX / window.innerWidth)  * 2 - 1;
      mouse.current.y = -(clientY / window.innerHeight) * 2 + 1;

      if (!cameraRef.current) return;
      raycaster.current.setFromCamera(mouse.current, cameraRef.current);

      const hits = raycaster.current.intersectObjects(targets, true);
      if (hits.length > 0) {
        if (!hovering.current) {
          hovering.current = true;
          onHit?.(hits[0].object);
        }
      } else {
        if (hovering.current) {
          hovering.current = false;
          onMiss?.();
        }
      }
    },
    [cameraRef, targets, onHit, onMiss]
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("touchmove",  handleMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove",  handleMove);
    };
  }, [handleMove]);
}
