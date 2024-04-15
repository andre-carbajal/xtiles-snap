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
    webPreferences: {
      spellcheck: false,
    },
  };

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