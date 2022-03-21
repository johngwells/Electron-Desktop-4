// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const fs = require('fs');
const electron = require('electron');
const { webFrame, ipcRenderer, shell, nativeImage, clipboard } = electron;

console.log(process.versions);

document.getElementById('talk').addEventListener('click', e => {
  ipcRenderer.send('channel1', 'Hello from main window!');
  let response = ipcRenderer.sendSync('sync-message', 'Hello from Sync');
  console.log(response);
});

ipcRenderer.on('channel1-response', (e, args) => {
  console.log(args);
});

ipcRenderer.on('mailbox', (e, args) => {
  console.log(args);
});

document.getElementById('showClipboardImage').addEventListener('click', e => {
  let image = clipboard.readImage();
  document.getElementById('cbImage').src = image.toDataURL();
})

document.getElementById('ask').addEventListener('click', e => {
  ipcRenderer.invoke('ask').then(answer => {
    console.log(answer);
  });
});

// ipcRenderer.on('answer', (e, args) => {
//   console.log(args);
// });

// open outside of app
document.getElementById('showSite').addEventListener('click', e => {
  shell.openExternal('https://google.com');
});

const splashPath = `${__dirname}/splash.png`;

document.getElementById('splash').addEventListener('click', e => {
  console.log(splashPath);
  shell.openPath(splashPath);
});

// file explorer
document.getElementById('showFile').addEventListener('click', e => {
  shell.showItemInFolder(splashPath);
});

document.getElementById('deleteFile').addEventListener('click', e => {
  shell.trashItem(splashPath);
});

// Native Image
const splash = nativeImage.createFromPath(`${__dirname}/splash.png`);
console.log(splash.getSize());

// Save image to desktop
const saveToDesktop = async (data, ext) => {
  let desktopPath = await ipcRenderer.invoke('image-path');
  fs.writeFile(`${desktopPath}/splash.${ext}`, data, () =>
    console.log('completed conversion')
  );
};
// Convert to jpg
document.getElementById('convertImage').addEventListener('click', e => {
  let jpgSplash = splash.toJPEG(100);
  saveToDesktop(jpgSplash, 'jpg');
});

document.getElementById('displayPreviewImage').addEventListener('click', () => {
  let width = splash.getSize().width / 4;
  let height = splash.getSize().height / 4;
  console.log({ width, height });

  let splashUrl = splash
    .resize({
      width: Math.round(width),
      height: Math.round(height)
    })
    .toDataURL();
  document.getElementById('preview').src = splashUrl;
});

let win;

document.getElementById('newWin').addEventListener('click', e => {
  win = window.open('https://google.com');
});
document.getElementById('zoomUp').addEventListener('click', e => {
  webFrame.setZoomLevel(webFrame.getZoomLevel() + 1);
});
document.getElementById('zoomDown').addEventListener('click', e => {
  webFrame.setZoomLevel(webFrame.getZoomLevel() - 1);
});
document.getElementById('zoomReset').addEventListener('click', e => {
  webFrame.setZoomLevel(1);
});

console.log(webFrame.getResourceUsage());
// progress bar
window.progress = document.getElementById('progress');
