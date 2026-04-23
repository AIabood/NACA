import React, { useRef, useMemo, useState } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { TextureLoader } from "three";
import * as THREE from "three";
import { degToRad } from "../utils/helpers";
import useHandControls from "../hooks/useHandControls";
import Hotspot from "../components/Hotspot";

/* ─────────────────────────────────────────────────────────────────
   FallbackEarth
   Shown inside <Suspense> while textures are still streaming.
   A simple glowing blue sphere so the user sees something immediately.
 ───────────────────────────────────────────────────────────────────*/
export function FallbackEarth({ data }) {
  const ref = useRef();

  useFrame(() => {
    if (ref.current) ref.current.rotation.y += data.rotationSpeed;
  });

  const tilt = useMemo(() => degToRad(data.axialTilt), [data.axialTilt]);

  return (
    <group rotation={[0, 0, tilt]}>
      <mesh ref={ref} name="earth-fallback">
        <sphereGeometry args={[data.radius, 64, 64]} />
        <meshPhongMaterial
          color={data.color}
          emissive="#1a3a6a"
          emissiveIntensity={0.4}
        />
      </mesh>
      {/* Glow shell */}
      <mesh>
        <sphereGeometry args={[data.radius + 0.12, 32, 32]} />
        <meshPhongMaterial
          color="#4fa3e0"
          transparent
          opacity={0.15}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

export default function Earth({
  data,
  onClick,
  onHotspotClick,
  activeHotspotId,
  handDataRef,
  aiEnabled,
  isShrunk
}) {
  const { camera, size } = useThree();
  const groupRef = useRef();
  const earthRef = useRef();
  const cloudRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [handHoveredHotspot, setHandHoveredHotspot] = useState(null);

  // Initialize hand controls hook
  const handData = useHandControls(handDataRef, aiEnabled);

  const [colorMap, bumpMap, specMap, cloudMap] = useLoader(TextureLoader, [
    data.texture,
    data.bumpMap,
    data.specularMap,
    data.cloudsTexture,
  ]);

  const getHotspotPos = (phi, theta, radius) => {
    return new THREE.Vector3(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  };

  const wasPinching = useRef(false);

  useFrame(() => {
    if (earthRef.current) earthRef.current.rotation.y += data.rotationSpeed;
    if (cloudRef.current) cloudRef.current.rotation.y += data.rotationSpeed * 1.15;

    if (aiEnabled && handDataRef.current.detected && groupRef.current) {
      const hand = handData.current;

      // 1. SWIPE -> Rotation
      const targetRotationY = (hand.x - 0.5) * Math.PI * 2;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.05);

      // 2. PUSH -> Entry
      const targetScale = THREE.MathUtils.mapLinear(hand.z, 0.2, -0.2, 0.8, 1.5);
      const clampedScale = THREE.MathUtils.clamp(targetScale, 0.7, 1.8);
      groupRef.current.scale.lerp(new THREE.Vector3(clampedScale, clampedScale, clampedScale), 0.1);

      // 3. HAND HOVER (Distance-based in screen space)
      let closestHotspot = null;
      let minDistance = 0.15; // Threshold for selection (normalized 0..1)

      data.hotspots?.forEach(hs => {
        const worldPos = getHotspotPos(hs.phi, hs.theta, data.radius + 0.05);
        worldPos.applyMatrix4(groupRef.current.matrixWorld); // Apply rotation/scale of Earth
        const screenPos = worldPos.project(camera);

        // Convert screenPos (-1..1) to (0..1)
        const sx = (screenPos.x + 1) / 2;
        const sy = (1 - screenPos.y) / 2;

        const dist = Math.sqrt(Math.pow(sx - hand.x, 2) + Math.pow(sy - hand.y, 2));
        if (dist < minDistance) {
          minDistance = dist;
          closestHotspot = hs;
        }
      });
      setHandHoveredHotspot(closestHotspot);

      // 4. PINCH -> Choice
      if (hand.isPinching && !wasPinching.current) {
        if (closestHotspot) {
          onHotspotClick?.(closestHotspot);
        } else {
          onClick?.();
        }
      }
      wasPinching.current = hand.isPinching;

    } else {
      if (groupRef.current) {
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.05);
        
        const targetScaleValue = isShrunk ? 0.6 : 1;
        groupRef.current.scale.lerp(new THREE.Vector3(targetScaleValue, targetScaleValue, targetScaleValue), 0.1);
      }
      setHandHoveredHotspot(null);
      wasPinching.current = false;
    }
  });

  const tilt = useMemo(() => degToRad(data.axialTilt), [data.axialTilt]);

  // Pointer cursor feedback
  const handlePointerOver = () => {
    document.body.style.cursor = "pointer";
    setHovered(true);
  };
  const handlePointerOut = () => {
    document.body.style.cursor = "grab";
    setHovered(false);
  };

  return (
    <group ref={groupRef} rotation={[0, 0, tilt]}>

      {/* ── 1. Main Globe ─────────────────────────────────── */}
      <mesh ref={earthRef} castShadow receiveShadow name="earth">
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

      {/* ── 2. Cloud Layer ───────────────────────────────── */}
      <mesh ref={cloudRef} name="earth-clouds">
        <sphereGeometry args={[data.radius + 0.035, 64, 64]} />
        <meshPhongMaterial
          map={cloudMap}
          transparent
          opacity={0.4}
          depthWrite={false}
        />
      </mesh>

      {/* ── 3. Atmospheric Glow ──────────────────────────── */}
      <mesh name="earth-atmosphere">
        <sphereGeometry args={[data.radius + 0.09, 64, 64]} />
        <meshPhongMaterial
          color="#4fa3e0"
          emissive="#1a4a8a"
          emissiveIntensity={hovered ? 0.35 : 0.15}
          transparent
          opacity={hovered ? 0.2 : 0.12}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ── 4. Hotspots ──────────────────────────────────── */}
      {data.hotspots?.map((hs) => (
        <Hotspot
          key={hs.id}
          position={getHotspotPos(hs.phi, hs.theta, data.radius + 0.05)}
          label={hs.label}
          active={activeHotspotId === hs.id}
          onClick={() => onHotspotClick?.(hs)}
        />
      ))}

      {/* ── 5. Invisible click / hover bounding sphere ───── */}
      {/*    Covers the entire planet so clicks register      */}
      {/*    regardless of which layer the ray hits first.    */}
      <mesh
        name="earth-hitbox"
        onClick={onClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[data.radius + 0.15, 32, 32]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}
