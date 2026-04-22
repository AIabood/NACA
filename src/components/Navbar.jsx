import React from "react";
import "../styles/global.css";

/**
 * Navbar — top navigation bar
 * @param {{ activePlanet: string }} props
 */
export default function Navbar({ activePlanet }) {
  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      {/* Brand */}
      <div className="navbar__brand">
        <span className="navbar__logo" aria-hidden="true">🚀</span>
        <span className="navbar__title">Space<strong>Explorer</strong></span>
      </div>

      {/* Centre — current view label */}
      {activePlanet && (
        <div className="navbar__center" aria-live="polite">
          <span className="navbar__breadcrumb">Solar System</span>
          <span className="navbar__sep" aria-hidden="true">›</span>
          <span className="navbar__active-planet">{activePlanet}</span>
        </div>
      )}

      {/* Right controls */}
      <div className="navbar__actions">
        <button
          id="btn-help"
          className="navbar__btn"
          title="How to navigate"
          aria-label="Open navigation help"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </button>

        <a
          id="link-nasa"
          href="https://www.nasa.gov"
          target="_blank"
          rel="noopener noreferrer"
          className="navbar__btn navbar__btn--text"
          aria-label="Visit NASA website"
        >
          NASA.gov
        </a>
      </div>
    </nav>
  );
}
