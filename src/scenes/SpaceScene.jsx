import React, { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Preload } from "@react-three/drei";
import * as THREE from "three";

import Earth, { FallbackEarth } from "../objects/Earth";
import StarField               from "../objects/StarField";

/**
 * SpaceScene — the root Three.js / R3F canvas.
 * Handles lighting, camera defaults, orbit controls, and
 * composing all 3D objects together.
 *
 * @param {{ earthData: object, onPlanetClick: () => void }} props
 */
export default function SpaceScene({ earthData, onPlanetClick }) {
  const controlsRef = useRef();

  return (
    <Canvas
      id="space-canvas"
      className="space-canvas"
      shadows
      gl={{
        antialias:            true,
        toneMapping:          THREE.ACESFilmicToneMapping,
        toneMappingExposure:  1.2,
      }}
      camera={{
        fov:      45,
        near:     0.1,
        far:      2000,
        position: [0, 0, 8],
      }}
      dpr={[1, 2]}
    >
      {/* ── Background colour ────────────────────────────────── */}
      <color attach="background" args={["#00000f"]} />

      {/* ── Lighting ─────────────────────────────────────────── */}

      {/* Soft ambient fill — keeps dark side visible */}
      <ambientLight intensity={0.08} />

      {/* Directional "sun" light coming from upper-right */}
      <directionalLight
        position={[10, 5, 5]}
        intensity={2.4}
        color="#fff8e7"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Subtle cool rim from opposite side */}
      <directionalLight
        position={[-8, -3, -5]}
        intensity={0.18}
        color="#4466cc"
      />

      {/* ── Background star layers ────────────────────────────── */}

      {/* Drei's deep-field stars (distant, sparse) */}
      <Stars
        radius={300}
        depth={60}
        count={3000}
        factor={4}
        saturation={0}
        fade
        speed={0.4}
      />

      {/* Custom denser, closer star field with slow drift */}
      <StarField count={5000} radius={180} />

      {/* ── Planets — inside Suspense for async texture loading ── */}
      <Suspense fallback={<FallbackEarth data={earthData} />}>
        <Earth data={earthData} onClick={onPlanetClick} />
        <Preload all />
      </Suspense>

      {/* ── Camera / orbit controls ───────────────────────────── */}
      <OrbitControls
        ref={controlsRef}
        enablePan={false}       // keep Earth fixed at origin
        enableDamping           // smooth inertia
        dampingFactor={0.06}
        rotateSpeed={0.55}
        zoomSpeed={0.7}
        minDistance={4}         // don't clip inside the planet
        maxDistance={30}        // don't drift too far out
        autoRotate={false}
        makeDefault
      />
    </Canvas>
  );
}
