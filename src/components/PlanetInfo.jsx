import React, { useState } from "react";
import "../styles/global.css";

/**
 * PlanetInfo — animated slide-in sidebar with three tabbed sections.
 *
 * @param {{ planet: object, visible: boolean, onClose: () => void }} props
 */
export default function PlanetInfo({ planet, visible, onClose }) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!planet) return null;

  const { name, nickname, type, description, stats, facts, tags } = planet;

  return (
    <aside
      className={`planet-info ${visible ? "planet-info--open" : "planet-info--closed"}`}
      id="planet-info-panel"
      role="complementary"
      aria-label={`Information about ${name}`}
    >
      {/* ── Glow bar at top ─────────────────────────────── */}
      <div className="planet-info__glow-bar" aria-hidden="true" />

      {/* ── Header ──────────────────────────────────────── */}
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

      {/* ── Type badge ──────────────────────────────────── */}
      <span className="planet-info__type-badge">{type} Planet</span>

      {/* ── Tabs ────────────────────────────────────────── */}
      <div className="planet-info__tabs" role="tablist" aria-label="Planet information sections">
        {["overview", "stats", "facts"].map((tab) => (
          <button
            key={tab}
            id={`tab-${tab}`}
            role="tab"
            aria-selected={activeTab === tab}
            aria-controls={`panel-${tab}`}
            className={`planet-info__tab ${activeTab === tab ? "planet-info__tab--active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "overview" && "🌍 "}
            {tab === "stats"    && "📊 "}
            {tab === "facts"    && "💡 "}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* ── Tab Panels ──────────────────────────────────── */}
      <div className="planet-info__body">

        {/* Overview */}
        {activeTab === "overview" && (
          <div id="panel-overview" role="tabpanel" aria-labelledby="tab-overview">
            <p className="planet-info__description">{description}</p>

            <h3 className="planet-info__section-title">Quick Stats</h3>
            <div className="planet-info__quick-stats">
              <StatChip label="Distance from Sun" value={stats.distanceFromSun} icon="☀️" />
              <StatChip label="Day Length"         value={stats.dayLength}        icon="🕐" />
              <StatChip label="Moons"              value={stats.moons}            icon="🌙" />
              <StatChip label="Avg Temperature"    value={stats.temperature.avg}  icon="🌡️" />
            </div>

            <h3 className="planet-info__section-title">Tags</h3>
            <div className="planet-info__tags">
              {tags.map((tag) => (
                <span key={tag} className="planet-info__tag">#{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        {activeTab === "stats" && (
          <div id="panel-stats" role="tabpanel" aria-labelledby="tab-stats">
            <table className="planet-info__table" aria-label="Planet statistics">
              <tbody>
                <TableRow label="Diameter"        value={stats.diameter} />
                <TableRow label="Mass"            value={stats.mass} />
                <TableRow label="Gravity"         value={stats.gravity} />
                <TableRow label="Orbital Period"  value={stats.orbitalPeriod} />
                <TableRow label="Day Length"      value={stats.dayLength} />
                <TableRow label="Axial Tilt"      value={`${planet.axialTilt}°`} />
                <TableRow label="Min Temp"        value={stats.temperature.min} />
                <TableRow label="Avg Temp"        value={stats.temperature.avg} />
                <TableRow label="Max Temp"        value={stats.temperature.max} />
                <TableRow label="Atmosphere"      value={stats.atmosphere} />
                <TableRow label="Magnetic Field"  value={stats.magneticField ? "Yes ✓" : "No"} />
                <TableRow label="Moons"           value={stats.moons} />
              </tbody>
            </table>
          </div>
        )}

        {/* Facts */}
        {activeTab === "facts" && (
          <div id="panel-facts" role="tabpanel" aria-labelledby="tab-facts">
            <ul className="planet-info__facts" aria-label="Interesting facts">
              {facts.map((fact, i) => (
                <li key={i} className="planet-info__fact">
                  <span className="planet-info__fact-num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p>{fact}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ── Footer hint ─────────────────────────────────── */}
      <footer className="planet-info__footer">
        🖱️ Drag to rotate &nbsp;·&nbsp; Scroll to zoom
      </footer>
    </aside>
  );
}

/* ── Internal mini-components ──────────────────────────────── */

function StatChip({ label, value, icon }) {
  return (
    <div className="stat-chip" role="listitem">
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
