import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { generateStarPositions } from "../utils/helpers";

/**
 * StarField — a large sphere of randomly placed star particles.
 * Slowly drifts/twinkles to give the scene life.
 */
export default function StarField({ count = 6000, radius = 200 }) {
  const ref = useRef();

  const positions = useMemo(() => generateStarPositions(count, radius), [count, radius]);

  // Randomise star sizes (stored in geometry attribute "size")
  const sizes = useMemo(() => {
    const arr = new Float32Array(count);
    for (let i = 0; i < count; i++) arr[i] = Math.random() * 1.5 + 0.5;
    return arr;
  }, [count]);

  // Very slow drift rotation
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.003;
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [positions, sizes]);

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        color="#ffffff"
        size={0.35}
        sizeAttenuation
        transparent
        opacity={0.85}
        fog={false}
      />
    </points>
  );
}
