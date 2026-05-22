#!/usr/bin/env node
// Generates PWA icons as PNG using pure Node.js (sharp or canvas not needed)
// We embed minimal PNG data (dark bg + bars + arrow)

const fs = require('fs')
const path = require('path')

// Minimal valid 1x1 transparent PNG base64
// We'll create actual SVG and note it needs to be converted
// For now generate placeholder solid-color PNGs using raw PNG binary

function createSimplePNG(size, bgColor) {
  // Use a simple approach: write SVG to public folder for reference
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#0a0a0a" rx="${size * 0.2}"/>
  <!-- bars -->
  <rect x="${size*0.15}" y="${size*0.6}" width="${size*0.12}" height="${size*0.25}" fill="#1a1a1a" rx="3"/>
  <rect x="${size*0.32}" y="${size*0.45}" width="${size*0.12}" height="${size*0.4}" fill="#1a1a1a" rx="3"/>
  <rect x="${size*0.49}" y="${size*0.3}" width="${size*0.12}" height="${size*0.55}" fill="#10b981" rx="3"/>
  <rect x="${size*0.66}" y="${size*0.15}" width="${size*0.12}" height="${size*0.7}" fill="#10b981" rx="3"/>
  <!-- arrow up -->
  <polyline points="${size*0.72},${size*0.08} ${size*0.85},${size*0.08} ${size*0.85},${size*0.21}" 
    fill="none" stroke="#10b981" stroke-width="${size*0.04}" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="${size*0.66}" y1="${size*0.15}" x2="${size*0.85}" y2="${size*0.08}" 
    stroke="#10b981" stroke-width="${size*0.04}" stroke-linecap="round"/>
</svg>`
  return svg
}

const iconsDir = path.join(__dirname, '../public/icons')
fs.mkdirSync(iconsDir, { recursive: true })

fs.writeFileSync(path.join(iconsDir, 'icon-192.svg'), createSimplePNG(192))
fs.writeFileSync(path.join(iconsDir, 'icon-512.svg'), createSimplePNG(512))

console.log('SVG icons generated. Convert to PNG if needed.')
