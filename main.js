// Modules
const electron = require('electron');
const {
  app,
  BrowserWindow,
  webContents,
  session,
  dialog,
  globalShortcut,
  Menu,
  MenuItem,
  Tray,
  screen
} = electron;

const menuItems = require('./main-menu');
const windowStateKeeper = require('electron-window-state');
const colors = require('colors');

console.log(colors.rainbow('Hello World'));
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, secondaryWindow, tray;

function createTray() {
  tray = new Tray('trayTemplate@2x.png');
  tray.setToolTip('App Details');

  // tray.on('click', e => {
  //   if (e.shiftKey) {
  //     app.quit();
  //   } else {
  //     mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  //   }
  // });

  // when using setContext it will ignore 'click so it's one or the other
  tray.setContextMenu(trayMenu);
}

let mainMenu = Menu.buildFromTemplate(menuItems);
let trayMenu = Menu.buildFromTemplate([
  {
    label: 'Item 1'
  },
  { role: 'quit' }
]);

// Create a new BrowserWindow when `app` is ready
function createWindow() {
  console.log(screen.getAllDisplays())
  createTray();
  // let customSes = session.fromPartition('persist:part1')
  // must add session: customSes in mainWindow options.
  // let sesCookie = session.defaultSession;
  let ses = session.defaultSession;

  let getCookies = () => {
    sesCookie.cookies
      .get({})
      .then(cookies => {
        console.log(cookies);
      })
      .catch(err => {
        console.log(err);
      });
  };

  let winState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 800
  });
  mainWindow = new BrowserWindow({
    width: winState.width,
    height: winState.height,
    x: winState.x,
    y: winState.y,
    minWidth: 600,
    minHeight: 480,
    frame: false,
    webPreferences: {
      // --- !! IMPORTANT !! ---
      // Disable 'contextIsolation' to allow 'nodeIntegration'
      // 'contextIsolation' defaults to "true" as from Electron v12
      contextIsolation: false,
      nodeIntegration: true,
      worldSafeExecuteJavaScript: true
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
    titleBarStyle: 'hidden',
    parent: mainWindow,
    partition: 'persist:letsgo'
    // modal: true,
    // show: false
  });

  Menu.setApplicationMenu(mainMenu);

  mainWindow.webContents.on('context-menu', e => {
    mainMenu.popup(mainWindow);
  });

  // Session: local storage & Cookies
  // let ses = mainWindow.webContents.session;
  let ses2 = secondaryWindow.webContents.session;
  let defaultSes = session.defaultSession;

  // console.log(ses.getUserAgent());
  // console.log(Object.is(ses, customSes));

  winState.manage(mainWindow);

  // Load index.html into the new BrowserWindow
  mainWindow.loadFile('index.html');
  secondaryWindow.loadFile('secondary.html');

  // comment out when using test cookies below
  // let cookie = {
  //   url: 'https://myappdomain.com',
  //   name: 'cookie',
  //   value: 'myCookie',
  //   expirationDate: 1679271122.326472
  // };
  // ses.cookies.set(cookie).then(() => {
  //   console.log('cookie set');
  //   getCookies();
  // });

  //  test cookies
  // mainWindow.webContents.on('did-finish-load', e => {
  //   getCookies();
  // });

  // remove cookie
  // sesCookie.cookies.remove('https://myappdomain.com', 'cookie').then(() => {
  //   console.log('cookie gone');
  //   getCookies();
  // });

  // User Auth
  // mainWindow.loadURL('https://httpbin.org/basic-auth/user/passwd');

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

  // Download
  ses.on('will-download', async (e, downloadItem, webContents) => {
    console.log('Start Downloading');
    let filename = downloadItem.getFilename();

    // let filesize = downloadItem.get
    // cant get fileSize from downloadItem.getTotalBytes

    let fileSize = 123079;
    console.log({ filename });
    console.log({ fileSize });

    // Save to desktop
    downloadItem.setSavePath(app.getPath('desktop') + `/${filename}`);

    downloadItem.on('updated', (e, state) => {
      let received = downloadItem.getReceivedBytes();
      console.log({ fileSize });
      console.log({ received });

      if (state === 'progressing' && received) {
        let value = Math.round((received / fileSize) * 100);
        webContents.executeJavaScript(`window.progress.value = ${value}`);
        console.log(value);
      }
    });
  });

  // webcontents
  let wc = mainWindow.webContents;

  wc.on('did-finish-load', () => {
    console.log('Content Fully Loaded');
  });

  wc.on('dom-ready', () => {
    console.log('DOM Ready');
  });

  wc.on('new-window', (e, url) => {
    e.preventDefault();
    console.log('Created new window');
  });

  // two events get logged keyDown & keyUp and the key pressed
  wc.on('before-input-event', (e, input) => {
    console.log(`${input.key} : ${input.type}`);
  });

  wc.on('media-started-playing', () => {
    console.log('media playing');
  });

  wc.on('media-paused', () => {
    console.log('media paused');
  });

  // Right clicking with context-menu
  // wc.on('context-menu', (e, params) => {
  //   console.log(
  //     `Context menu opened on: ${params.mediaType} at x:${params.x} y:${params.y}`
  //   );
  //   console.log(`User selected text: ${params.selectionText}`);
  //   console.log(`Selection can be copied ${params.editFlags.canCopy}`);

  //   let selectedText = params.selectionText;
  //   wc.executeJavaScript(`alert('${selectedText}')`);
  // });

  /* User Auth
  wc.on('login', (e, request, authInfo, callback) => {
    console.log('loggin in');
    callback('user', 'passwd');
  });

  wc.on('did-navigate', (e, url, statusCode, message) => {
    console.log(`Navigated to ${url}`);
    console.log(statusCode);
  });
  */

  mainWindow.webContents.on('did-finish-load', () => {
    // mult select
    // dialog
    //   .showOpenDialog({
    //     buttonLabel: 'Select a photo',
    //     defaultPath: app.getPath('desktop'),
    //     properties: [
    //       'multiSelections',
    //       'createDirectory',
    //       'openFile',
    //       'openDirectory'
    //     ]
    //   })
    //   .then(result => {
    //     console.log(result);
    //   });
    // show the save path
    // dialog
    //   .showSaveDialog({}).then(result => {
    //     console.log(result)
    //   })
    // options message box
    // const answers = ['Yes', 'No', 'Maybe'];
    // dialog.showMessageBox({
    //   title: 'Message Box',
    //   message: 'Please select an option',
    //   detail: 'Message details',
    //   buttons: answers
    // }).then(result => {
    //   console.log(`User selected: ${answers[result.response]}`)
    // })
  });

  // Open DevTools - Remove for PRODUCTION!
  mainWindow.webContents.openDevTools();

  globalShortcut.register('CommandOrControl+G', () => {
    console.log('User pressed G');
  });

  electron.powerMonitor.on('suspend', e => {
    console.log('Save data before going to sleep')
  })

  electron.powerMonitor.on('resume', e => {
    if (!mainWindow) {
      createWindow();
    }
  })

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
