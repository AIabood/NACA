/**
 * download-textures.mjs
 * Run once with: node download-textures.mjs
 * Downloads NASA/public-domain Earth textures for the 3D scene.
 */

import { createWriteStream, mkdirSync, existsSync } from "fs";
import { get }  from "https";
import { join } from "path";

const DIR = "./public/textures";
if (!existsSync(DIR)) mkdirSync(DIR, { recursive: true });

// ── Texture sources (free / public domain) ──────────────────────────
const TEXTURES = [
  {
    name: "earth.jpg",
    url:  "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg",
  },
  {
    name: "earth_bump.jpg",
    url:  "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg",
  },
  {
    name: "earth_specular.jpg",
    url:  "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg",
  },
  {
    name: "earth_clouds.png",
    url:  "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png",
  },
  {
    name: "earth_normal.jpg",
    url:  "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg",
  },
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    if (existsSync(dest)) {
      console.log(`✓ Already exists: ${dest}`);
      return resolve();
    }
    const file = createWriteStream(dest);
    get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on("finish", () => { file.close(); console.log(`✅ Downloaded: ${dest}`); resolve(); });
    }).on("error", (err) => {
      file.close();
      reject(err);
    });
  });
}

for (const { name, url } of TEXTURES) {
  await download(url, join(DIR, name)).catch((e) => console.error(`❌ Failed: ${name}`, e.message));
}

console.log("\n🚀 All textures ready! Run: npm run dev");
