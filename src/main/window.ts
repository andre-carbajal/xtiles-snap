import { BrowserWindow, shell } from "electron";

import { APP_URL, getIconPath, getLoginUrl, USER_AGENT } from "./config";

function isTrustedAppUrl(candidate: string): boolean {
  try {
    const requestedUrl = new URL(candidate);
    const trustedUrl = new URL(APP_URL);

    return (
      requestedUrl.protocol === trustedUrl.protocol &&
      requestedUrl.hostname === trustedUrl.hostname &&
      requestedUrl.port === trustedUrl.port
    );
  } catch {
    return false;
  }
}

export function createMainWindow(): BrowserWindow {
  const window = new BrowserWindow({
    title: "xTiles",
    autoHideMenuBar: true,
    icon: getIconPath(),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: false,
    },
  });

  if (process.env.CI !== "true") {
    window.maximize();
  }

  window.webContents.setWindowOpenHandler(({ url }) => {
    if (!isTrustedAppUrl(url)) {
      void shell.openExternal(url);
      return { action: "deny" };
    }

    return { action: "allow" };
  });

  void window.loadURL(getLoginUrl(), { userAgent: USER_AGENT });

  return window;
}
