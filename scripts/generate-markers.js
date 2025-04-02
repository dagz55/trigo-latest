const fs = require('fs');
const path = require('path');

const markers = {
  pickup: {
    color: '#22c55e', // green-500
    icon: `<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>`
  },
  dropoff: {
    color: '#ef4444', // red-500
    icon: `<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>`
  },
  terminal: {
    color: '#3b82f6', // blue-500
    icon: `<path d="M4 16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v8zm2-8h12v8H6V8zm1 3h10v2H7v-2z"/>`
  }
};

const generateMarkerSVG = (color, icon) => `
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="${color}">
  ${icon}
</svg>
`;

// Ensure the images directory exists
const imagesDir = path.join(process.cwd(), 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Generate marker icons
Object.entries(markers).forEach(([type, { color, icon }]) => {
  const svg = generateMarkerSVG(color, icon);
  fs.writeFileSync(path.join(imagesDir, `${type}-marker.svg`), svg);
  console.log(`Generated ${type}-marker.svg`);
}); 