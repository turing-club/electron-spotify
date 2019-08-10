// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }

})

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCxP5aXmO-KCwVAiOXpDQ_AGCOnFw6dgD0",
  authDomain: "tc-spotify.firebaseapp.com",
  databaseURL: "https://tc-spotify.firebaseio.com",
  projectId: "tc-spotify",
  storageBucket: "",
  messagingSenderId: "706399573396",
  appId: "1:706399573396:web:6c3260092d02308c"
};

const {
  ipcRenderer,
} = require('electron');
const remote = require('electron').remote;

// make global (disable node integration)
window.ipcRenderer = ipcRenderer;
window.remote = remote;
window.firebaseConfig = firebaseConfig;
