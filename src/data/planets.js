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
      orbitalPeriod: "365.25 days",
      dayLength: "24 hours",
      diameter: "12,742 km",
      mass: "5.972 × 10²⁴ kg",
      gravity: "9.8 m/s²",
      temperature: {
        min: "-88°C",
        avg: "15°C",
        max: "58°C",
      },
      moons: 1,
      atmosphere: "78% Nitrogen, 21% Oxygen, 1% Other",
      magneticField: true,
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

    // ── Exploration Categories (Timeline) ────────────────────────
    categories: [
      { id: "overview", label: "Earth", title: "Global Overview", description: "The third planet from the Sun, our home is the only known world with life.", phi: 1.5, theta: 0 },
      { id: "atmosphere", label: "Atmosphere", title: "Gaseous Shield", description: "A protective layer of nitrogen and oxygen that makes life possible.", phi: 0.8, theta: 1.5 },
      { id: "oceans", label: "Oceans", title: "Water World", description: "71% of Earth's surface is covered by vast, deep oceans.", phi: 1.8, theta: 0.5 },
      { id: "life", label: "Life", title: "Biosphere", description: "A diverse ecosystem ranging from deep sea vents to high mountain peaks.", phi: 1.4, theta: -1.2 },
      { id: "structure", label: "Structure", title: "Core & Crust", description: "A dynamic planet with a solid crust, mantle, and molten core.", phi: 1.2, theta: 2.5 }
    ],

    // ── Detailed Hotspots ──────────────────────────────────────────
    hotspots: [
      {
        id: "ocean_deep",
        category: "oceans",
        label: "Pacific",
        title: "The Deep Blue",
        description: "The largest water body on Earth, regulating global climate.",
        phi: Math.PI / 2,
        theta: Math.PI / 4,
        icon: "🌊"
      },
      {
        id: "amazon",
        category: "life",
        label: "Amazon",
        title: "Lungs of the Planet",
        description: "The most biodiverse tropical rainforest in the world.",
        phi: Math.PI / 1.7,
        theta: -Math.PI / 2.5,
        icon: "🌿"
      }
    ]
  },
];

/** Helper: find a planet by its id */
export function getPlanetById(id) {
  return PLANETS.find((p) => p.id === id) ?? null;
}

export default PLANETS;
