const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url');
const mode = process.argv[2]; //来自package.json
console.log(process.argv)


global.tips = '主进程的变量';
function createWindow() {

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    // frame: false,
    webPreferences: {
      // preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation:false,
      enableRemoteModule: true
    }
  })
  // win.setMenu(null)
  if (mode === 'dev') {
    win.loadURL("http://localhost:8888/")
    win.webContents.openDevTools()
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, './dist/index.html'),
      protocol: 'file:',
      slashes: true
    }))
    win.setMenu(null)
  }
}
app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
