import fs from 'node:fs';
import path from 'node:path';

const DECKS_CONFIG = [
  {
    week: 1,
    id: "Lesson_01_Composition_Viewpoints",
    title: "1. Composition Viewpoints & Camera Familiarisation",
    slug: "Week_01_Composition_Viewpoints",
    slideFolder: "week_1",
    slideTitles: [
      "Introduction to Photography: Orientation & Welcome",
      "The Intentionality Spectrum: Snapshot vs Photograph",
      "Camera Anatomy: Hardware Controls & Grip Etiquette",
      "Mode Dial Foundations: From Auto to Creative Priority",
      "Focus Systems: Viewfinder vs LCD Screen",
      "Safe Field Practice: Camera Straps & Lens Care",
      "The Four Creative Viewpoints: Overview",
      "Bird's-Eye View: Graphic Planar Geometry",
      "Worm's-Eye View: Ground Texture & Looming Scale",
      "Eye-Level Perspective: Human-Scale Intimacy",
      "Through-View Framing: Natural Obstruction & Depth",
      "Viewpoint Comparison Matrix",
      "In-Class Practical Challenge: The 3-Angle Campus Shoot",
      "Constructive Critique Rubric & Peer Review",
      "Weekly Assignment: Exploring Elevated Perspectives"
    ]
  },
  {
    week: 2,
    id: "Lesson_02_Rule_of_Thirds_Leading_Lines",
    title: "2. Composition: Rule of Thirds & Leading Lines",
    slug: "Week_02_Rule_of_Thirds_Leading_Lines",
    slideFolder: "week_2",
    slideTitles: [
      "The Hidden Geometry of Sight",
      "Core Objectives & Principles of Visual Flow",
      "Mapping the Eye: The Rule of Thirds Grid",
      "Horizons & Balance: Lower Third vs Upper Third",
      "Dynamic Focal Points: Positioning Off-Center",
      "Leading Lines: Pathways Through the Canvas",
      "Trajectories: Diagonals, S-Curves & Convergence",
      "Visual Weight: Contrast, Scale & Balance",
      "Framing Within the Frame",
      "Breaking the Rules: Central Symmetry Power",
      "Common Composition Pitfalls & Solutions",
      "Synthesis: Anatomy of a Balanced Frame",
      "In-Class Challenge: The Geometry Scavenger Hunt",
      "Constructive Critique: Analyzing Flow & Line",
      "Weekly Assignment: Leading Line Portfolios"
    ]
  },
  {
    week: 3,
    id: "Lesson_03_Exposure_Triangle_Aperture_Shutter_ISO",
    title: "3. Exposure Fundamentals: Aperture, Shutter Speed & ISO",
    slug: "Week_03_Exposure_Triangle_Aperture_Shutter_ISO",
    slideFolder: "week_3",
    slideTitles: [
      "Exposure Fundamentals: Mastering Light",
      "Session Objectives: The Exposure Trinity",
      "The Exposure Triangle: Balancing Three Variables",
      "Aperture & f-Stops: The Iris of the Lens",
      "Controlling Depth of Field: Creamy Bokeh vs Sharp Edges",
      "Shutter Speed: The Dimension of Time",
      "Motion Trade-Off: Freezing Action vs Intentional Blur",
      "The Reciprocal Rule: Preventing Handheld Shake",
      "ISO Sensitivity: Amplification & Digital Noise",
      "Noise Management & Dynamic Range",
      "The Mode Dial Compass: P, Tv/S, Av/A, M",
      "Exposure Compensation Dial (+/- EV)",
      "In-Class Challenge: The Bokeh & Motion Lab",
      "Critique Checklist: Evaluating Sharpness & Exposure",
      "Weekly Assignment: The Exposure Bracket Matrix"
    ]
  },
  {
    week: 4,
    id: "Lesson_04_Changing_Light_and_Image_Adjustments",
    title: "4. Changing Light & Basic Digital Adjustments",
    slug: "Week_04_Changing_Light_and_Image_Adjustments",
    slideFolder: "week_4",
    slideTitles: [
      "Mastering Dynamic Light & Digital Foundations",
      "Objectives: Adapting to Unpredictable Light",
      "The Behavior of Light: Direction, Quality & Color Temp",
      "Golden Hour vs Twilight vs Blue Hour",
      "Camera Metering Modes: Matrix, Center-Weighted, Spot",
      "High Dynamic Range Scenes: Exposing for Highlights",
      "Motion Control in Low Light: Balancing ISO & Shutter",
      "The Digital Darkroom: An Introduction",
      "RAW vs JPEG: Sensor Latitude & Bit Depth",
      "Understanding the Histogram: Reading Shadows & Highlights",
      "Essential Tone Adjustments: Exposure, Highlights, Shadows",
      "Color Balance: White Balance Kelvin Presets & Tint",
      "In-Class Challenge: Twilight Campus Transition Shoot",
      "Peer Critique: Evaluating Dynamic Range & Detail",
      "Weekly Assignment: Capturing Changing Atmosphere"
    ]
  },
  {
    week: 5,
    id: "Lesson_05_Natural_and_Studio_Portraiture",
    title: "5. Natural and Studio Portraiture",
    slug: "Week_05_Natural_and_Studio_Portraiture",
    slideFolder: "week_5",
    slideTitles: [
      "Mastering Portraiture: People, Light & Story",
      "Core Objectives: Connection, Optics & Lighting",
      "The Portrait Focal Length: 50mm, 85mm & Compression",
      "Natural Light: Window Light & The Inverse Square Law",
      "Modifiers: Reflectors, Diffusers & V-Flats",
      "Studio Flash Introduction: Strobes, Triggering & Sync Speed",
      "The 3-Point Lighting Setup: Key, Fill, Rim/Hair Light",
      "Lighting Patterns: Rembrandt, Loop, Butterfly, Split",
      "Directing & Posing: Jawline, Eye Contact & Posture",
      "Background Separation: Depth of Field & Negative Space",
      "Working with Subjects: Creating Comfort & Rapport",
      "Safe & Respectful Practice: Model Consent & Etiquette",
      "In-Class Studio Lab: The 2-Light Portrait Bay",
      "Peer Review: Evaluating Expression & Lighting Ratio",
      "Weekly Assignment: Environmental Character Portrait"
    ]
  },
  {
    week: 6,
    id: "Lesson_06_Abstract_and_Macro_Photography",
    title: "6. Abstract and Macro Photography",
    slug: "Week_06_Abstract_and_Macro_Photography",
    slideFolder: "week_6",
    slideTitles: [
      "Abstract & Macro Photography: The Miniature Universe",
      "Session Objectives: De-Contextualizing Reality",
      "Macro Optics: 1:1 Magnification & Extension Tubes",
      "Working Distance & Optical Distortion",
      "The Razor-Thin Depth of Field Challenge",
      "Focus Techniques: Focus Peaking & Focus Rail Control",
      "Lighting the Miniature: Macro Rings, Torches & Grazing Light",
      "The 4 Pillars of Abstract Art: Texture, Pattern, Shape, Color",
      "Raking Side-Light: Sculpting Micro-Surfaces",
      "Geometric Abstraction: Repeating Forms & Rhythms",
      "Everyday Objects Reimagined: Refraction & Reflections",
      "Common Macro Pitfalls: Wind, Breathing & Vibration",
      "In-Class Tabletop Lab: Liquid Drops & Organic Textures",
      "Abstract Critique Rubric: Form vs Identity",
      "Weekly Assignment: The Micro-Texture Scavenger Hunt"
    ]
  },
  {
    week: 7,
    id: "Lesson_07_Landscape_and_Architecture",
    title: "7. Landscape and Architecture Photography",
    slug: "Week_07_Landscape_and_Architecture",
    slideFolder: "week_7",
    slideTitles: [
      "Landscape & Architecture Photography",
      "Session Objectives: Space, Scale & Geometry",
      "Horizon Placement: Dramatic Sky vs Ground Texture",
      "The 3-Layer Spatial Recipe: Foreground, Midground, Sky",
      "Leading Elements in Landscape: Streams, Paths & Fences",
      "Architectural Perspective: Keystone Convergence Correction",
      "Symmetry & Vanishing Points in Built Environments",
      "Tripod Discipline: Level Bubbles & Cable Releases",
      "Hyperfocal Distance: Maximum Sharpness from Foot to Horizon",
      "Atmospheric Light: Golden Hour, Blue Hour & Overcast Softbox",
      "In-Class Campus Challenge: Architectural Symmetry & Ground Depth",
      "Peer Critique: Evaluating Horizon Level & Spatial Depth",
      "Weekly Assignment: Urban Geometry or Coastal Vista"
    ]
  },
  {
    week: 8,
    id: "Lesson_08_Shadows_Silhouettes_Dappled_Light",
    title: "8. Shadows, Silhouettes, Dappled Light & Reflection",
    slug: "Week_08_Shadows_Silhouettes_Dappled_Light",
    slideFolder: "week_8",
    slideTitles: [
      "Sculpting with Darkness: Shadow, Silhouette & Reflection",
      "Session Objectives: The Power of Negative Space",
      "High-Contrast Illumination: Exposing for the Highlights",
      "The Anatomy of a Silhouette: Clean Backlight Positioning",
      "Exposure Compensation for Silhouettes: -1 to -2 EV",
      "Shadows as Subject: Elongated Graphic Forms",
      "Dappled Light & Gobos: Creating Mystery & Drama",
      "Architectural Venetian Blind Shadows across Faces",
      "Creative Reflections: Puddle Mirrors, Polished Marble, Glass",
      "Symmetry & Distorted Reflection Surfaces",
      "In-Class Practical Challenge: The Silhouette & Gobo Station",
      "Critique Checklist: Tonal Contrast & Clean Shapes"
    ]
  },
  {
    week: 9,
    id: "Lesson_09_Personal_Project_Conception_and_Culling",
    title: "9. Personal Project: Conception, Shoot & Culling",
    slug: "Week_09_Personal_Project_Conception_and_Culling",
    slideFolder: "week_9",
    slideTitles: [
      "Crafting a Photography Series: Conception to Culling",
      "Session Objectives: Developing an Authorial Voice",
      "From Single Images to a Cohesive Narrative Body of Work",
      "Thematic Pathways: Street, Nature, Architecture, Portraiture",
      "Visual Consistency Anchors: Aspect Ratio, Palette & Focal Length",
      "Project Scope & Feasibility: Shot Lists & Logistics",
      "In-Class Shooting Sprint: Gathering Series Raw Material",
      "Digital Asset Management: Folder Architecture & Backups",
      "The 4-Pass Star Rating Culling Workflow",
      "Pass 1: Blurry & Technical Rejections (Delete Key)",
      "Pass 2: 3-Star Potential Selects (Fast First Impression)",
      "Pass 3: 4-Star Comparative Review (Head-to-Head)",
      "Pass 4: 5-Star Hero Series (The Final 3–5 Curated Works)",
      "1-on-1 Mentorship & Individual Project Review"
    ]
  },
  {
    week: 10,
    id: "Lesson_10_Personal_Project_Exhibition_and_Farewell",
    title: "10. Personal Project Exhibition & Farewell!",
    slug: "Week_10_Personal_Project_Exhibition_and_Farewell",
    slideFolder: "week_10",
    slideTitles: [
      "Final Photography Showcase: Exhibition & Celebration",
      "Session Objectives: Presentation, Critique & Lifelong Journey",
      "The Power of the Physical Print: Paper Stocks & Texture",
      "Print Preparation: Output Sharpening & Color Profiles",
      "Matting & Window Framing: Exhibition Presentation Standards",
      "Curation & Sequence: How Images Speak to One Another",
      "The Studio Gallery Walk: Setting Up the Exhibition",
      "Peer Commendation Protocol: Warm Feedback & Constructive Notes",
      "Individual Portfolio Showcase & Artist Statements",
      "Reflecting on 10 Weeks: The Evolution of Your Seeing",
      "Lifelong Pathways: Local Camera Clubs, Competitions & Grants",
      "Continuing Your Photographic Journey: Gear & Resources",
      "Farewell, Graduation & South Devon College Accreditations"
    ]
  }
];

