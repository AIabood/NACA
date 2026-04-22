import React from "react";
import "../styles/global.css";

/**
 * Loader — full-screen animated loading screen
 * @param {{ progress: number }} props  – 0..100
 */
export default function Loader({ progress = 0 }) {
  return (
    <div className="loader" role="status" aria-label="Loading space scene">
      {/* Animated orbit rings */}
      <div className="loader__orbit loader__orbit--outer" aria-hidden="true" />
      <div className="loader__orbit loader__orbit--inner" aria-hidden="true" />

      {/* Pulsing core */}
      <div className="loader__core" aria-hidden="true">
        <div className="loader__planet" />
      </div>

      {/* Text */}
      <p className="loader__label">Preparing the Universe…</p>

      {/* Progress bar */}
      <div className="loader__track" aria-hidden="true">
        <div
          className="loader__fill"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <p className="loader__pct" aria-live="polite">{Math.round(progress)}%</p>
    </div>
  );
}
