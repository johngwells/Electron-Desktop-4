module.exports = [
  {
    label: 'Electron',
    submenu: [
      { label: 'Item 1' },
      { label: 'Item 2', submenu: [{ label: 'Item 2 sub' }] }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { role: 'copy' },
      { role: 'paste' }
    ]
  },
  {
    label: 'Actions',
    submenu: [
      {
        label: 'action 1',
        click: () => {
          console.log('Hello World');
        },
        accelerator: 'Shift+G'
      }
    ]
  }
];
