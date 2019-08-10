// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');

// Use electron-reload that allows hot-reloading of browsers when changes are made
const electron = require('electron')
require('electron-reload')(__dirname);

app.commandLine.appendSwitch('no-verify-widevine-cdm');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile('app/index.html');

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// Set up Widevine (DRM engine required to play Spotify songs in Electron - Chrome has it by default but Electron does
// not, so we have to load it manually).
app.on('ready', () => {
  // Demonstrating with default session, but a custom session object can be used
  app.verifyWidevineCdm({
    session: BrowserWindow.defaultSession,
  });

  let registerWindow;
  let loginWindow;

  // Do other early initialization...
  ipcMain.on('open-register', () => {
    if(!registerWindow) {
      // open register window
      registerWindow = new BrowserWindow({
        width: 500,
        height: 700,
        parent: mainWindow,
        webPreferences: {
          preload: path.join(__dirname, 'preload.js'),
        }
      })
      registerWindow.loadFile('app/register.html');

      registerWindow.webContents.openDevTools();

      // cleanup
      registerWindow.on('closed', () => {
        registerWindow = null
      })
    }
  })

  ipcMain.on('open-login', () => {
    if(!loginWindow) {
      // open register window
      loginWindow = new BrowserWindow({
        width: 500,
        height: 700,
        parent: mainWindow,
        webPreferences: {
          preload: path.join(__dirname, 'preload.js'),
        }
      })
      loginWindow.loadFile('app/login.html');

      loginWindow.webContents.openDevTools();

      // cleanup
      loginWindow.on('closed', () => {
        loginWindow = null
      })
    }
  })

});

app.on('widevine-ready', (version, lastVersion) => {
  console.log(version);
  if (null !== lastVersion) {
    console.log('Widevine ' + version + ', upgraded from ' + lastVersion + ', is ready to be used!');
  } else {
    console.log('Widevine ' + version + ' is ready to be used!');
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
});

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
