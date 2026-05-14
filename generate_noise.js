const fs = require('fs');
const { createCanvas } = require('canvas');

const size = 200;
const canvas = createCanvas(size, size);
const ctx = canvas.getContext('2d');

const imageData = ctx.createImageData(size, size);
const data = imageData.data;

for (let i = 0; i < data.length; i += 4) {
  const val = Math.random() * 255;
  data[i] = val;     // R
  data[i + 1] = val; // G
  data[i + 2] = val; // B
  data[i + 3] = 20;  // Alpha (Low opacity for subtle grain)
}

ctx.putImageData(imageData, 0, 0);

const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('/Users/mac/Desktop/work/s2s/latejcreations/public/noise_grain.png', buffer);
console.log('Noise grain PNG generated successfully.');
