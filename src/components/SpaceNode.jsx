import React, { useState, useRef } from "react";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function SpaceNode({ position, label, icon, onClick }) {
  const [hovered, setHovered] = useState(false);
  const ringRef = useRef();

  useFrame((state) => {
    if (ringRef.current) {
      const t = state.clock.elapsedTime;
      ringRef.current.rotation.z = t * 0.5;
      const s = 1 + Math.sin(t * 2) * 0.1;
      ringRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group position={position}>
      <mesh 
        onPointerOver={() => setHovered(true)} 
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
      >
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshBasicMaterial color={hovered ? "#7ec8f7" : "#4fa3e0"} transparent opacity={0.6} />
      </mesh>

      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.6, 32]} />
        <meshBasicMaterial color="#4fa3e0" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>

      <Html distanceFactor={15} center position={[0, 1, 0]}>
        <div className={`space-node-label ${hovered ? "space-node-label--active" : ""}`}>
          <span className="space-node-icon">{icon}</span>
          <span className="space-node-text">{label}</span>
        </div>
      </Html>
    </group>
  );
}
