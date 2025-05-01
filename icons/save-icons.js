const fs = require("fs");
const { createCanvas } = require("canvas");

function createIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  // Draw background
  ctx.fillStyle = "#2ecc71";
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, size * 0.15);
  ctx.fill();

  // Draw leaf emoji
  ctx.font = `${size * 0.6}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "white";
  ctx.fillText("🌱", size / 2, size / 2);

  return canvas.toBuffer("image/png");
}

// Generate icons of different sizes
[16, 48, 128].forEach((size) => {
  const buffer = createIcon(size);
  fs.writeFileSync(`icon${size}.png`, buffer);
});
