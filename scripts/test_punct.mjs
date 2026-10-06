import fs from "fs";
import path from "path";
import { chromium } from "playwright";

const deckDir = "public/decks/genetics_aaq/Lesson_05_Gene_mutations_acquired_and_inherited";
const bgPath = path.join(deckDir, "bright_dna_backdrop_clean.jpg");
const trnaPath = path.join(deckDir, "trna_structure_diagram.jpg");

const bgBase64 = fs.readFileSync(bgPath).toString("base64");
const trnaBase64 = fs.readFileSync(trnaPath).toString("base64");

async function testPunctuation() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1376, height: 768 } });

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&display=swap');
  body {
    background: white;
    padding: 30px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 800;
    font-size: 23px;
    color: #0f172a;
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 600px;
  }
  .test {
    padding: 10px;
    border: 1px solid #ccc;
  }
</style>
</head>
<body>
  <div class="test">A: Explain what is meant by the genetic code being 'degenerate' and 'non-overlapping'.</div>
  <div class="test">B: Explain what is meant by the genetic code being 'degenerate' and 'non-overlapping.'</div>
  <div class="test">C: Explain what is meant by the genetic code being "degenerate" and "non-overlapping".</div>
  <div class="test">D: Explain what is meant by the genetic code being "degenerate" and "non-overlapping."</div>
  <div class="test">E: Explain what is meant by the genetic code being <i>degenerate</i> and <i>non-overlapping</i>.</div>
</body>
</html>`;

  await page.setContent(html);
  await page.screenshot({ path: "scratch/test_punct.png" });
  await browser.close();
}

testPunctuation().catch(console.error);
