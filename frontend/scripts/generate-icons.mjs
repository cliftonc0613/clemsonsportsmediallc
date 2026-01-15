import sharp from 'sharp';
import { mkdir, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
const iconsDir = join(publicDir, 'icons');

// Icon sizes for PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// SVG template for the app icon - a modern "S" monogram with gradient
const createIconSvg = (size) => {
  const padding = Math.round(size * 0.15);
  const innerSize = size - padding * 2;
  const fontSize = Math.round(innerSize * 0.6);
  const centerX = size / 2;
  const centerY = size / 2;

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#0a0a0a"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366f1"/>
      <stop offset="100%" style="stop-color:#8b5cf6"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.2)}" fill="url(#bg)"/>
  <text x="${centerX}" y="${centerY + fontSize * 0.35}" font-family="system-ui, -apple-system, sans-serif" font-size="${fontSize}" font-weight="700" fill="url(#accent)" text-anchor="middle">S</text>
</svg>`;
};

// Maskable icon has a larger safe zone
const createMaskableIconSvg = (size) => {
  const safeZone = Math.round(size * 0.1);
  const innerSize = size - safeZone * 2;
  const fontSize = Math.round(innerSize * 0.5);
  const centerX = size / 2;
  const centerY = size / 2;

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#0a0a0a"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366f1"/>
      <stop offset="100%" style="stop-color:#8b5cf6"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#bg)"/>
  <text x="${centerX}" y="${centerY + fontSize * 0.35}" font-family="system-ui, -apple-system, sans-serif" font-size="${fontSize}" font-weight="700" fill="url(#accent)" text-anchor="middle">S</text>
</svg>`;
};

async function generateIcons() {
  // Ensure icons directory exists
  await mkdir(iconsDir, { recursive: true });

  console.log('Generating PWA icons...\n');

  // Generate regular icons
  for (const size of sizes) {
    const svg = createIconSvg(size);
    const filename = `icon-${size}x${size}.png`;
    const filepath = join(iconsDir, filename);

    await sharp(Buffer.from(svg))
      .png()
      .toFile(filepath);

    console.log(`Created: ${filename}`);
  }

  // Generate maskable icons
  const maskableSizes = [192, 512];
  for (const size of maskableSizes) {
    const svg = createMaskableIconSvg(size);
    const filename = `icon-maskable-${size}x${size}.png`;
    const filepath = join(iconsDir, filename);

    await sharp(Buffer.from(svg))
      .png()
      .toFile(filepath);

    console.log(`Created: ${filename} (maskable)`);
  }

  // Generate favicon
  const faviconSvg = createIconSvg(32);
  await sharp(Buffer.from(faviconSvg))
    .png()
    .toFile(join(publicDir, 'favicon.png'));
  console.log('\nCreated: favicon.png');

  // Also create ICO-compatible favicon
  const favicon16 = createIconSvg(16);
  await sharp(Buffer.from(favicon16))
    .png()
    .toFile(join(publicDir, 'favicon-16x16.png'));

  const favicon32 = createIconSvg(32);
  await sharp(Buffer.from(favicon32))
    .png()
    .toFile(join(publicDir, 'favicon-32x32.png'));

  console.log('Created: favicon-16x16.png, favicon-32x32.png');

  console.log('\nAll icons generated successfully!');
  console.log('\nNote: These are placeholder icons. Replace them with your actual brand icons for production.');
}

generateIcons().catch(console.error);
