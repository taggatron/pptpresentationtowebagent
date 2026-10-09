import json
import os
import sys

# Import WEEKS_DATA from generate_all_weekly_decks
from generate_all_weekly_decks import WEEKS_DATA

def serialize_data(weeks_data):
    # Convert RGBColor to hex strings
    clean_weeks = []
    for w in weeks_data:
        cw = dict(w)
        cw["accent"] = f"#{w['accent'][0]:02x}{w['accent'][1]:02x}{w['accent'][2]:02x}"
        cw["accent_light"] = f"#{w['accent_light'][0]:02x}{w['accent_light'][1]:02x}{w['accent_light'][2]:02x}"
        cw["dark"] = f"#{w['dark'][0]:02x}{w['dark'][1]:02x}{w['dark'][2]:02x}"
        clean_weeks.append(cw)
    return clean_weeks

def build_html(clean_weeks):
    data_json = json.dumps(clean_weeks, indent=2)

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Adult Photography Masterclass — 10 Weekly Slide Decks</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Outfit:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {{
      --bg: #090d16;
      --card-bg: rgba(22, 30, 46, 0.7);
      --card-border: rgba(255, 255, 255, 0.08);
      --text: #f1f5f9;
      --text-muted: #94a3b8;
      --sidebar-w: 320px;
    }}

    * {{
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }}

    body {{
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: var(--bg);
      color: var(--text);
      display: flex;
      height: 100vh;
      overflow: hidden;
    }}

    /* Sidebar Navigation */
    aside {{
      width: var(--sidebar-w);
      background: rgba(15, 23, 42, 0.95);
      border-right: 1px solid var(--card-border);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      z-index: 10;
    }}

    .brand {{
      padding: 20px 24px;
      border-bottom: 1px solid var(--card-border);
      background: linear-gradient(180deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.6) 100%);
    }}

    .brand-tag {{
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #38bdf8;
      margin-bottom: 6px;
    }}

    .brand h1 {{
      font-family: 'Outfit', sans-serif;
      font-size: 18px;
      font-weight: 700;
      color: #fff;
      line-height: 1.3;
    }}

    .brand p {{
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 4px;
    }}

    .nav-list {{
      flex: 1;
      overflow-y: auto;
      padding: 12px 10px;
    }}

    .nav-item {{
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      border-radius: 10px;
      cursor: pointer;
      margin-bottom: 4px;
      transition: all 0.2s ease;
      border: 1px solid transparent;
      text-decoration: none;
      color: var(--text);
    }}

    .nav-item:hover {{
      background: rgba(255, 255, 255, 0.05);
    }}

    .nav-item.active {{
      background: rgba(56, 189, 248, 0.12);
      border-color: rgba(56, 189, 248, 0.4);
    }}

    .nav-badge {{
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
      flex-shrink: 0;
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }}

    .nav-item.active .nav-badge {{
      background: var(--active-accent, #38bdf8);
      color: #fff;
    }}

    .nav-info {{
      overflow: hidden;
    }}

    .nav-title {{
      font-size: 13px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }}

    .nav-date {{
      font-size: 11px;
      color: var(--text-muted);
      margin-top: 2px;
    }}

    /* Main Viewport */
    main {{
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background: radial-gradient(circle at 50% 20%, rgba(30, 58, 138, 0.15), transparent 70%), #090d16;
    }}

    /* Top Control Bar */
    header {{
      height: 64px;
      border-bottom: 1px solid var(--card-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 32px;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(12px);
    }}

    .deck-header-info h2 {{
      font-family: 'Outfit', sans-serif;
      font-size: 18px;
      font-weight: 700;
      color: #fff;
    }}

    .deck-header-info span {{
      font-size: 12px;
      color: var(--text-muted);
    }}

    .header-actions {{
      display: flex;
      align-items: center;
      gap: 12px;
    }}

    .btn {{
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      border: 1px solid var(--card-border);
      background: rgba(255, 255, 255, 0.08);
      color: #fff;
      transition: all 0.2s ease;
    }}

    .btn:hover {{
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.2);
    }}

    .btn-primary {{
      background: #2563eb;
      border-color: #3b82f6;
    }}

    .btn-primary:hover {{
      background: #1d4ed8;
    }}

    /* Slide Stage */
    .stage {{
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      position: relative;
    }}

    .slide-canvas {{
      width: 100%;
      max-width: 1100px;
      aspect-ratio: 16 / 9;
      background: #0f172a;
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      animation: fadeIn 0.3s ease;
    }}

    @keyframes fadeIn {{
      from {{ opacity: 0; transform: scale(0.99); }}
      to {{ opacity: 1; transform: scale(1); }}
    }}

    .slide-accent-top {{
      height: 6px;
      width: 100%;
      background: var(--slide-accent, #38bdf8);
    }}

    .slide-body {{
      flex: 1;
      padding: 36px 44px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }}

    /* Slide Title Card */
    .slide-title-theme {{
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
    }}

    .slide-badge {{
      display: inline-flex;
      align-self: flex-start;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.5px;
      background: var(--slide-accent, #2563eb);
      color: #fff;
      margin-bottom: 16px;
    }}

    .slide-title-theme h1 {{
      font-family: 'Outfit', sans-serif;
      font-size: 40px;
      font-weight: 800;
      line-height: 1.15;
      color: #fff;
      margin-bottom: 12px;
    }}

    .slide-title-theme p.subtitle {{
      font-size: 18px;
      color: #94a3b8;
      max-width: 850px;
      line-height: 1.4;
      margin-bottom: 32px;
    }}

    .slide-title-meta {{
      background: rgba(30, 41, 59, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 16px 20px;
      display: flex;
      gap: 32px;
    }}

    .meta-col h4 {{
      font-size: 11px;
      text-transform: uppercase;
      color: var(--slide-accent, #38bdf8);
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }}

    .meta-col p {{
      font-size: 14px;
      font-weight: 600;
      color: #fff;
    }}

    /* Content Slides */
    .content-header {{
      margin-bottom: 24px;
    }}

    .content-header h2 {{
      font-family: 'Outfit', sans-serif;
      font-size: 26px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 6px;
    }}

    .content-header p {{
      font-size: 14px;
      color: var(--text-muted);
    }}

    /* 2 Col Layout */
    .grid-2col {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      flex: 1;
    }}

    .grid-4col {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      gap: 16px;
      flex: 1;
    }}

    .content-card {{
      background: rgba(30, 41, 59, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
    }}

    .content-card h3 {{
      font-size: 16px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }}

    .content-card.accent-card h3 {{
      color: var(--slide-accent, #38bdf8);
    }}

    .content-card ul {{
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }}

    .content-card li {{
      font-size: 13px;
      line-height: 1.45;
      color: #cbd5e1;
      padding-left: 18px;
      position: relative;
    }}

    .content-card li::before {{
      content: '•';
      position: absolute;
      left: 4px;
      color: var(--slide-accent, #38bdf8);
      font-weight: bold;
    }}

    .content-card p.card-desc {{
      font-size: 13px;
      line-height: 1.45;
      color: #94a3b8;
    }}

    /* Challenge steps */
    .steps-list {{
      display: flex;
      flex-direction: column;
      gap: 12px;
      flex: 1;
    }}

    .step-item {{
      background: rgba(30, 41, 59, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      padding: 12px 18px;
      display: flex;
      align-items: flex-start;
      gap: 16px;
    }}

    .step-badge {{
      background: var(--slide-accent, #38bdf8);
      color: #fff;
      font-size: 11px;
      font-weight: 800;
      padding: 4px 8px;
      border-radius: 6px;
      flex-shrink: 0;
    }}

    .step-content h4 {{
      font-size: 14px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 2px;
    }}

    .step-content p {{
      font-size: 12px;
      color: #94a3b8;
      line-height: 1.4;
      white-space: pre-line;
    }}

    /* Slide Footer */
    .slide-footer {{
      padding: 12px 44px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 11px;
      color: #64748b;
    }}

    /* Bottom Slide Controls */
    .slide-controls {{
      height: 60px;
      border-top: 1px solid var(--card-border);
      background: rgba(15, 23, 42, 0.7);
      backdrop-filter: blur(12px);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 32px;
    }}

    .slide-nav-btns {{
      display: flex;
      align-items: center;
      gap: 8px;
    }}

    .slide-dots {{
      display: flex;
      align-items: center;
      gap: 6px;
    }}

    .dot {{
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      cursor: pointer;
      transition: all 0.2s;
    }}

    .dot.active {{
      width: 24px;
      border-radius: 4px;
      background: var(--slide-accent, #38bdf8);
    }}
  </style>
</head>
<body>

  <!-- Sidebar -->
  <aside>
    <div class="brand">
      <span class="brand-tag">South Devon College</span>
      <h1>Adult Photography Masterclass</h1>
      <p>Autumn Term 2026 • 10-Week Syllabus</p>
    </div>
    <div class="nav-list" id="navList">
      <!-- Injected via JS -->
    </div>
  </aside>

  <!-- Main Viewport -->
  <main>
    <header>
      <div class="deck-header-info">
        <h2 id="currentDeckTitle">Week 1: Composition Viewpoints</h2>
        <span id="currentDeckMeta">Thursday, 8 October 2026 • 18:30 – 21:00</span>
      </div>
      <div class="header-actions">
        <a id="downloadPptxBtn" href="#" class="btn btn-primary" download>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download Deck (.pptx)
        </a>
      </div>
    </header>

    <div class="stage">
      <div class="slide-canvas" id="slideCanvas">
        <div class="slide-accent-top" id="slideAccent"></div>
        <div class="slide-body" id="slideBody">
          <!-- Slide Content injected via JS -->
        </div>
        <div class="slide-footer" id="slideFooter">
          <span>South Devon College Adult Photography</span>
          <span id="slideCounter">Slide 1 of 6</span>
        </div>
      </div>
    </div>

    <div class="slide-controls">
      <div class="slide-nav-btns">
        <button class="btn" id="prevSlideBtn" onclick="prevSlide()">◀ Previous</button>
        <button class="btn" id="nextSlideBtn" onclick="nextSlide()">Next ▶</button>
      </div>

      <div class="slide-dots" id="slideDots">
        <!-- Injected dots -->
      </div>

      <span style="font-size: 12px; color: #64748b;">Use Left / Right arrow keys to navigate</span>
    </div>
  </main>

  <script>
    const WEEKS = {data_json};

    let currentWeekIdx = 0;
    let currentSlideIdx = 0;

    const navList = document.getElementById('navList');
    const currentDeckTitle = document.getElementById('currentDeckTitle');
    const currentDeckMeta = document.getElementById('currentDeckMeta');
    const downloadPptxBtn = document.getElementById('downloadPptxBtn');
    const slideCanvas = document.getElementById('slideCanvas');
    const slideAccent = document.getElementById('slideAccent');
    const slideBody = document.getElementById('slideBody');
    const slideFooter = document.getElementById('slideFooter');
    const slideCounter = document.getElementById('slideCounter');
    const slideDots = document.getElementById('slideDots');

    function initNav() {{
      navList.innerHTML = '';
      WEEKS.forEach((w, idx) => {{
        const item = document.createElement('a');
        item.className = `nav-item ${{idx === currentWeekIdx ? 'active' : ''}}`;
        item.style.setProperty('--active-accent', w.accent);
        item.onclick = (e) => {{
          e.preventDefault();
          selectWeek(idx);
        }};
        item.innerHTML = `
          <div class="nav-badge" style="background: ${{idx === currentWeekIdx ? w.accent : 'rgba(255,255,255,0.08)'}}">W${{w.week}}</div>
          <div class="nav-info">
            <div class="nav-title">${{w.title}}</div>
            <div class="nav-date">${{w.date}}</div>
          </div>
        `;
        navList.appendChild(item);
      }});
    }}

    function selectWeek(weekIdx) {{
      currentWeekIdx = weekIdx;
      currentSlideIdx = 0;
      initNav();
      renderDeck();
    }}

    function getCleanFilename(week) {{
      const clean = week.title.split(':')[0].replace(/&/g, 'and').replace(/\\//g, '_').replace(/ /g, '_');
      const names = [
        "Week_01_Composition_Viewpoints.pptx",
        "Week_02_Rule_of_Thirds_Leading_Lines.pptx",
        "Week_03_Exposure_Triangle_Aperture_Shutter_ISO.pptx",
        "Week_04_Changing_Light_and_Image_Adjustments.pptx",
        "Week_05_Natural_and_Studio_Portraiture.pptx",
        "Week_06_Abstract_and_Macro_Photography.pptx",
        "Week_07_Landscape_and_Architecture.pptx",
        "Week_08_Shadows_Silhouettes_Dappled_Light.pptx",
        "Week_09_Personal_Project_Conception_and_Culling.pptx",
        "Week_10_Personal_Project_Exhibition_and_Farewell.pptx"
      ];
      return names[week.week - 1];
    }}

    function renderDeck() {{
      const w = WEEKS[currentWeekIdx];
      currentDeckTitle.innerText = `Week ${{w.week}}: ${{w.title}}`;
      currentDeckMeta.innerText = `${{w.date}} • ${{w.time}} • South Devon College`;
      
      const fname = getCleanFilename(w);
      downloadPptxBtn.href = `./weekly_decks/${{fname}}`;
      downloadPptxBtn.setAttribute('download', fname);

      slideCanvas.style.setProperty('--slide-accent', w.accent);

      renderSlide();
    }}

    function renderSlide() {{
      const w = WEEKS[currentWeekIdx];
      const allSlides = [
        {{ type: 'title' }},
        ...w.slides
      ];

      const s = allSlides[currentSlideIdx];
      const total = allSlides.length;

      slideCounter.innerText = `Slide ${{currentSlideIdx + 1}} of ${{total}}`;

      // Render dots
      slideDots.innerHTML = '';
      for (let i = 0; i < total; i++) {{
        const d = document.createElement('div');
        d.className = `dot ${{i === currentSlideIdx ? 'active' : ''}}`;
        d.onclick = () => {{ currentSlideIdx = i; renderSlide(); }};
        slideDots.appendChild(d);
      }}

      if (s.type === 'title') {{
        slideBody.innerHTML = `
          <div class="slide-title-theme">
            <span class="slide-badge">WEEK ${{w.week}} MASTERCLASS</span>
            <h1>${{w.title}}</h1>
            <p class="subtitle">${{w.subtitle}}</p>
            <div class="slide-title-meta">
              <div class="meta-col">
                <h4>Institution</h4>
                <p>South Devon College</p>
              </div>
              <div class="meta-col">
                <h4>Session Date & Time</h4>
                <p>${{w.date}} | ${{w.time}}</p>
              </div>
              <div class="meta-col">
                <h4>Course Level</h4>
                <p>Adult Beginner to Intermediate</p>
              </div>
            </div>
          </div>
        `;
      }} else if (s.type === 'overview') {{
        slideBody.innerHTML = `
          <div class="content-header">
            <h2>${{s.title}}</h2>
            <p>${{s.lead}}</p>
          </div>
          <div class="grid-4col">
            ${{s.cards.map((c, i) => `
              <div class="content-card">
                <span style="font-size: 11px; font-weight: 800; color: ${{w.accent}}; margin-bottom: 4px;">GOAL 0${{i+1}}</span>
                <h3 style="margin-bottom: 6px;">${{c[0]}}</h3>
                <p class="card-desc">${{c[1]}}</p>
              </div>
            `).join('')}}
          </div>
        `;
      }} else if (s.type === 'content_2col') {{
        slideBody.innerHTML = `
          <div class="content-header">
            <h2>${{s.title}}</h2>
            <p>${{s.lead}}</p>
          </div>
          <div class="grid-2col">
            <div class="content-card">
              <h3>${{s.col1.header}}</h3>
              <ul>
                ${{s.col1.bullets.map(b => `<li>${{b}}</li>`).join('')}}
              </ul>
            </div>
            <div class="content-card">
              <h3>${{s.col2.header}}</h3>
              <ul>
                ${{s.col2.bullets.map(b => `<li>${{b}}</li>`).join('')}}
              </ul>
            </div>
          </div>
        `;
      }} else if (s.type === 'content_4grid') {{
        const items = s.items || s.cards || [];
        slideBody.innerHTML = `
          <div class="content-header">
            <h2>${{s.title}}</h2>
            <p>${{s.lead}}</p>
          </div>
          <div class="grid-4col">
            ${{items.map(it => `
              <div class="content-card accent-card">
                <h3 style="color: ${{w.accent}};">${{it[0]}}</h3>
                <p class="card-desc" style="white-space: pre-line;">${{it[1]}}</p>
              </div>
            `).join('')}}
          </div>
        `;
      }} else if (s.type === 'challenge') {{
        slideBody.innerHTML = `
          <div class="content-header">
            <h2>${{s.title}}</h2>
            <p>${{s.lead}}</p>
          </div>
          <div class="steps-list">
            ${{s.steps.map((st, i) => `
              <div class="step-item">
                <span class="step-badge" style="background: ${{w.accent}};">STAGE ${{i+1}}</span>
                <div class="step-content">
                  <h4>${{st[0]}}</h4>
                  <p>${{st[1]}}</p>
                </div>
              </div>
            `).join('')}}
          </div>
        `;
      }} else if (s.type === 'review_homework') {{
        slideBody.innerHTML = `
          <div class="content-header">
            <h2>${{s.title}}</h2>
            <p>${{s.lead}}</p>
          </div>
          <div class="grid-2col">
            <div class="content-card">
              <h3>In-Class Critique Rubric</h3>
              <ul>
                ${{s.critique.map(c => `<li>${{c}}</li>`).join('')}}
              </ul>
            </div>
            <div class="content-card" style="border-color: ${{w.accent}}; background: rgba(30, 41, 59, 0.9);">
              <h3 style="color: ${{w.accent}};">Weekly Homework & Next Steps</h3>
              <ul>
                ${{s.homework.map(h => `<li style="color: #fff;">${{h}}</li>`).join('')}}
              </ul>
            </div>
          </div>
        `;
      }}
    }}

    function prevSlide() {{
      if (currentSlideIdx > 0) {{
        currentSlideIdx--;
        renderSlide();
      }}
    }}

    function nextSlide() {{
      const total = WEEKS[currentWeekIdx].slides.length + 1;
      if (currentSlideIdx < total - 1) {{
        currentSlideIdx++;
        renderSlide();
      }}
    }}

    window.addEventListener('keydown', (e) => {{
      if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    }});

    // Initialize
    initNav();
    renderDeck();
  </script>
</body>
</html>
"""
    return html

def main():
    clean = serialize_data(WEEKS_DATA)
    html_content = build_html(clean)

    out_file = "/Users/danieltagg/Desktop/Desktop - Daniel’s MacBook Pro/pptpresentationtowebagent/scratch/weekly_photography_decks_viewer.html"
    with open(out_file, "w", encoding="utf-8") as f:
        f.write(html_content)
    print(f"Exported interactive web viewer to {out_file}")

    # Also copy to artifact directory
    art_file = "/Users/danieltagg/.gemini/antigravity-ide/brain/e5ab2aa9-8066-4012-b3d0-daf783ffe472/weekly_photography_decks_viewer.html"
    with open(art_file, "w", encoding="utf-8") as f:
        f.write(html_content)
    print(f"Exported to artifact directory: {art_file}")

if __name__ == "__main__":
    main()
