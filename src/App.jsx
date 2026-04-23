import React, { useState, useEffect, Suspense, useRef } from "react";
import { useProgress } from "@react-three/drei";

import SpaceScene from "./scenes/SpaceScene";
import ZoomHUD from "./components/ZoomHUD";
import HandTracker from "./components/HandTracker";
import PlanetSidebar from "./components/PlanetSidebar";
import { getPlanetById } from "./data/planets";

import "./styles/global.css";

export default function App() {
  const [showInfo, setShowInfo] = useState(false);
  const [activePlanet, setActivePlanet] = useState(null);
  const [activeHotspot, setActiveHotspot] = useState(null);

  const [zoomLevel, setZoomLevel] = useState("medium");
  const [isFocused, setIsFocused] = useState(false);

  const cameraCtrlRef = useRef(null);
  const audioRef = useRef(null);

  const handlePlanetClick = (planet) => {
    setActivePlanet(planet);
    setShowInfo(true);
  };

  const handleHotspotClick = (hotspot) => {
    setActiveHotspot(hotspot);
    if (hotspot) {
      setShowInfo(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (activePlanet) {
          setShowInfo((prev) => !prev);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePlanet]);

  return (
    <div className="app">
      {/* ── 3D Canvas ───────────────────────────────────── */}
      <Suspense fallback={null}>
        <SpaceScene
          onPlanetClick={handlePlanetClick}
          onHotspotClick={handleHotspotClick}
          activeHotspot={activeHotspot}
          activePlanet={activePlanet}
          showInfo={showInfo}
          onZoomChange={(level) => setZoomLevel(level)}
          onFocusChange={(focused) => setIsFocused(focused)}
        />
      </Suspense>

      {/* ── UI Overlay (Always visible) ─────────────────── */}
      <div className="ui-layer ui-layer--visible">
        <PlanetSidebar 
          planet={activePlanet} 
          visible={showInfo} 
          onClose={() => setShowInfo(false)} 
        />
      </div>
    </div>
  );
}
