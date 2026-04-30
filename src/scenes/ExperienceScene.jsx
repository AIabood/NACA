import React, { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Preload, Stars } from "@react-three/drei";
import * as THREE from "three";
import Earth from "../objects/Earth";
import StarField from "../objects/StarField";

// ── Cinematic Camera Controller ──────────────────────────────
function ExperienceCameraController({ activeCategory }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 10));
  const isAnimating = useRef(false);

  useEffect(() => {
    if (activeCategory) {
      // Calculate target spherical position
      const phi = activeCategory.phi || 1.5;
      const theta = activeCategory.theta || 0;
      const radius = 8; // Zoom distance

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);

      targetPos.current.set(x, y, z);
      isAnimating.current = true;
    }
  }, [activeCategory]);

  useFrame(() => {
    if (isAnimating.current) {
      camera.position.lerp(targetPos.current, 0.05);
      camera.lookAt(0, 0, 0);

      if (camera.position.distanceTo(targetPos.current) < 0.01) {
        isAnimating.current = false;
      }
    }
  });

  return null;
}

export default function ExperienceScene({ 
  planet, 
  onHotspotClick, 
  activeHotspotId,
  activeCategory 
}) {
  return (
    <Canvas
      id="experience-canvas"
      className="space-canvas"
      shadows
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.5,
      }}
      camera={{
        fov: 45,
        near: 0.1,
        far: 1000,
        position: [0, 0, 10],
      }}
    >
      <Suspense fallback={null}>
        <ExperienceCameraController activeCategory={activeCategory} />
        
        <ambientLight intensity={0.2} />
        <directionalLight 
          position={[10, 10, 10]} 
          intensity={2.5} 
          castShadow 
          shadow-mapSize={[2048, 2048]}
        />
        
        <StarField count={5000} radius={500} />
        <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade speed={1} />

        <group>
          <Earth 
            data={planet} 
            onHotspotClick={onHotspotClick}
            activeHotspotId={activeHotspotId}
            isShrunk={false}
          />
        </group>

        <OrbitControls 
          enablePan={false}
          minDistance={planet.radius * 1.5}
          maxDistance={planet.radius * 8}
          enableDamping
          dampingFactor={0.05}
          autoRotate={!activeCategory} // Stop auto-rotate when exploring
          autoRotateSpeed={0.5}
        />
        
        <Preload all />
      </Suspense>
    </Canvas>
  );
}
