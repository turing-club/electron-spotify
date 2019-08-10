'use strict'

document.getElementById('login').addEventListener('click', () => {
  ipcRenderer.send('open-login');
})

document.getElementById('register').addEventListener('click', () => {
  ipcRenderer.send('open-register');
})
