const { _electron: electron } = require('@playwright/test');
const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

test('launch app and verify title/url', async () => {
  // Determine the path to the executable or source
  let executablePath;
  const linuxPath = path.join(__dirname, '../dist/linux-unpacked/xTiles');
  const winPath = path.join(__dirname, '../dist/win-unpacked/xTiles.exe');

  if (fs.existsSync(linuxPath)) {
    executablePath = linuxPath;
  } else if (fs.existsSync(winPath)) {
    executablePath = winPath;
  }

  let electronApp;
  if (executablePath) {
    console.log(`Testing compiled app at: ${executablePath}`);
    electronApp = await electron.launch({ executablePath });
  } else {
    console.log('Testing app from source (main.js)');
    electronApp = await electron.launch({ args: [path.join(__dirname, '../main.js')] });
  }

  // Wait for the first window to open
  const window = await electronApp.firstWindow();
  
  // Verify the URL
  const url = await window.url();
  expect(url).toContain('xtiles.app');
  expect(url).toContain('/user/login');

  // Verify the window title
  const title = await window.title();
  expect(title).toBeTruthy();

  // Close the app
  await electronApp.close();
});