const ROOT_DIR = process.cwd();
const PUBLIC_DECKS_DIR = path.join(ROOT_DIR, 'public', 'decks');
const PHOTO_UNIT_DIR = path.join(PUBLIC_DECKS_DIR, 'photography');

if (!fs.existsSync(PHOTO_UNIT_DIR)) {
  fs.mkdirSync(PHOTO_UNIT_DIR, { recursive: true });
}

console.log('Ingesting 10 weekly photography decks into:', PHOTO_UNIT_DIR);

for (const cfg of DECKS_CONFIG) {
  const deckDir = path.join(PHOTO_UNIT_DIR, cfg.id);
  const slidesDir = path.join(deckDir, 'slides');
  fs.mkdirSync(slidesDir, { recursive: true });

  // 1. Copy PPTX
  const srcPptx = path.join(ROOT_DIR, 'scratch', 'notebooklm_decks', `${cfg.slug}.pptx`);
  const dstPptx = path.join(deckDir, `${cfg.id}.pptx`);
  if (fs.existsSync(srcPptx)) {
    fs.copyFileSync(srcPptx, dstPptx);
  }

  // 2. Copy Slides
  const srcSlideDir = path.join(ROOT_DIR, 'scratch', 'notebooklm_slides', cfg.slideFolder);
  const slideFiles = fs.readdirSync(srcSlideDir).filter(f => f.endsWith('.png')).sort();

  const slides = [];
  for (let idx = 0; idx < slideFiles.length; idx++) {
    const origFile = slideFiles[idx];
    const slideNum = idx + 1;
    const destFileName = `slide_${String(slideNum).padStart(2, '0')}.png`;
    const srcFile = path.join(srcSlideDir, origFile);
    const dstFile = path.join(slidesDir, destFileName);
    fs.copyFileSync(srcFile, dstFile);

    const title = cfg.slideTitles[idx] || `Slide ${slideNum}`;
    const isStarter = (slideNum === 2);

    slides.push({
      number: slideNum,
      title: title,
      imageFileName: destFileName,
      imageUrl: `/decks/photography/${cfg.id}/slides/${destFileName}`,
      sourceMediaPath: `ppt/media/image${slideNum}.png`,
      isInteractive: isStarter,
      interactiveType: isStarter ? "question_reveal" : null,
      notes: `Week ${cfg.week} Adult Creative Photography — South Devon College.`
    });
  }

  // 3. Create manifest.json
  const manifest = {
    id: cfg.id,
    title: cfg.title,
    slideSet: "photography",
    filename: `${cfg.id}.pptx`,
    totalSlides: slides.length,
    slides: slides
  };

  const manifestPath = path.join(deckDir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`✅ Ingested [${cfg.id}]: ${slides.length} slides -> ${manifestPath}`);
}

console.log('\n🎉 ALL 10 PHOTOGRAPHY DECKS SUCCESSFULLY INGESTED INTO PUBLIC/DECKS/PHOTOGRAPHY!');
