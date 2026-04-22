import React, { useRef, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import * as THREE from "three";
import { degToRad } from "../utils/helpers";

/**
 * FallbackEarth — solid glowing sphere used when textures aren't loaded yet
 */
export function FallbackEarth({ data }) {
  const ref = useRef();
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += data.rotationSpeed;
  });
  const tiltRad = useMemo(() => degToRad(data.axialTilt), [data.axialTilt]);
  return (
    <group rotation={[0, 0, tiltRad]}>
      <mesh ref={ref} name="earth-fallback">
        <sphereGeometry args={[data.radius, 64, 64]} />
        <meshPhongMaterial color={data.color} emissive="#1a3a6a" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

/**
 * Earth — textured, tilted, rotating globe with cloud layer
 * Falls back to a solid blue sphere if textures fail to load.
 *
 * @param {{ data: object, onClick: () => void }} props
 */
export default function Earth({ data, onClick }) {
  const earthRef  = useRef();
  const cloudRef  = useRef();

  // Load all maps (TextureLoader is bundled with three)
  const [colorMap, bumpMap, specMap, cloudMap] = useLoader(TextureLoader, [
    data.texture,
    data.bumpMap,
    data.specularMap,
    data.cloudsTexture,
  ]);

  // Rotate every frame
  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += data.rotationSpeed;
    }
    if (cloudRef.current) {
      cloudRef.current.rotation.y += data.rotationSpeed * 1.15; // clouds drift faster
    }
  });

  const tiltRad = useMemo(() => degToRad(data.axialTilt), [data.axialTilt]);

  return (
    <group rotation={[0, 0, tiltRad]}>
      {/* ── Main globe ────────────────────────────────────── */}
      <mesh
        ref={earthRef}
        onClick={onClick}
        castShadow
        receiveShadow
        name="earth"
      >
        <sphereGeometry args={[data.radius, 64, 64]} />
        <meshPhongMaterial
          map={colorMap}
          bumpMap={bumpMap}
          bumpScale={0.06}
          specularMap={specMap}
          specular="#88ccff"
          shininess={15}
        />
      </mesh>

      {/* ── Cloud layer ───────────────────────────────────── */}
      <mesh ref={cloudRef} name="earth-clouds">
        <sphereGeometry args={[data.radius + 0.035, 64, 64]} />
        <meshPhongMaterial
          map={cloudMap}
          transparent
          opacity={0.4}
          depthWrite={false}
        />
      </mesh>

      {/* ── Atmospheric glow (emissive shell) ─────────────── */}
      <mesh name="earth-atmosphere">
        <sphereGeometry args={[data.radius + 0.09, 64, 64]} />
        <meshPhongMaterial
          color="#4fa3e0"
          emissive="#1a4a8a"
          emissiveIntensity={0.15}
          transparent
          opacity={0.12}
          depthWrite={false}
          side={2}   /* THREE.DoubleSide */
        />
      </mesh>
    </group>
  );
}
