const { globalShortcut, Menu, MenuItem } = require("electron");

let isMenuOnAltBackslash = false;
const MENU_SHORTCUT_KEY = "Alt+\\";

function toggleMenuBar(win) {
  const isMenuBarVisible = win.autoHideMenuBar;
  win.setAutoHideMenuBar(!isMenuBarVisible);
  win.setMenuBarVisibility(isMenuBarVisible);
}

function hideMenuBar(win) {
  win.setAutoHideMenuBar(true);
  win.setMenuBarVisibility(false);
}

function registerMenuHandling(win) {
  const menuShortcut = globalShortcut.register(MENU_SHORTCUT_KEY, () => {
    toggleMenuBar(win);
  });

  if (!menuShortcut) {
    throw new Error("Failed to register global shortcut!");
  }

  win.webContents.on("before-input-event", (event, input) => {
    if (isMenuOnAltBackslash && input.alt) {
      event.preventDefault();
    }
  });

  const menu = Menu.getApplicationMenu();
  const windowMenu = menu.items?.find((el) => el.role === "windowmenu");
  if (windowMenu) {
    windowMenu.submenu.insert(0, new MenuItem({
      label: `Open menu bar on ${MENU_SHORTCUT_KEY}`,
      type: 'checkbox',
      checked: isMenuOnAltBackslash,
      click: () => {
        isMenuOnAltBackslash = !isMenuOnAltBackslash;
        hideMenuBar(win);
      }
    }));
  }
}

module.exports = { registerMenuHandling };