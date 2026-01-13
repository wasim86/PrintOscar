const sharp = require('sharp');
const path = require('path');

async function convert() {
  const inputPath = path.join(__dirname, '..', 'public', 'segishop-footer-logo.jpg');
  const outputPath = path.join(__dirname, '..', 'public', 'segishop-footer-logo.png');

  const input = sharp(inputPath);
  const meta = await input.metadata();
  const { width, height } = meta;

  const buf = await input.ensureAlpha().raw().toBuffer();

  // Create alpha by removing near-white pixels
  const threshold = 245;
  for (let i = 0; i < buf.length; i += 4) {
    const r = buf[i];
    const g = buf[i + 1];
    const b = buf[i + 2];
    const a = buf[i + 3];
    if (r >= threshold && g >= threshold && b >= threshold) {
      buf[i + 3] = 0; // transparent
    } else {
      buf[i + 3] = a > 0 ? a : 255; // opaque
    }
  }

  await sharp(buf, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(outputPath);

  console.log('Converted logo to transparent PNG:', outputPath);
}

convert().catch((err) => {
  console.error('Logo conversion failed:', err);
  process.exit(1);
});

