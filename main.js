const path = require("path");
const {app, BrowserWindow, Menu, Tray} = require("electron");
const log = require("electron-log");
log.info("App starting...");


// Global reference of the window object.
let mainWindow = null;
let contextMenu = null;
let appTray = null;

let itemEnabled = true, itemChecked = false;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    "width": 800,
    "height": 600
  });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is going to be closed.
  mainWindow.on("close", function (event) {
    if (!app.isQuitting) {
      //Calling event.preventDefault() will cancel the close.
      event.preventDefault();
      mainWindow.hide();
    }
  });

  // Emitted when the window is closed.
  mainWindow.on("closed", function () {
    mainWindow = null
  });
}

function createTrayIcon() {
  contextMenu = Menu.buildFromTemplate([
    { id: "enabledTest", label: "Enabled test", type: "normal", enabled: itemEnabled, click: function (menuItem, browserWindow, event) {

    } },
    { id: "checkedTest", label: "Checked test", type: "checkbox", checked: itemChecked, click: function (menuItem, browserWindow, event) {
      itemEnabled = !itemEnabled;
      itemChecked = !itemChecked;
    } },
    { id: "exit", label: "Exit", type: "normal", enabled: true, click: function (menuItem, browserWindow, event) {
      app.quit();
    } }
  ]);

  appTray = new Tray(path.join(__dirname, "ressources/atom.ico"));
  appTray.setToolTip(app.getName() + " v" + app.getVersion());
  appTray.setContextMenu(contextMenu);
  appTray.on("click", function (event, bounds) {
    mainWindow.show();
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", function (launchInfo) {
  createWindow();
  createTrayIcon();
});

app.on('activate', function (event, hasVisibleWindows) {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

app.on("browser-window-created", function (event, window) {
  window.setMenu(null);
});

app.on("window-all-closed", function () {

});

app.on('before-quit', function (event) {
  app.isQuitting = true;
});
