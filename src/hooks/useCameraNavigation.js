/**
 * useCameraNavigation.js
 *
 * Core hook for the cinematic camera system. Must be called from
 * a component rendered INSIDE <Canvas> (has access to useThree/useFrame).
 *
 * Phases:
 *  1. Orbit view  — free OrbitControls, user rotates/zooms manually
 *  2. Focus mode  — camera lerps to Earth focus point on click
 *  3. Return mode — camera lerps back to default position on close
 *
 * Zoom levels (read-only, computed from camera distance every frame):
 *  "far"    — distance > FAR_THRESHOLD
 *  "medium" — distance > MED_THRESHOLD
 *  "close"  — distance <= MED_THRESHOLD
 */

import { useRef, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ── Camera position presets ────────────────────────────────────
const DEFAULT_POS = new THREE.Vector3(0, 0, 8);   // starting orbit view
const FOCUS_POS   = new THREE.Vector3(0, 0.8, 5); // cinematic focus on Earth

// ── Zoom level distance thresholds ────────────────────────────
export const FAR_THRESHOLD = 14;   // > 14 units → far / orbit view
export const MED_THRESHOLD = 7;    // 7–14 units  → medium / approach
                                   // < 7 units   → close / surface view

// ── Animation speed ────────────────────────────────────────────
const LERP_SPEED  = 0.055;  // per frame (lower = smoother but slower)
const SNAP_DIST   = 0.008;  // stop lerping when this close to target

export default function useCameraNavigation({
  controlsRef,
  onZoomChange,   // (level: "far"|"medium"|"close") => void
  onFocusChange,  // (isFocused: boolean) => void
}) {
  const { camera } = useThree();

  // Internal mutable refs — no re-renders during animation
  const targetPosRef   = useRef(null);      // null = not animating
  const isFocusedRef   = useRef(false);
  const isAnimatingRef = useRef(false);
  const zoomLevelRef   = useRef("medium");

  // ── Per-frame logic ─────────────────────────────────────────
  useFrame(() => {
    const dist = camera.position.length(); // distance from origin (Earth centre)

    // ── Compute & broadcast zoom level ────────────────────────
    const newLevel =
      dist > FAR_THRESHOLD ? "far" :
      dist > MED_THRESHOLD ? "medium" :
      "close";

    if (newLevel !== zoomLevelRef.current) {
      zoomLevelRef.current = newLevel;
      onZoomChange?.(newLevel);
    }

    // ── Camera lerp animation ─────────────────────────────────
    if (!targetPosRef.current) return;

    camera.position.lerp(targetPosRef.current, LERP_SPEED);

    // Always look at Earth centre while animating
    camera.lookAt(0, 0, 0);
    
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update(); // CRITICAL: Update controls while manually moving camera
    }

    // Stop when close enough
    if (camera.position.distanceTo(targetPosRef.current) < SNAP_DIST) {
      camera.position.copy(targetPosRef.current);
      targetPosRef.current = null;
      isAnimatingRef.current = false;

      // Re-enable orbit controls after animation
      if (controlsRef.current) {
        controlsRef.current.enabled = true;
        controlsRef.current.update();
      }
    }
  });

  // ── Focus — animate toward Earth ────────────────────────────
  const focusOnEarth = useCallback(() => {
    if (isFocusedRef.current || isAnimatingRef.current) return;

    isFocusedRef.current   = true;
    isAnimatingRef.current = true;
    targetPosRef.current   = FOCUS_POS.clone();

    // Disable OrbitControls so they don't fight the lerp
    if (controlsRef.current) {
      controlsRef.current.enabled = false;
    }

    onFocusChange?.(true);
  }, [controlsRef, onFocusChange]);

  // ── Return — animate back to default orbit ───────────────────
  const returnToOrbit = useCallback(() => {
    if (!isFocusedRef.current && !isAnimatingRef.current) return;

    isFocusedRef.current   = false;
    isAnimatingRef.current = true;
    targetPosRef.current   = DEFAULT_POS.clone();

    if (controlsRef.current) {
      controlsRef.current.enabled = false;
    }

    onFocusChange?.(false);
  }, [controlsRef, onFocusChange]);

  return { focusOnEarth, returnToOrbit };
}
