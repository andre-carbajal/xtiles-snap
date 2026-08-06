import { _electron as electron, expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

test("launch app and verify title/url", async () => {
  test.setTimeout(60000);

  const linuxPath = path.join(__dirname, "../release/linux-unpacked/xtiles-snap");
  const windowsPath = path.join(__dirname, "../release/win-unpacked/xtiles-snap.exe");
  const packagedPath = process.platform === "linux"
    ? linuxPath
    : process.platform === "win32"
      ? windowsPath
      : undefined;
  const executablePath = packagedPath && fs.existsSync(packagedPath)
    ? packagedPath
    : undefined;

  const launchOptions: Parameters<typeof electron.launch>[0] = {
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
    ],
  };

  if (executablePath) {
    console.log(`Testing compiled app at: ${executablePath}`);
    launchOptions.executablePath = executablePath;
  } else {
    console.log("Testing app from compiled source (dist/main/index.js)");
    launchOptions.args?.push(path.join(__dirname, "../dist/main/index.js"));
  }

  const electronApp = await electron.launch(launchOptions);

  try {
    console.log("Waiting for first window...");
    const window = await electronApp.firstWindow();

    const url = await window.url();
    console.log(`Current window URL: ${url}`);
    expect(url).toContain("xtiles.app");
    expect(url).toContain("/user/login");

    await expect(window).toHaveTitle(/.+/, { timeout: 30000 });
    const title = await window.title();
    expect(title).toBeTruthy();
  } finally {
    await electronApp.close();
  }
});
