import { app, session } from "electron";

import { getIconPath, USER_AGENT } from "./config";
import { registerMenuHandling } from "./menu-bar";
import { createMainWindow } from "./window";

function configureSession(): void {
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders["User-Agent"] = USER_AGENT;
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });

  session.defaultSession.setUserAgent(USER_AGENT);
}

app.on("ready", () => {
  configureSession();

  if (process.platform === "darwin" && app.dock) {
    app.dock.setIcon(getIconPath());
  }

  const window = createMainWindow();
  registerMenuHandling(window);
});
