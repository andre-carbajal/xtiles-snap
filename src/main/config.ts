import path from "node:path";

export const APP_URL = "https://xtiles.app";
export const LOGIN_PATH = "/user/login";
export const USER_AGENT = "Chrome";
export const MENU_SHORTCUT_KEY = "Alt+\\";

export function getIconPath(): string {
  return path.join(__dirname, "../../build/icons/icon.png");
}

export function getLoginUrl(): string {
  return `${APP_URL}${LOGIN_PATH}`;
}
