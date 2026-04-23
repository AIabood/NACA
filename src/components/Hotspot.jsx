import React, { useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

/**
 * Hotspot Component
 * A clickable glowing point on the planet surface.
 */
export default function Hotspot({ position, label, onClick, active }) {
  const [hovered, setHovered] = useState(false);
  const ringRef = useRef();

  useFrame((state) => {
    if (ringRef.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      ringRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group position={position}>
      {/* ── Inner Core ── */}
      <mesh 
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={active ? "#7ec8f7" : "#4fa3e0"} />
      </mesh>

      {/* ── Outer Pulsing Ring ── */}
      <mesh ref={ringRef}>
        <ringGeometry args={[0.1, 0.14, 32]} />
        <meshBasicMaterial 
          color="#4fa3e0" 
          transparent 
          opacity={hovered || active ? 0.8 : 0.4} 
          side={THREE.DoubleSide} 
        />
      </mesh>

      {/* ── Floating Label ── */}
      {(hovered || active) && (
        <Html distanceFactor={10} position={[0, 0.2, 0]} center>
          <div className={`hotspot-label ${active ? "hotspot-label--active" : ""}`}>
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}
