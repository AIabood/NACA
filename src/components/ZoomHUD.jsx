import React from "react";
import "../styles/global.css";

/**
 * ZoomHUD — Dynamic UI that changes based on the camera distance (zoom level).
 * 
 * Levels:
 * - far: minimal UI, just planet name.
 * - medium: basic stats overlay.
 * - close: detailed surface info.
 */
export default function ZoomHUD({ zoomLevel, planet, isFocused }) {
  if (!planet || isFocused) return null; // Hide HUD if in focus mode (PlanetInfo is shown)

  return (
    <div className={`zoom-hud zoom-hud--${zoomLevel}`} aria-live="polite">
      {/* ── FAR VIEW (ORBIT) ─────────────────────────────────── */}
      <div className={`zoom-hud__panel zoom-hud__panel--far ${zoomLevel === "far" ? "zoom-hud__panel--active" : ""}`}>
        <h2 className="zoom-hud__title">{planet.name}</h2>
        <p className="zoom-hud__subtitle">SATELLITE VIEW • {planet.type} Planet</p>
      </div>

      {/* ── MEDIUM VIEW (APPROACH) ───────────────────────────── */}
      <div className={`zoom-hud__panel zoom-hud__panel--medium ${zoomLevel === "medium" ? "zoom-hud__panel--active" : ""}`}>
        <div className="zoom-hud__header">
          <h2 className="zoom-hud__title">{planet.name}</h2>
          <span className="zoom-hud__badge">ATMOSPHERE ENTRY</span>
        </div>
        <div className="zoom-hud__stats">
          <div className="zoom-hud__stat">
            <span className="zoom-hud__icon">🌡️</span>
            <span>AVG TEMP: {planet.stats.temperature.avg}</span>
          </div>
          <div className="zoom-hud__stat">
            <span className="zoom-hud__icon">🌫️</span>
            <span>GASES: {planet.stats.atmosphere.split(',')[0]}</span>
          </div>
        </div>
      </div>

      {/* ── CLOSE VIEW (SURFACE) ────────────────────────────── */}
      <div className={`zoom-hud__panel zoom-hud__panel--close ${zoomLevel === "close" ? "zoom-hud__panel--active" : ""}`}>
        <div className="zoom-hud__header">
          <h2 className="zoom-hud__title">{planet.name}</h2>
          <span className="zoom-hud__badge zoom-hud__badge--alert">LOW ALTITUDE</span>
        </div>
        <p className="zoom-hud__desc">Precision scanning active. Surface features identified.</p>
        <div className="zoom-hud__details">
          <div className="zoom-hud__detail-row">
            <span>GRAVITY:</span> <strong>{planet.stats.gravity}</strong>
          </div>
          <div className="zoom-hud__detail-row">
            <span>DIAMETER:</span> <strong>{planet.stats.diameter}</strong>
          </div>
        </div>
        <div className="zoom-hud__footer-hint">
          📍 INTERACTIVE HOTSPOTS DETECTED
        </div>
      </div>
    </div>
  );
}
