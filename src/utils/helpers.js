import * as THREE from "three";

/**
 * Convert degrees to radians
 * @param {number} deg
 * @returns {number}
 */
export const degToRad = (deg) => (deg * Math.PI) / 180;

/**
 * Linearly interpolate between two values
 * @param {number} a
 * @param {number} b
 * @param {number} t  – 0..1
 * @returns {number}
 */
export const lerp = (a, b, t) => a + (b - a) * t;

/**
 * Clamp a value between min and max
 */
export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

/**
 * Generate a random float within [min, max)
 */
export const randomRange = (min, max) => Math.random() * (max - min) + min;

/**
 * Build a Float32Array of random star positions
 * @param {number} count   – number of stars
 * @param {number} radius  – sphere radius
 * @returns {Float32Array}
 */
export function generateStarPositions(count = 6000, radius = 200) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(2 * Math.random() - 1);
    const r     = radius * (0.5 + Math.random() * 0.5);

    positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  return positions;
}

/**
 * Format a large number with commas
 */
export const formatNumber = (n) =>
  n.toLocaleString("en-US");

/**
 * Detect if device prefers reduced motion
 */
export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
