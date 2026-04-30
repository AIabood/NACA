import React, { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function FloatingPlayer({ speed = 0.15, damping = 0.9, enabled = true }) {
  const { camera, gl } = useThree();
  const velocity = useRef(new THREE.Vector3());
  const keys = useRef({});
  const mouseMove = useRef({ x: 0, y: 0 });
  const euler = useRef(new THREE.Euler(0, 0, 0, "YXZ"));

  useEffect(() => {
    if (!enabled) return;

    console.log("FloatingPlayer: Initializing...");
    const handleKeyDown = (e) => (keys.current[e.code] = true);
    const handleKeyUp = (e) => (keys.current[e.code] = false);
    
    const handleMouseMove = (e) => {
      if (document.pointerLockElement === gl.domElement) {
        mouseMove.current.x -= e.movementX * 0.001;
        mouseMove.current.y -= e.movementY * 0.001;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousemove", handleMouseMove);

    const handleClick = () => {
      gl.domElement.requestPointerLock();
    };
    gl.domElement.addEventListener("mousedown", handleClick);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousemove", handleMouseMove);
      gl.domElement.removeEventListener("mousedown", handleClick);
    };
  }, [gl, enabled]);

  useFrame((state, delta) => {
    if (!enabled) {
      velocity.current.set(0, 0, 0);
      return;
    }
    // 1. Rotation (Mouse Look)
    euler.current.y = mouseMove.current.x;
    euler.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, mouseMove.current.y));
    camera.quaternion.setFromEuler(euler.current);

    // 2. Acceleration (WASD)
    const accel = new THREE.Vector3();
    if (keys.current["KeyW"] || keys.current["ArrowUp"])    accel.z -= 1;
    if (keys.current["KeyS"] || keys.current["ArrowDown"])  accel.z += 1;
    if (keys.current["KeyA"] || keys.current["ArrowLeft"])  accel.x -= 1;
    if (keys.current["KeyD"] || keys.current["ArrowRight"]) accel.x += 1;
    if (keys.current["KeyQ"]) accel.y -= 1;
    if (keys.current["KeyE"]) accel.y += 1;

    accel.normalize();
    
    // Boost (Shift)
    const currentSpeed = speed * (keys.current["ShiftLeft"] ? 3 : 1);
    accel.multiplyScalar(currentSpeed * delta * 60);

    // Transform accel to camera orientation
    accel.applyQuaternion(camera.quaternion);
    
    // Apply accel to velocity
    velocity.current.add(accel);

    // 3. Inertia & Damping
    camera.position.add(velocity.current);
    velocity.current.multiplyScalar(damping);

    // Stop if very slow
    if (velocity.current.length() < 0.0001) velocity.current.set(0, 0, 0);
  });

  return null;
}
