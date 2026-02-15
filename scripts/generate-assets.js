
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '..', 'assets');

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir);
}

// 1x1 Pixel valid PNGs in base64 (Small placeholders to satisfy build requirements)
// These are valid PNG headers that the build system will recognize.
const smallPngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

const assets = [
  { name: 'icon.png', data: smallPngBase64 },
  { name: 'adaptive-icon.png', data: smallPngBase64 },
  { name: 'splash.png', data: smallPngBase64 },
  { name: 'favicon.png', data: smallPngBase64 }
];

assets.forEach(asset => {
  const filePath = path.join(assetsDir, asset.name);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, Buffer.from(asset.data, 'base64'));
    console.log(`Generated: assets/${asset.name}`);
  }
});
