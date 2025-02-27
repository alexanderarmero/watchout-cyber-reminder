
const { spawn } = require('child_process');
const { createServer } = require('vite');
const electron = require('electron');
const path = require('path');
const fs = require('fs');

/**
 * @type {import('child_process').ChildProcessWithoutNullStreams | null}
 */
let electronProcess = null;

/**
 * Start Electron process and watch for changes
 */
async function startElectron() {
  if (electronProcess) {
    electronProcess.kill();
    electronProcess = null;
  }

  // Compile Electron TypeScript files
  const tsc = spawn('npx', ['tsc', '-p', 'electron/tsconfig.json'], {
    shell: true,
    stdio: 'inherit',
  });

  await new Promise((resolve) => {
    tsc.on('close', resolve);
  });

  // Start Electron
  electronProcess = spawn(electron, [path.join(__dirname, '../dist/electron/main.js')], {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'development',
    },
  });
}

/**
 * Start Vite dev server
 */
async function startVite() {
  const server = await createServer({
    configFile: path.join(__dirname, '../vite.config.ts'),
    server: {
      port: 8080
    }
  });

  await server.listen(8080);
  return server;
}

/**
 * Main function
 */
async function main() {
  // Ensure the dist/electron directory exists
  if (!fs.existsSync(path.join(__dirname, '../dist/electron'))) {
    fs.mkdirSync(path.join(__dirname, '../dist/electron'), { recursive: true });
  }

  // Start Vite dev server
  const viteServer = await startVite();
  console.log('Vite server started');

  // Start Electron and restart on changes
  await startElectron();
  console.log('Electron started');

  // Watch for changes in Electron files
  fs.watch(path.join(__dirname, '../electron'), { recursive: true }, async (eventType, filename) => {
    if (filename.endsWith('.ts')) {
      console.log(`Electron file changed: ${filename}`);
      await startElectron();
    }
  });

  // Close everything when terminated
  process.on('SIGINT', () => {
    viteServer.close();
    if (electronProcess) electronProcess.kill();
    process.exit();
  });
}

main().catch(console.error);
