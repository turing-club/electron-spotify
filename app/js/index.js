'use strict'
const { ipcRenderer } = require('electron');

document.getElementById('register').addEventListener('click', () => {
  ipcRenderer.send('open-register');
})

document.getElementById('login').addEventListener('click', () => {
  ipcRenderer.send('open-login');
})
