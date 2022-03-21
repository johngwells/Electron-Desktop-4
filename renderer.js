// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const electron = require('electron');
const { webFrame, ipcRenderer } = electron;

document.getElementById('talk').addEventListener('click', e => {
  ipcRenderer.send('channel1', 'Hello from main window!');
  let response = ipcRenderer.sendSync('sync-message', 'Hello from Sync');
  console.log(response)
});

ipcRenderer.on('channel1-response', (e, args) => {
  console.log(args);
});

ipcRenderer.on('mailbox', (e, args) => {
  console.log(args)
});

let win;

const newWin = () => {
  win = window.open('https://google.com');
};
const zoomUp = () => {
  webFrame.setZoomLevel(webFrame.getZoomLevel() + 1);
};
const zoomDown = () => {
  webFrame.setZoomLevel(webFrame.getZoomLevel() - 1);
};
const zoomReset = () => {
  webFrame.setZoomLevel(1);
};
console.log(webFrame.getResourceUsage());
// progress bar
window.progress = document.getElementById('progress');
