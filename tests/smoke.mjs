import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { Builder, Capabilities } from "selenium-webdriver";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const binaryName = process.platform === "win32" ? "xtiles-snap.exe" : "xtiles-snap";
const binary = path.join(root, "src-tauri", "target", "debug", binaryName);
const driverPath = path.join(os.homedir(), ".cargo", "bin", "tauri-driver");

assert.ok(existsSync(binary), `Tauri binary not found: ${binary}`);
assert.ok(existsSync(driverPath), `tauri-driver not found: ${driverPath}`);

const tauriDriver = spawn(driverPath, [], { stdio: "inherit" });
let driver;

try {
  const capabilities = new Capabilities();
  capabilities.setBrowserName("wry");
  capabilities.set("tauri:options", { application: binary });

  driver = await new Builder()
    .usingServer("http://127.0.0.1:4444/")
    .withCapabilities(capabilities)
    .build();

  await driver.wait(async () => {
    const [title, url] = await Promise.all([driver.getTitle(), driver.getCurrentUrl()]);
    return title.length > 0 && url.startsWith("https://xtiles.app/user/login");
  }, 30000);
  assert.match(await driver.getTitle(), /.+/);
  assert.match(await driver.getCurrentUrl(), /^https:\/\/xtiles\.app\/user\/login/);
} finally {
  if (driver) {
    await driver.quit();
  }
  tauriDriver.kill();
}
