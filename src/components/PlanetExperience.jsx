import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Award, ChevronRight, Compass } from "lucide-react";
import ExperienceScene from "../scenes/ExperienceScene";

export default function PlanetExperience({ 
  planet, 
  onExit, 
  discoveredHotspots = [], 
  onHotspotClick 
}) {
  const [activeCategory, setActiveCategory] = useState(planet.categories[0]);
  const [selectedHotspot, setSelectedHotspot] = useState(null);

  const discoveryProgress = useMemo(() => {
    if (!planet.hotspots) return 0;
    const discovered = planet.hotspots.filter(hs => discoveredHotspots.includes(hs.id)).length;
    return (discovered / planet.hotspots.length) * 100;
  }, [planet, discoveredHotspots]);

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    setSelectedHotspot(null);
  };

  const handleHotspotClick = (hs) => {
    setSelectedHotspot(hs);
    onHotspotClick?.(hs);
  };

  // Filter hotspots for the active category
  const activeHotspots = useMemo(() => {
    return planet.hotspots.filter(hs => hs.category === activeCategory.id || activeCategory.id === "overview");
  }, [planet.hotspots, activeCategory]);

  return (
    <motion.div 
      className="experience-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* ── 3D Scene ───────────────────────────────────── */}
      <ExperienceScene 
        planet={{ ...planet, hotspots: activeHotspots }} 
        onHotspotClick={handleHotspotClick}
        activeHotspotId={selectedHotspot?.id}
        activeCategory={activeCategory}
      />

      {/* ── UI Layer ───────────────────────────────────── */}
      <div className="ui-layer ui-layer--visible">
        
        {/* 1. Top Header */}
        <div style={{ position: "fixed", top: 30, left: 30, zIndex: 10 }}>
          <motion.h1 
            key={planet.name}
            initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            style={{ fontSize: "2.8rem", fontWeight: 800, margin: 0, color: "#fff", letterSpacing: "-0.02em" }}
          >
            {planet.name}
          </motion.h1>
          <div style={{ height: 2, width: 60, background: "#4fa3e0", margin: "8px 0" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="glass-panel" style={{ padding: "4px 12px", borderRadius: 20, fontSize: "0.75rem", fontWeight: 700, color: "#4fa3e0" }}>
              {Math.round(discoveryProgress)}% EXPLORED
            </div>
          </div>
        </div>

        {/* 2. Right Side Timeline Navigation */}
        <div style={{ position: "fixed", right: 40, top: "50%", transform: "translateY(-50%)", zIndex: 10, display: "flex", flexDirection: "column", gap: 20 }}>
          {planet.categories.map((cat, i) => (
            <TimelineItem 
              key={cat.id} 
              active={activeCategory.id === cat.id} 
              index={i} 
              label={cat.label} 
              onClick={() => handleCategorySelect(cat)} 
            />
          ))}
        </div>

        {/* 3. Left Side Information Panel (Progressive Disclosure) */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeCategory.id}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            className="glass-panel"
            style={{ position: "fixed", left: 40, top: "50%", transform: "translateY(-50%)", width: 350, padding: 32 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#4fa3e0", marginBottom: 12 }}>
              <Compass size={18} />
              <span style={{ fontSize: "0.8rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em" }}>Exploration Category</span>
            </div>
            <h2 style={{ fontSize: "2rem", margin: "0 0 16px 0", lineHeight: 1.1 }}>{activeCategory.title}</h2>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.7, fontSize: "0.95rem", marginBottom: 24 }}>
              {activeCategory.description}
            </p>
            
            {activeHotspots.length > 0 && (
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 20 }}>
                <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", fontWeight: 700 }}>AVAILABLE HOTSPOTS</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                  {activeHotspots.map(hs => (
                    <div key={hs.id} className="glass-panel" style={{ padding: "6px 12px", fontSize: "0.75rem", borderRadius: 10, display: "flex", alignItems: "center", gap: 6 }}>
                      {hs.icon} {hs.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* 4. Hotspot Detailed Popup */}
        <AnimatePresence>
          {selectedHotspot && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel"
              style={{ position: "fixed", bottom: 40, left: "50%", transform: "translateX(-50%)", width: 450, padding: 30, textAlign: "center", border: "1px solid #4fa3e0" }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: 15 }}>{selectedHotspot.icon}</div>
              <h3 style={{ fontSize: "1.6rem", margin: "0 0 10px 0" }}>{selectedHotspot.title}</h3>
              <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>{selectedHotspot.description}</p>
              <button 
                onClick={() => setSelectedHotspot(null)}
                style={{ marginTop: 24, background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: "8px 20px", borderRadius: 20, cursor: "pointer" }}
              >
                Continue Exploring
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 5. Exit Button */}
        <button 
          onClick={onExit}
          style={{ position: "fixed", top: 30, right: 30, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50%", width: 50, height: 50, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}
        >
          <X size={20} />
        </button>
      </div>
    </motion.div>
  );
}

function TimelineItem({ active, label, onClick, index }) {
  return (
    <div 
      onClick={onClick}
      style={{ display: "flex", alignItems: "center", gap: 20, cursor: "pointer", transition: "all 0.3s ease" }}
    >
      <motion.span 
        animate={{ opacity: active ? 1 : 0.4, x: active ? 0 : 5 }}
        style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: active ? "#4fa3e0" : "#fff", textAlign: "right", width: 100 }}
      >
        {label}
      </motion.span>
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <motion.div 
          animate={{ scale: active ? 1.5 : 1, backgroundColor: active ? "#4fa3e0" : "rgba(255,255,255,0.2)" }}
          style={{ width: 10, height: 10, borderRadius: "50%", zIndex: 2 }}
        />
        {active && (
          <motion.div 
            layoutId="active-ring"
            style={{ position: "absolute", width: 22, height: 22, borderRadius: "50%", border: "2px solid #4fa3e0", zIndex: 1 }}
          />
        )}
      </div>
    </div>
  );
}
