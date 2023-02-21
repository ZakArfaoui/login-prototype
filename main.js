const electron = require("electron");
const url = require("url");
const path = require("path");
const firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");

const firebaseConfig = {
  // Your Firebase project credentials
};

firebase.initializeApp(firebaseConfig);

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

// Listen to the app when it's ready
app.on("ready", function () {
  // Create a window
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: false,
  });

  // Load the HTML file
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "./dist/mainWindow.html"),
      protocol: "file",
      slashes: true,
    })
  );
  // quit app when closed
  mainWindow.on("close", function () {
    app.quit();
  });
  // Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

  // Insert menu
  Menu.setApplicationMenu(mainMenu);
});

// Handle create add window
function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: "Add Shopping List Items",
  });

  // Load the HTML file
  addWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "./dist/addWindow.html"),
      protocol: "file",
      slashes: true,
    })
  );

  // Garbage collection
  addWindow.on("close", function () {
    addWindow = null;
  });
}

// catch item:add
ipcMain.on("item:add", function (e, item) {
  console.log(item);
  mainWindow.webContents.send("item:add", item);
  addWindow.close();
});

// Create a menu template
const mainMenuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Add Item",
        click() {
          createAddWindow();
        },
      },
      {
        label: "Clear Items",
        click() {
          // Add code to handle "Clear Items" here
        },
      },
      {
        label: "Quit",
        accelerator: process.platform == "darwin" ? "Command+Q" : "Ctrl+Q",
        click() {
          app.quit();
        },
      },
    ],
  },
];

// If on a Mac, add an empty object
if (process.platform == "darwin") {
  mainMenuTemplate.unshift({});
}

// Add developer tools if not in production
if (process.env.NODE_ENV !== "production") {
  mainMenuTemplate.push({
    label: "Developer Tools",
    submenu: [
      {
        label: "Toggle DevTools",
        accelerator: process.platform == "darwin" ? "Command+I" : "Ctrl+I",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
      },
      {
        role: "reload",
      },
    ],
  });
}
