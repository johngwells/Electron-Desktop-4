// Modules
const { app, BrowserWindow } = require('electron');
const colors = require('colors');

console.log(colors.rainbow('Hello World'));
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Create a new BrowserWindow when `app` is ready
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      // --- !! IMPORTANT !! ---
      // Disable 'contextIsolation' to allow 'nodeIntegration'
      // 'contextIsolation' defaults to "true" as from Electron v12
      contextIsolation: false,
      nodeIntegration: true
    }
  });

  // Load index.html into the new BrowserWindow
  mainWindow.loadFile('index.html');

  // Open DevTools - Remove for PRODUCTION!
  mainWindow.webContents.openDevTools();

  // Listen for window being closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('before-quit', (e) => {
  console.log('App is quiting')
  // you could use e.preventDefault()
  // to stop the app from quiting. Save users info etc
  // then quit the application
});

app.on('browser-window-blur', () => {
  console.log('you moved away from the app')
})

app.on('browser-window-focus', () => {
  console.log('You are using the app')
})

// Electron `app` is ready
app.on('ready', () => {
  createWindow
  console.log(app.getPath('desktop'));
  console.log(app.getPath('music'));
  console.log(app.getPath('temp'));
  // userData should be the default location to store data for your app
  console.log(app.getPath('userData'));
});

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
  if (mainWindow === null) createWindow();
});
