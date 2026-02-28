import puppeteer from 'puppeteer';
import { preview } from 'vite';

async function takeScreenshots() {
  const server = await preview({ preview: { port: 4174, open: false } });
  const url = 'http://localhost:4174';

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  // Desktop (Start Menu closed)
  await page.goto(url, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'docs/screenshots/desktop.png' });
  console.log('✓ desktop.png');

  // Start Menu open
  const startButton = await page.$('button[aria-label="Start"]');
  if (startButton) {
    await startButton.click();
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: 'docs/screenshots/start-menu.png' });
    console.log('✓ start-menu.png');

    // Close start menu
    await startButton.click();
    await new Promise(r => setTimeout(r, 300));
  }

  // Taskbar close-up
  await page.screenshot({
    path: 'docs/screenshots/taskbar.png',
    clip: { x: 0, y: 1080 - 80, width: 1920, height: 80 },
  });
  console.log('✓ taskbar.png');

  // This PC window — double-click the "This PC" icon
  const thisPcIcon = await page.evaluateHandle(() => {
    const spans = [...document.querySelectorAll('span')];
    return spans.find(s => s.textContent === 'This PC')?.closest('div');
  });
  if (thisPcIcon) {
    const box = await thisPcIcon.boundingBox();
    if (box) {
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2, { count: 2 });
      await new Promise(r => setTimeout(r, 500));
      await page.screenshot({ path: 'docs/screenshots/this-pc-window.png' });
      console.log('✓ this-pc-window.png');
    }
  }

  await browser.close();
  server.httpServer.close();
  console.log('\nAll screenshots saved to docs/screenshots/');
}

takeScreenshots().catch(e => { console.error(e); process.exit(1); });
