import React, { useState } from "react";
import "../styles/global.css";

/**
 * PlanetInfo — slide-in sidebar panel with planet data
 * @param {{ planet: object, onClose: () => void }} props
 */
export default function PlanetInfo({ planet, onClose }) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!planet) return null;

  const { name, nickname, type, description, stats, facts, tags } = planet;

  return (
    <aside
      className="planet-info"
      id="planet-info-panel"
      aria-label={`Information about ${name}`}
    >
      {/* Header */}
      <div className="planet-info__header">
        <div>
          <h2 className="planet-info__name">{name}</h2>
          <p className="planet-info__nickname">{nickname}</p>
        </div>
        <button
          id="btn-close-planet-info"
          className="planet-info__close"
          onClick={onClose}
          aria-label="Close planet information panel"
        >
          ✕
        </button>
      </div>

      {/* Type badge */}
      <span className="planet-info__type-badge">{type} Planet</span>

      {/* Tabs */}
      <div className="planet-info__tabs" role="tablist">
        {["overview", "stats", "facts"].map((tab) => (
          <button
            key={tab}
            id={`tab-${tab}`}
            role="tab"
            aria-selected={activeTab === tab}
            className={`planet-info__tab ${activeTab === tab ? "planet-info__tab--active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      <div className="planet-info__body">

        {/* Overview */}
        {activeTab === "overview" && (
          <div role="tabpanel" aria-labelledby="tab-overview">
            <p className="planet-info__description">{description}</p>

            <div className="planet-info__quick-stats">
              <StatChip label="Distance from Sun" value={stats.distanceFromSun} icon="☀️" />
              <StatChip label="Day Length"         value={stats.dayLength}        icon="🕐" />
              <StatChip label="Moons"              value={stats.moons}            icon="🌙" />
              <StatChip label="Avg Temp"           value={stats.temperature.avg}  icon="🌡️" />
            </div>

            {/* Tags */}
            <div className="planet-info__tags">
              {tags.map((tag) => (
                <span key={tag} className="planet-info__tag">#{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        {activeTab === "stats" && (
          <div role="tabpanel" aria-labelledby="tab-stats">
            <table className="planet-info__table">
              <tbody>
                <TableRow label="Diameter"          value={stats.diameter} />
                <TableRow label="Mass"              value={stats.mass} />
                <TableRow label="Gravity"           value={stats.gravity} />
                <TableRow label="Orbital Period"    value={stats.orbitalPeriod} />
                <TableRow label="Day Length"        value={stats.dayLength} />
                <TableRow label="Axial Tilt"        value={`${planet.axialTilt}°`} />
                <TableRow label="Min Temperature"   value={stats.temperature.min} />
                <TableRow label="Avg Temperature"   value={stats.temperature.avg} />
                <TableRow label="Max Temperature"   value={stats.temperature.max} />
                <TableRow label="Atmosphere"        value={stats.atmosphere} />
                <TableRow label="Magnetic Field"    value={stats.magneticField ? "Yes" : "No"} />
                <TableRow label="Moons"             value={stats.moons} />
              </tbody>
            </table>
          </div>
        )}

        {/* Facts */}
        {activeTab === "facts" && (
          <div role="tabpanel" aria-labelledby="tab-facts">
            <ul className="planet-info__facts">
              {facts.map((fact, i) => (
                <li key={i} className="planet-info__fact">
                  <span className="planet-info__fact-num">{String(i + 1).padStart(2, "0")}</span>
                  <p>{fact}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer hint */}
      <p className="planet-info__hint">
        🖱️ Drag to rotate  · Scroll to zoom
      </p>
    </aside>
  );
}

/* ── Internal mini-components ───────────────────────────────────── */

function StatChip({ label, value, icon }) {
  return (
    <div className="stat-chip">
      <span className="stat-chip__icon" aria-hidden="true">{icon}</span>
      <div>
        <p className="stat-chip__value">{value}</p>
        <p className="stat-chip__label">{label}</p>
      </div>
    </div>
  );
}

function TableRow({ label, value }) {
  return (
    <tr className="planet-info__row">
      <td className="planet-info__cell planet-info__cell--label">{label}</td>
      <td className="planet-info__cell planet-info__cell--value">{value}</td>
    </tr>
  );
}
