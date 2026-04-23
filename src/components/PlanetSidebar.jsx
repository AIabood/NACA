import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Info, Thermometer, Ruler, Orbit } from "lucide-react";

const PlanetSidebar = ({ planet, visible, onClose }) => {
  if (!planet) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          className="planet-info-sidebar"
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 120 }}
          style={{
            position: 'fixed',
            right: 24,
            top: 80,
            bottom: 24,
            width: 380,
            background: 'rgba(5, 10, 30, 0.85)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 24,
            padding: 32,
            zIndex: 1000,
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '2rem', margin: 0, fontWeight: 300 }}>{planet.name}</h2>
            <button 
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <p style={{ fontSize: '0.9rem', color: '#ccc', lineHeight: 1.6 }}>{planet.description}</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 16, background: 'rgba(255,255,255,0.05)', borderRadius: 12 }}>
                <Thermometer size={16} color="#4fa3e0" style={{ marginBottom: 8 }} />
                <div style={{ fontWeight: 700 }}>{planet.stats.temperature.avg}</div>
                <div style={{ fontSize: '0.7rem', color: '#888' }}>Avg. Temp</div>
              </div>
              <div style={{ padding: 16, background: 'rgba(255,255,255,0.05)', borderRadius: 12 }}>
                <Ruler size={16} color="#f5c842" style={{ marginBottom: 8 }} />
                <div style={{ fontWeight: 700 }}>{planet.stats.diameter}</div>
                <div style={{ fontSize: '0.7rem', color: '#888' }}>Diameter</div>
              </div>
            </div>

            <div style={{ padding: 20, background: 'rgba(79, 163, 224, 0.08)', border: '1px solid rgba(79, 163, 224, 0.2)', borderRadius: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <Info size={18} color="#4fa3e0" />
                <span style={{ fontWeight: 600 }}>Quick Facts</span>
              </div>
              <ul style={{ paddingLeft: 20, margin: 0, fontSize: '0.85rem', color: '#aaa', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {planet.facts.map((fact, index) => (
                  <li key={index}>{fact}</li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>Atmosphere</div>
              <div style={{ fontSize: '0.85rem', color: '#fff' }}>{planet.stats.atmosphere}</div>
            </div>
          </div>

          <div style={{ textAlign: 'center', fontSize: '0.7rem', color: '#555', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 16 }}>
            Press SPACE again to close
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PlanetSidebar;
