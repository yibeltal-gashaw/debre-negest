import { app, BrowserWindow } from 'electron';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { initDatabase } from './src/js/database.js';
// Setup __dirname workaround for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set custom cache directory
const cachePath = path.join(__dirname, 'assets/cache');
try {
  if (!fs.existsSync(cachePath)) {
    fs.mkdirSync(cachePath, { recursive: true });
    console.log('Created cache directory:', cachePath);
  }
  app.setPath('cache', cachePath);
  console.log('Cache path set to:', app.getPath('cache'));
} catch (err) {
  console.error('Failed to set up cache directory:', err.message);
}

// Disable Chromium cache
app.commandLine.appendSwitch


// Enable hot reload during development
// if (process.argv.includes('--hot-reload')) {
//   (async () => {
//     try {
//       const electronReload = await import('electron-reload');

//       // __dirname already set earlier using fileURLToPath
//       const { spawn } = await import('child_process');
//       const electronPath = path.join(__dirname, 'node_modules', '.bin', 'electron');

//       electronReload.default(__dirname, {
//         electron: electronPath,
//         hardResetMethod: 'exit',
//         ignored: /node_modules|[\/\\]\.|assets\/debre_negest\.db|assets\/db_backup|assets\/cache/
//       });

//       console.log('Hot reload enabled');
//     } catch (err) {
//       console.error('Failed to enable hot reload:', err);
//     }
//   })();
// }



let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true, // Hide the menu bar
    webPreferences: {
      preload: path.join(__dirname, 'src/js/preload.js'),
      contextIsolation: false,
      enableRemoteModule: false,
      nodeIntegration: true
    }
  });

  mainWindow.loadFile('src/views/index.html').catch(err => {
    console.error('Failed to load index.html:', err.message);
  });
  initDatabase();
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
