const { _electron: electron } = require('@playwright/test');
const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

test('launch app and verify title/url', async () => {
  test.setTimeout(60000); // 1 minute timeout
  // Determine the path to the executable or source
  let executablePath;
  const linuxPath = path.join(__dirname, '../dist/linux-unpacked/xTiles');
  const winPath = path.join(__dirname, '../dist/win-unpacked/xTiles.exe');

  if (fs.existsSync(linuxPath)) {
    executablePath = linuxPath;
  } else if (fs.existsSync(winPath)) {
    executablePath = winPath;
  }

  const launchOptions = {
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage'
    ]
  };

  let electronApp;
  try {
    if (executablePath) {
      console.log(`Testing compiled app at: ${executablePath}`);
      launchOptions.executablePath = executablePath;
      electronApp = await electron.launch(launchOptions);
    } else {
      console.log('Testing app from source (main.js)');
      launchOptions.args.push(path.join(__dirname, '../main.js'));
      electronApp = await electron.launch(launchOptions);
    }
  } catch (error) {
    console.error('Failed to launch Electron:', error);
    throw error;
  }

  // Wait for the first window to open
  console.log('Waiting for first window...');
  const window = await electronApp.firstWindow();
  
  // Verify the URL
  const url = await window.url();
  console.log(`Current window URL: ${url}`);
  expect(url).toContain('xtiles.app');
  expect(url).toContain('/user/login');

  // Verify the window title
  const title = await window.title();
  expect(title).toBeTruthy();

  // Close the app
  await electronApp.close();
});
