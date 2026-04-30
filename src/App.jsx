import React, { useState, useEffect, Suspense, useRef } from "react";
import { useProgress } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";

import SpaceScene from "./scenes/SpaceScene";
import ZoomHUD from "./components/ZoomHUD";
import HandTracker from "./components/HandTracker";
import PlanetSidebar from "./components/PlanetSidebar";
import PlanetExperience from "./components/PlanetExperience";
import TransitionOverlay from "./components/TransitionOverlay";
import { getPlanetById } from "./data/planets";

import "./styles/global.css";

export default function App() {
  const [showInfo, setShowInfo] = useState(false);
  const [activePlanet, setActivePlanet] = useState(null);
  const [focusedPlanet, setFocusedPlanet] = useState(null); // The planet currently in crosshair/proximity
  const [activeHotspot, setActiveHotspot] = useState(null);

  const [viewMode, setViewMode] = useState("galaxy"); // galaxy | experience
  const [transitioning, setTransitioning] = useState(false);
  const [discoveredHotspots, setDiscoveredHotspots] = useState([]);

  const [zoomLevel, setZoomLevel] = useState("medium");
  const [isFocused, setIsFocused] = useState(false);

  const cameraCtrlRef = useRef(null);
  const audioRef = useRef(null);

  const handlePlanetClick = (planet) => {
    if (!planet) return;
    setActivePlanet(planet);

    // Trigger immersive experience transition
    setTransitioning(true);
    setTimeout(() => {
      setViewMode("experience");
      setTransitioning(false);
    }, 800);
  };

  const handleExitExperience = () => {
    setTransitioning(true);
    setTimeout(() => {
      setViewMode("galaxy");
      setTransitioning(false);
      setShowInfo(false);
      setActivePlanet(null);
    }, 800);
  };

  const handleHotspotClick = (hotspot) => {
    setActiveHotspot(hotspot);
    if (hotspot && !discoveredHotspots.includes(hotspot.id)) {
      setDiscoveredHotspots((prev) => [...prev, hotspot.id]);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault();

        // Use focusedPlanet if available, otherwise fallback to activePlanet
        const target = focusedPlanet || activePlanet;

        if (viewMode === "galaxy" && target && !transitioning) {
          handlePlanetClick(target);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewMode, activePlanet, focusedPlanet, transitioning]);

  return (
    <div className="app">
      {/* ── Transition Overlay ─────────────────────────── */}
      <TransitionOverlay active={transitioning} />

      {/* ── 1. Galaxy View (Always mounted to preserve state) ── */}
      <div style={{
        visibility: viewMode === "galaxy" || transitioning ? "visible" : "hidden",
        position: "absolute",
        inset: 0
      }}>
        <Suspense fallback={null}>
          <SpaceScene
            onPlanetClick={handlePlanetClick}
            onPlanetFocus={setFocusedPlanet}
            onHotspotClick={handleHotspotClick}
            activeHotspot={activeHotspot}
            activePlanet={activePlanet}
            showInfo={showInfo}
            onZoomChange={(level) => setZoomLevel(level)}
            onFocusChange={(focused) => setIsFocused(focused)}
            controlsEnabled={viewMode === "galaxy" && !transitioning}
          />
        </Suspense>

        <div className={`ui-layer ${viewMode === "galaxy" ? "ui-layer--visible" : ""}`}>
          <ZoomHUD
            zoomLevel={zoomLevel}
            planet={focusedPlanet || activePlanet}
            isFocused={isFocused}
          />

          {/* Space Hint */}
          <AnimatePresence>
            {(focusedPlanet || activePlanet) && viewMode === "galaxy" && !transitioning && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                style={{
                  position: "fixed",
                  bottom: 40,
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 100,
                  pointerEvents: "none"
                }}
              >
                <div className="glass-panel" style={{ padding: "8px 24px", borderRadius: 40, display: "flex", alignItems: "center", gap: 12, border: "1px solid #4fa3e0" }}>
                  <div style={{ background: "#4fa3e0", color: "#fff", padding: "2px 8px", borderRadius: 4, fontFamily: "monospace", fontWeight: 700, fontSize: "0.8rem" }}>SPACE</div>
                  <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>ENTER {(focusedPlanet || activePlanet).name.toUpperCase()}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <PlanetSidebar
            planet={activePlanet}
            visible={showInfo}
            onClose={() => setShowInfo(false)}
          />
        </div>
      </div>

      {/* ── 2. Planet Experience View ── */}
      <AnimatePresence>
        {viewMode === "experience" && (
          <PlanetExperience
            planet={activePlanet}
            onExit={handleExitExperience}
            discoveredHotspots={discoveredHotspots}
            onHotspotClick={handleHotspotClick}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
