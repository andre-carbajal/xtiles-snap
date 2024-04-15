const { app, BrowserWindow, shell, session } = require("electron");
const { registerMenuHandling } = require("./menuBarHandling");

app.on("ready", () => {

  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders["User-Agent"] = "Chrome";
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });

  const win = new BrowserWindow({
    autoHideMenuBar: true,
    webPreferences: {
      spellcheck: false,
    },
  });
  win.maximize();

  session.defaultSession.setUserAgent("Chrome");

  win.loadURL("https://xtiles.app/user/login", { userAgent: "Chrome" });

  registerMenuHandling(win);

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith("https://xtiles.app")) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });
});
