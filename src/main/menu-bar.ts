import { BrowserWindow, globalShortcut, Menu, MenuItem } from "electron";

import { MENU_SHORTCUT_KEY } from "./config";

let isMenuOnAltBackslash = false;

function toggleMenuBar(window: BrowserWindow): void {
  const isMenuBarHidden = window.autoHideMenuBar;
  window.setAutoHideMenuBar(!isMenuBarHidden);
  window.setMenuBarVisibility(isMenuBarHidden);
}

function hideMenuBar(window: BrowserWindow): void {
  window.setAutoHideMenuBar(true);
  window.setMenuBarVisibility(false);
}

export function registerMenuHandling(window: BrowserWindow): void {
  const menuShortcutRegistered = globalShortcut.register(MENU_SHORTCUT_KEY, () => {
    toggleMenuBar(window);
  });

  if (!menuShortcutRegistered) {
    throw new Error("Failed to register global shortcut!");
  }

  window.webContents.on("before-input-event", (event, input) => {
    if (isMenuOnAltBackslash && input.alt) {
      event.preventDefault();
    }
  });

  const menu = Menu.getApplicationMenu();
  const windowMenu = menu?.items.find((item) => item.role === "windowMenu");

  if (windowMenu?.submenu) {
    windowMenu.submenu.insert(
      0,
      new MenuItem({
        label: `Open menu bar on ${MENU_SHORTCUT_KEY}`,
        type: "checkbox",
        checked: isMenuOnAltBackslash,
        click: () => {
          isMenuOnAltBackslash = !isMenuOnAltBackslash;
          hideMenuBar(window);
        },
      }),
    );
  }
}
