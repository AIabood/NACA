import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import StarField from "./StarField";

export default function Galaxy() {
  return (
    <group>
      <Stars radius={500} depth={100} count={8000} factor={4} saturation={0} fade speed={0.2} />
      <StarField count={4000} radius={150} />
    </group>
  );
}
