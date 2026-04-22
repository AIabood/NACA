/**
 * planets.js — Structured planetary data for Space Explorer
 * Scalable schema: add new planets by following the same object shape.
 */

export const PLANETS = [
  {
    id: "earth",
    name: "Earth",
    nickname: "The Blue Marble",
    type: "Terrestrial",
    texture: "/textures/earth.jpg",
    bumpMap: "/textures/earth_bump.jpg",
    specularMap: "/textures/earth_specular.jpg",
    cloudsTexture: "/textures/earth_clouds.png",
    normalMap: "/textures/earth_normal.jpg",
    radius: 2.5,          // scene units
    rotationSpeed: 0.001, // radians per frame
    axialTilt: 23.5,      // degrees
    color: "#4fa3e0",     // fallback color

    // ── Scientific Data ──────────────────────────────────────────
    stats: {
      distanceFromSun: "149.6 million km",
      orbitalPeriod:   "365.25 days",
      dayLength:       "24 hours",
      diameter:        "12,742 km",
      mass:            "5.972 × 10²⁴ kg",
      gravity:         "9.8 m/s²",
      temperature: {
        min:  "-88°C",
        avg:  "15°C",
        max:  "58°C",
      },
      moons:           1,
      atmosphere:      "78% Nitrogen, 21% Oxygen, 1% Other",
      magneticField:   true,
    },

    // ── UI Content ───────────────────────────────────────────────
    description:
      "Earth is the third planet from the Sun and the only known planet to harbor life. " +
      "Its surface is 71% water, giving it the iconic blue appearance visible from space.",

    facts: [
      "Earth is the densest planet in the Solar System.",
      "The Moon stabilizes Earth's axial tilt, regulating seasons.",
      "Earth's atmosphere protects life from harmful solar radiation.",
      "Earth completes one orbit around the Sun every 365.25 days.",
      "Plate tectonics constantly reshape Earth's surface.",
    ],

    tags: ["habitable", "water", "life", "atmosphere", "moon"],
  },
];

/** Helper: find a planet by its id */
export function getPlanetById(id) {
  return PLANETS.find((p) => p.id === id) ?? null;
}

export default PLANETS;
