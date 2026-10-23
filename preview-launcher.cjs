'use strict';

// Launcher support only: no package installation, global PATH edits or process discovery/killing.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const net = require('node:net');
const {spawn, spawnSync} = require('node:child_process');

const project = __dirname;
const port = 3002;
const address = `http://localhost:${port}/`;
const next = path.join(project, 'node_modules', 'next', 'dist', 'bin', 'next');
const buildId = path.join(project, '.next', 'BUILD_ID');
const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

function getPage(hostname = '127.0.0.1') {
  return new Promise(resolve => {
    const request = http.get({hostname, port, path: '/', timeout: 2000}, response => {
      let html = '';
      response.setEncoding('utf8');
      response.on('data', chunk => {if (html.length < 1000000) html += chunk;});
      response.on('end', () => resolve(response.statusCode === 200 && html.includes('Avexium') && html.includes('id="reference-site"')));
      response.on('error', () => resolve(false));
    });
    request.on('timeout', () => request.destroy());
    request.on('error', () => resolve(false));
  });
}

function portAvailable(hostname) {
  return new Promise((resolve, reject) => {
    const probe = net.createServer();
    probe.once('error', error => {
      if (error.code === 'EADDRINUSE') resolve(false);
      else if (hostname === '::1' && ['EAFNOSUPPORT', 'EADDRNOTAVAIL'].includes(error.code)) resolve(true);
      else reject(error);
    });
    probe.listen(port, hostname, () => probe.close(() => resolve(true)));
  });
}

function openBrowser() {
  return new Promise(resolve => {
    const browser = spawn(process.env.ComSpec || 'C:\\Windows\\System32\\cmd.exe', ['/d', '/c', 'start', '""', address], {windowsHide: true, stdio: 'ignore'});
    browser.once('error', () => resolve(false));
    browser.once('exit', code => resolve(code === 0));
  });
}

async function main() {
  const [major, minor] = process.versions.node.split('.').map(Number);
  if (major < 20 || (major === 20 && minor < 9)) throw new Error('Node.js 20.9 or newer is required. This launcher will not replace your Node installation.');
  if (!fs.existsSync(next)) throw new Error('Next.js dependencies are missing. Restore this project\'s dependencies first; this launcher will not install or update shared packages.');

  const [ipv4Available, ipv6Available] = await Promise.all([portAvailable('127.0.0.1'), portAvailable('::1')]);
  const available = ipv4Available && ipv6Available;
  const occupiedAddresses = [];
  if (!ipv4Available) occupiedAddresses.push('127.0.0.1');
  if (!ipv6Available) occupiedAddresses.push('::1');
  // On Windows an address-specific probe can succeed beside a wildcard listener.
  // Check the actual page as well, so an existing preview is always reused.
  const existingPreview = await getPage('127.0.0.1') && (await Promise.all(occupiedAddresses.map(getPage))).every(Boolean);
  if (process.argv.includes('--check')) {
    console.log(JSON.stringify({project, node: process.execPath, nodeVersion: process.version, dependenciesPresent: true, productionBuildPresent: fs.existsSync(buildId), port, ipv4Available, ipv6Available, portAvailable: available, existingAvexiumPreview: existingPreview}, null, 2));
    if (!available && !existingPreview) throw new Error('Port 3002 belongs to another service. No process was stopped.');
    return;
  }

  if (existingPreview) {
    console.log('Avexium is already running. Opening the existing preview; no second server will be started.');
    if (!await openBrowser()) console.log(`Open this address manually: ${address}`);
    return;
  }
  if (!available) throw new Error('Port 3002 is already in use by another service. Close that service yourself or choose a different preview port. No process was stopped.');

  if (!fs.existsSync(buildId)) {
    console.log('Preparing the production preview. The first build can take a few minutes.');
    const result = spawnSync(process.execPath, [next, 'build', '--webpack'], {cwd: project, stdio: 'inherit', windowsHide: true});
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error('The production build failed or was interrupted. The browser was not opened.');
  }

  console.log(`Starting ${address}`);
  console.log('Waiting for the website to respond before opening your browser...');
  const server = spawn(process.execPath, [next, 'start', '--port', String(port), '--hostname', '127.0.0.1'], {cwd: project, stdio: 'inherit', windowsHide: true});
  let exited = false, requestedStop = false;
  const completion = new Promise(resolve => {
    server.once('error', error => {exited = true; console.error(error.message); resolve(1);});
    server.once('exit', (code, signal) => {exited = true; resolve(requestedStop || signal === 'SIGINT' ? 0 : code ?? 1);});
  });
  const stopOwnServer = () => {requestedStop = true; if (!exited) server.kill('SIGINT');};
  process.on('SIGINT', stopOwnServer);
  process.on('SIGTERM', stopOwnServer);

  try {
    let ready = false;
    const deadline = Date.now() + 60000;
    while (!exited && Date.now() < deadline) {
      if (await getPage()) {ready = true; break;}
      await sleep(400);
    }
    if (!ready) {
      if (!exited) stopOwnServer();
      await completion;
      throw new Error('The website did not become ready. Check the server output above. Only this launcher\'s own child server was stopped.');
    }
    console.log(`Preview ready: ${address}`);
    console.log(await openBrowser() ? 'Browser-open request sent. Keep this window open; use Ctrl+C to stop this preview.' : `Could not open the browser automatically. Open ${address} manually.`);
    const code = await completion;
    if (code !== 0) throw new Error(`The preview server stopped with exit code ${code}.`);
  } finally {
    process.removeListener('SIGINT', stopOwnServer);
    process.removeListener('SIGTERM', stopOwnServer);
  }
}

main().catch(error => {console.error(`\nPREVIEW ERROR: ${error.message}`); process.exitCode = 1;});
