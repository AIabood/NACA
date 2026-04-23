import React from "react";
import { Html } from "@react-three/drei";

/**
 * HologramUI Component
 * A floating, semi-transparent UI panel that follows the planet or a hotspot.
 */
export default function HologramUI({ title, description, icon, onClose, position = [0, 0, 0] }) {
  return (
    <Html position={position} center distanceFactor={12}>
      <div className="hologram-ui">
        <div className="hologram-ui__glow" />
        <div className="hologram-ui__header">
          <span className="hologram-ui__icon">{icon}</span>
          <h3 className="hologram-ui__title">{title}</h3>
          <button className="hologram-ui__close" onClick={onClose}>×</button>
        </div>
        <div className="hologram-ui__body">
          <p className="hologram-ui__desc">{description}</p>
        </div>
        <div className="hologram-ui__footer">
          <div className="hologram-ui__line" />
          <span className="hologram-ui__tag">SCANNING... 100%</span>
        </div>
      </div>
    </Html>
  );
}
