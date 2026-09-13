import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const assetsDir = path.resolve('public/decks/Classic_Lesson_04_Nitrogen_Cycle/assets');
const outputPath = path.resolve('public/decks/Classic_Lesson_04_Nitrogen_Cycle/slides/slide_05.png');

const bgB64 = (await fs.readFile(path.join(assetsDir, 'nitrogen_bg_clean.jpg'))).toString('base64');
const icon1B64 = (await fs.readFile(path.join(assetsDir, 'icon1.png'))).toString('base64');
const icon2B64 = (await fs.readFile(path.join(assetsDir, 'icon2.png'))).toString('base64');
const icon3B64 = (await fs.readFile(path.join(assetsDir, 'icon3.png'))).toString('base64');
const logoB64 = (await fs.readFile(path.join(assetsDir, 'gemini_logo.png'))).toString('base64');

const html = `
<!DOCTYPE html>
<html lang='en'>
<head>
<meta charset='utf-8'>
<link rel='preconnect' href='https://fonts.googleapis.com'>
<link rel='preconnect' href='https://fonts.gstatic.com' crossorigin>
<link href='https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap' rel='stylesheet'>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1376px;
    height: 768px;
    overflow: hidden;
    background: url('data:image/jpeg;base64,${bgB64}') no-repeat center center;
    background-size: 1376px 768px;
    font-family: 'Inter', -apple-system, sans-serif;
    color: #0f172a;
    position: relative;
  }
  .slide-container {
    width: 1376px;
    height: 768px;
    padding: 46px 52px 30px 52px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
  }
  
  /* Header */
  .header {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(224, 242, 254, 0.9);
    backdrop-filter: blur(6px);
    color: #0284c7;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 4px 16px;
    border-radius: 9999px;
    border: 1px solid #bae6fd;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  h1 {
    font-size: 42px;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.025em;
    font-family: 'Plus Jakarta Sans', sans-serif;
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
  }
  .subtitle {
    font-size: 16px;
    font-weight: 500;
    color: #334155;
    max-width: 1100px;
    line-height: 1.4;
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
  }

  /* Grid of 3 Cards */
  .cards-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 8px 0;
  }
  .cards-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    width: 100%;
  }

  .card {
    background: rgba(255, 255, 255, 0.96);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 24px 22px 20px 22px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 310px;
    box-shadow: 0 16px 35px -8px rgba(15, 23, 42, 0.12), 0 4px 10px -2px rgba(15, 23, 42, 0.05);
    border: 1.5px solid rgba(203, 213, 225, 0.8);
    position: relative;
    overflow: hidden;
  }

  .card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
  }
  .card-problem::before { background: #0284c7; }
  .card-solution::before { background: #059669; }
  .card-application::before { background: #d97706; }

  .card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .card-pill {
    font-size: 12px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 5px 13px;
    border-radius: 8px;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .card-problem .card-pill { background: #e0f2fe; color: #0369a1; }
  .card-solution .card-pill { background: #dcfce7; color: #15803d; }
  .card-application .card-pill { background: #fef3c7; color: #b45309; }

  .card-icon-wrap {
    width: 58px;
    height: 58px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #faf6ee;
    border: 1px solid #ede7db;
  }
  .card-icon {
    width: 48px;
    height: 48px;
    object-fit: contain;
  }

  .card-title {
    font-size: 20.5px;
    font-weight: 700;
    color: #0f172a;
    font-family: 'Plus Jakarta Sans', sans-serif;
    line-height: 1.34;
    letter-spacing: -0.02em;
  }

  .card-footer {
    padding-top: 14px;
    border-top: 1.5px dashed #cbd5e1;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11.8px;
    font-weight: 600;
    line-height: 1.35;
    white-space: nowrap;
  }
  .card-problem .card-footer { color: #0284c7; }
  .card-solution .card-footer { color: #16a34a; }
  .card-application .card-footer { color: #d97706; }

  /* Footer */
  .footer-row {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .logo-img {
    height: 18px;
    opacity: 0.85;
  }
</style>
</head>
<body>
<div class='slide-container'>
  <div class='header'>
    <span class='badge'>Lesson Overview</span>
    <h1>What if we haven't got enough faeces?</h1>
    <p class='subtitle'>How an invisible, unreactive atmospheric gas becomes the physical building block of all life on Earth.</p>
  </div>

  <div class='cards-wrapper'>
    <div class='cards-grid'>
      <!-- Card 1: The Problem -->
      <div class='card card-problem'>
        <div>
          <div class='card-top'>
            <span class='card-pill'>The Problem</span>
            <div class='card-icon-wrap'>
              <img class='card-icon' src='data:image/png;base64,${icon1B64}' alt='N2 Molecule'>
            </div>
          </div>
          <h2 class='card-title'>Nitrogen is everywhere, but<br>unusable to most life</h2>
        </div>
        <div class='card-footer'>
          <span>⚡ Biological Challenge: Triple bond cannot be broken directly</span>
        </div>
      </div>

      <!-- Card 2: The Solution -->
      <div class='card card-solution'>
        <div>
          <div class='card-top'>
            <span class='card-pill'>The Solution</span>
            <div class='card-icon-wrap'>
              <img class='card-icon' src='data:image/png;base64,${icon2B64}' alt='Bacterial Workforce'>
            </div>
          </div>
          <h2 class='card-title'>The microscopic bacterial workforce<br>that fixes and recycles it</h2>
        </div>
        <div class='card-footer'>
          <span>🔬 Living Transformers: Soil bacteria drive the cycle</span>
        </div>
      </div>

      <!-- Card 3: The Application -->
      <div class='card card-application'>
        <div>
          <div class='card-top'>
            <span class='card-pill'>The Application</span>
            <div class='card-icon-wrap'>
              <img class='card-icon' src='data:image/png;base64,${icon3B64}' alt='Farming'>
            </div>
          </div>
          <h2 class='card-title'>How farmers hack the nitrogen cycle<br>using fertilisers and crop rotation</h2>
        </div>
        <div class='card-footer'>
          <span>🚜 Agriculture: Feeding humanity while protecting ecosystems</span>
        </div>
      </div>
    </div>
  </div>

  <div class='footer-row'>
    <img class='logo-img' src='data:image/png;base64,${logoB64}' alt='Gemini Notebook'>
  </div>
</div>
</body>
</html>
`;

const browser = await chromium.launch({ executablePath: chromePath });
const page = await browser.newPage({ viewport: { width: 1376, height: 768 } });
await page.setContent(html);
await page.waitForLoadState('networkidle');
await page.screenshot({ path: outputPath });
await browser.close();

console.log(`Successfully generated: ${outputPath}`);
