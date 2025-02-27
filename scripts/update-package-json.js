
const fs = require('fs');
const path = require('path');

// Read the current package.json
const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Add Electron-related scripts
const electronScripts = {
  "electron:dev": "node scripts/dev-electron.js",
  "electron:build": "npm run build && tsc -p electron/tsconfig.json && electron-builder",
  "electron:build:mac": "npm run build && tsc -p electron/tsconfig.json && electron-builder --mac",
  "electron:build:win": "npm run build && tsc -p electron/tsconfig.json && electron-builder --win",
  "electron:build:linux": "npm run build && tsc -p electron/tsconfig.json && electron-builder --linux"
};

// Update the scripts section
packageJson.scripts = {
  ...packageJson.scripts,
  ...electronScripts
};

// Add Electron main entry point
packageJson.main = 'dist/electron/main.js';

// Write the updated package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log('Package.json updated with Electron scripts');
