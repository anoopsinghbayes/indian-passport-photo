const fs = require('fs');
const path = require('path');
const dist = path.resolve(__dirname, '..', 'dist', 'index.html');
const dest = path.resolve(__dirname, '..', 'dist', '404.html');
if (fs.existsSync(dist)) {
  fs.copyFileSync(dist, dest);
  console.log('Copied index.html to 404.html');
} else {
  console.error('Build output not found. Run npm run build first.');
  process.exit(1);
}