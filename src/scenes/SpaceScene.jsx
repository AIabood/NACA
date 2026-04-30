import React, { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import * as THREE from "three";

import Earth from "../objects/Earth";
import Galaxy from "../objects/Galaxy";
import FloatingPlayer from "../components/FloatingPlayer";
import SpaceNode from "../components/SpaceNode";
import { PLANETS } from "../data/planets";

function CameraZoom({ targetPlanet }) {
  const { camera } = useThree();
  const defaultPos = useRef(new THREE.Vector3(0, 5, 20));

  useFrame((state, delta) => {
    if (targetPlanet) {
      const position = targetPlanet.position || [0, 0, 0];
      const targetPos = new THREE.Vector3(...position);
      const dir = targetPos.clone().sub(camera.position).normalize();
      const zoomPos = targetPos.clone().sub(dir.multiplyScalar(targetPlanet.radius * 2.2));

      camera.position.lerp(zoomPos, 0.05);
    }
  });

  return null;
}

function PlanetProximityDetector({ onPlanetFocus }) {
  const { camera } = useThree();
  const lastFocusedRef = useRef(null);

  useFrame(() => {
    let closestPlanet = null;
    let minDistance = 15; // Only focus if within 15 units

    PLANETS.forEach(planet => {
      const position = planet.position || [0, 0, 0];
      const dist = camera.position.distanceTo(new THREE.Vector3(...position));
      if (dist < minDistance) {
        minDistance = dist;
        closestPlanet = planet;
      }
    });

    if (closestPlanet?.id !== lastFocusedRef.current?.id) {
      lastFocusedRef.current = closestPlanet;
      onPlanetFocus(closestPlanet);
    }
  });

  return null;
}

export default function SpaceScene({
  onPlanetClick,
  onPlanetFocus,
  onHotspotClick,
  activeHotspot,
  showInfo,
  onZoomChange,
  onFocusChange,
  activePlanet,
  controlsEnabled = true
}) {
  return (
    <Canvas
      id="space-canvas"
      className="space-canvas"
      shadows
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
      camera={{
        fov: 45,
        near: 0.1,
        far: 5000,
        position: [0, 5, 20],
      }}
      dpr={[1, 2]}
    >
      <CameraZoom targetPlanet={activePlanet} />
      <PlanetProximityDetector onPlanetFocus={onPlanetFocus} />
      <FloatingPlayer
        speed={0.15}
        damping={0.9}
        enabled={controlsEnabled && !activePlanet}
      />

      <ambientLight intensity={0.1} />
      <directionalLight position={[50, 50, 50]} intensity={2} color="#ffffff" castShadow />

      <Galaxy />

      {PLANETS.map((planet) => (
        <group key={planet.id} position={planet.position || [0, 0, 0]}>
          <Suspense fallback={null}>
            <Earth
              data={planet}
              onClick={() => onPlanetClick(planet)}
              onHotspotClick={onHotspotClick}
              activeHotspotId={activeHotspot?.id}
              isShrunk={showInfo && activePlanet?.id === planet.id}
            />

            <SpaceNode
              position={[0, planet.radius + 2, 0]}
              label={planet.name}
              icon={planet.icon}
              onClick={() => onPlanetClick(planet)}
            />
          </Suspense>
        </group>
      ))}

      <Preload all />
    </Canvas>
  );
}
