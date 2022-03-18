// Modules
const { app, BrowserWindow } = require('electron');
const colors = require('colors');

console.log(colors.rainbow('Hello World'));
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, secondaryWindow;

// Create a new BrowserWindow when `app` is ready
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    frame: false,
    webPreferences: {
      // --- !! IMPORTANT !! ---
      // Disable 'contextIsolation' to allow 'nodeIntegration'
      // 'contextIsolation' defaults to "true" as from Electron v12
      contextIsolation: false,
      nodeIntegration: true
    },
    backgroundColor: '#2B2E3B',
    titleBarStyle: 'hidden'
  });

  secondaryWindow = new BrowserWindow({
    width: 600,
    height: 300,
    webPreferences: {
      nodeIntegration: true
    },
    frame: false,
    parent: mainWindow,
    // modal: true,
    // show: false
  });

  // Load index.html into the new BrowserWindow
  mainWindow.loadFile('index.html');
  secondaryWindow.loadFile('secondary.html')

  // to see how a modal popup works. Should programmatically have an action for the user to close window
  /*
  setTimeout(() => {
    secondaryWindow.show();
    setTimeout(() => {
      secondaryWindow.close();
      secondaryWindow = null
    }, 1000)
  }, 1000)
  */

  // show after everything loads. this could add a delay. You could add bg color instead
  // mainWindow.once('ready-to-show', mainWindow.show);

  // Open DevTools - Remove for PRODUCTION!
  mainWindow.webContents.openDevTools();

  // Listen for window being closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  secondaryWindow.on('closed', () => {
    secondaryWindow = null;
  });
}

app.on('before-quit', e => {
  console.log('App is quiting');
  // you could use e.preventDefault()
  // to stop the app from quiting. Save users info etc
  // then quit the application
});

app.on('browser-window-blur', () => {
  console.log('you moved away from the app');
});

app.on('browser-window-focus', () => {
  console.log('You are using the app');
});

// Electron `app` is ready
// app.on('ready', () => {
//   createWindow;
//   console.log(app.getPath('desktop'));
//   console.log(app.getPath('music'));
//   console.log(app.getPath('temp'));
//   // userData should be the default location to store data for your app
//   console.log(app.getPath('userData'));
// });

app.on('ready', createWindow);

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
  if (mainWindow === null) createWindow();
});
