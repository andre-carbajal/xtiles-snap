const { app, BrowserWindow, shell, session } = require("electron");
const { registerMenuHandling } = require("./menuBarHandling");

const USER_AGENT = "Chrome";
const URL = "https://xtiles.app";

app.on("ready", () => {

  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders["User-Agent"] = USER_AGENT;
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });

  const windowOptions = {
    autoHideMenuBar: true,
    icon: __dirname + "/build/icons/icon.png",
    webPreferences: {
      spellcheck: false,
    },
  };

  if (process.platform === "darwin") {
    app.dock.setIcon(__dirname + "/build/icons/icon.png");
  }

  const win = new BrowserWindow(windowOptions);
  win.maximize();

  session.defaultSession.setUserAgent(USER_AGENT);

  win.loadURL(`${URL}/user/login`, { userAgent: USER_AGENT });

  registerMenuHandling(win);

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith(URL)) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });
});