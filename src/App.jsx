import React, { useState, useEffect, Suspense } from "react";
import { useProgress }  from "@react-three/drei";

import SpaceScene  from "./scenes/SpaceScene";
import Navbar      from "./components/Navbar";
import PlanetInfo  from "./components/PlanetInfo";
import Loader      from "./components/Loader";
import { getPlanetById } from "./data/planets";

import "./styles/global.css";

/**
 * InnerLoader — reads R3F asset-load progress via useProgress.
 * Must live inside a component that is itself inside <Canvas> or
 * wrapped by the same Suspense boundary; here we keep it outside
 * the Canvas but inside the React tree so it can read the context.
 */
function ProgressLoader() {
  const { progress, active } = useProgress();
  if (!active && progress === 100) return null;
  return <Loader progress={progress} />;
}

export default function App() {
  const [showInfo,    setShowInfo]    = useState(false);
  const [activePlanet, setActivePlanet] = useState(null);
  const [isLoaded,    setIsLoaded]    = useState(false);

  // Fetch Earth data from the structured data file
  const earthData = getPlanetById("earth");

  // Simulate a minimum loading time so the loader isn't just a flash
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handlePlanetClick = () => {
    setActivePlanet(earthData);
    setShowInfo(true);
  };

  const handleCloseInfo = () => {
    setShowInfo(false);
    setActivePlanet(null);
  };

  return (
    <div className="app">
      {/* ── Loading screen ──────────────────────────────── */}
      {!isLoaded && <Loader progress={75} />}

      {/* ── 3D Canvas ───────────────────────────────────── */}
      <Suspense fallback={<Loader progress={30} />}>
        <SpaceScene
          earthData={earthData}
          onPlanetClick={handlePlanetClick}
        />
      </Suspense>

      {/* ── UI Overlay (only after load) ─────────────────── */}
      {isLoaded && (
        <>
          {/* Top navigation */}
          <Navbar activePlanet={activePlanet?.name} />

          {/* Info sidebar */}
          {showInfo && activePlanet && (
            <PlanetInfo planet={activePlanet} onClose={handleCloseInfo} />
          )}

          {/* Explore CTA button (hides when sidebar is open) */}
          <button
            id="btn-explore-earth"
            className={`btn-explore ${showInfo ? "btn-explore--hidden" : ""}`}
            onClick={handlePlanetClick}
            aria-label="Explore Earth — open planet information"
          >
            🌍 Explore Earth
          </button>

          {/* Bottom-left HUD hints */}
          <div className="hud" aria-label="Navigation hints">
            <div className="hud__badge">
              🖱️ <span>Drag</span> to rotate
            </div>
            <div className="hud__badge" style={{ animationDelay: "0.15s" }}>
              🔍 <span>Scroll</span> to zoom
            </div>
          </div>
        </>
      )}
    </div>
  );
}
