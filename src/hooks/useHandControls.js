import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * useHandControls - Processes handDataRef to control 3D objects.
 * 
 * @param {React.MutableRefObject} handDataRef 
 * @param {boolean} active 
 */
export default function useHandControls(handDataRef, active) {
  const smoothedData = useRef({ x: 0.5, y: 0.5, z: 0, pinch: 0.1, isPinching: false });

  useFrame(() => {
    if (!active || !handDataRef.current.detected) return;

    const raw = handDataRef.current;
    
    // Smooth the data using Lerp
    smoothedData.current.x = THREE.MathUtils.lerp(smoothedData.current.x, raw.x, 0.1);
    smoothedData.current.y = THREE.MathUtils.lerp(smoothedData.current.y, raw.y, 0.1);
    smoothedData.current.z = THREE.MathUtils.lerp(smoothedData.current.z, raw.z, 0.05); // slower for Z
    smoothedData.current.pinch = THREE.MathUtils.lerp(smoothedData.current.pinch, raw.pinch, 0.1);
    smoothedData.current.isPinching = raw.isPinching;
  });

  return smoothedData;
}
