import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import * as THREE from "three";

import Earth         from "../objects/Earth";
import Galaxy        from "../objects/Galaxy";
import FloatingPlayer from "../components/FloatingPlayer";
import SpaceNode     from "../components/SpaceNode";
import { PLANETS }   from "../data/planets";

export default function SpaceScene({ 
  onPlanetClick, 
  onHotspotClick,
  activeHotspot,
  showInfo,
  onZoomChange, 
  onFocusChange,
  activePlanet
}) {
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
        far:      5000,
        position: [0, 5, 20],
      }}
      dpr={[1, 2]}
    >
      <FloatingPlayer speed={0.15} damping={0.9} />

      <ambientLight intensity={0.1} />
      <directionalLight position={[50, 50, 50]} intensity={2} color="#ffffff" castShadow />
      
      <Galaxy />

      {PLANETS.map((planet) => (
        <group key={planet.id} position={planet.position}>
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
