# Height by Many Small Steps

A browser-only React + TypeScript biology interactive about polygenic inheritance and continuous variation. Built with Vite, Tailwind CSS v4, inline SVG and Lucide icons. There is no backend, tracking or external runtime data dependency.

## Run locally

Requires Node.js 22.6+ (Node 24 recommended) and npm.

```sh
npm install
npm run dev
```

Open the local address printed by Vite. To create and serve the production build:

```sh
npm run build
npm run preview
```

`dist/` contains the portable static build. Serve it over HTTP; opening the HTML directly as a `file://` URL does not load JavaScript modules reliably. Everything runs locally after the dependencies are installed.

## Explore

The compact laptop layout fits the board, explorer, environmental controls and histogram into one browser viewport at widths of 1050 px and above. Longer model and biology notes expand within the explorer; the teaching guide opens from **How to read this**. Narrower screens use a scrolling layout. The 12 selected genes retain examples of all five protein-metaphor categories.

The app opens with a reproducible 300-person neutral sample. Use **Reset** to begin with an empty population, then drop 1 or 100 people, or use **Auto-run**. **Pause** freezes both generation and animation; **Resume** continues. Speed changes the animation and generation rate, not the model. Histogram counts update only when a ball lands.

Select any of the 12 gene rows (mouse, Enter or Space) to see its role, protein category and SVG metaphor. Select an environmental marker or control label to inspect that factor. Range sliders support keyboard arrow keys. Reduced-motion preferences replace travel with immediate arrivals.

For a comparison, save the current population as **A**, change the environment, then generate **B**. Environmental edits stop the simulation and clear the current population, avoiding mixed conditions. Saved A is retained. Comparison bars use percentages so samples of different sizes remain comparable. Reset preserves environmental settings and A; remove A with its close button. Nothing persists after reloading.

## How the model works

Each individual passes through exactly 12 rows, taking a left or right step at each. A left step subtracts that row's illustrative effect size; a right step adds it. Effect sizes range from 1.15 to 1.55 model units, with **no claim of empirical calibration**.

Height = 175 cm + sum of signed effects × √(20 / row count) + normally distributed individual environmental noise.

- The overall-environment slider changes the right-branch probability and visually tilts the board by up to 2.3°.
- Prenatal conditions, nutrition and sleep increase growth support when raised; illness burden decreases it.
- Illness burden and distance from middle nutrition increase the illustrative noise spread.
- All outcomes use the same deterministic PRNG (seed 42). Each fresh population restarts the random sequence, making comparisons reproducible.
- The normal curve uses the current population mean and population SD (denominator N). Small samples can be irregular. It is a fitted reference curve, not a second measured dataset.
- 35 two-centimetre histogram bins span 140–210 cm. The first and last bins collect lower and upper outliers; reported mean and SD use unrounded, unclipped values.
- The board displays equally spaced branching decisions for legibility. Final landing position reflects the weighted score plus noise; the board is a conceptual Galton board, not a physics simulation.

Environmental bias represents developmental conditions, **not a change to inherited alleles**. Real human height involves many more genes, interactions and environmental factors. Equal independent rows, a single population and fixed coefficients are teaching assumptions. HMGA2 is described as a DNA-binding regulator. No height, nutrition or health predictions for real people should be inferred.

## Structure and editing

- `src/data/genes.ts` — the 12 gene records, protein categories, descriptions, notes and illustrative effect sizes.
- `src/data/environment.ts` — factor metadata, slider directions and neutral defaults.
- `src/lib/simulation.ts` — deterministic random generation, environmental bias, histogram and statistics.
- `src/lib/useSimulation.ts` — queued individuals, timing, pause and reset.
- `src/components/Board.tsx` — responsive SVG board and keyboard-selectable rows.
- `src/components/ProteinIllustration.tsx` — five inline SVG protein metaphors plus the environmental seedling.
- `src/components/Explorer.tsx` — persistent explanatory sidebar.
- `src/components/EnvironmentControls.tsx` — environmental controls.
- `src/components/Distribution.tsx` — statistics, histogram, fitted curve and A/B comparison.
- `src/styles.css` — Tailwind theme, custom visual system and responsive layouts.
- `src/lib/useModelTools.ts` — optional feature-detected WebMCP tools; ordinary browsers need no plugin.

## Verification

```sh
npm run build
npm run test:model
```

The model check samples 50,000 individuals per condition and verifies all 12 genes, reproducibility, population mean/spread, environmental shift, illness direction, histogram conservation including outliers, and the expected approximate normal concentration within one SD.

## Biology references

- [MedlinePlus Genetics: Is height determined by genetics?](https://medlineplus.gov/genetics/understanding/traits/height/)
- Each gene explorer links to its corresponding human-gene search at NCBI.

The SVG artwork and all numerical model coefficients were authored for this teaching interactive.

## Single-gene introduction and expanded panels

Use **1 gene / 12 genes** in the control bar to change the model. The one-gene introduction isolates IGF1's illustrative contribution. It retains the same per-gene score scale as the 12-gene model and deliberately omits continuous noise, making two possible contributions visible. Environmental controls change their relative frequency. This is not a model of monogenic height or dominant/recessive inheritance. The bell-curve overlay is disabled in this mode. Mode changes clear queued/landed individuals, stop auto-run and keep saved A; the comparison legend records each scenario's gene count. Existing environmental settings are retained.

Each of the four panel headers has an **expand** button. The selected panel fills the available browser area, with the simulation controls in a compact toolbar at the top. Use its **close** button or **Escape** to restore the compact layout. Expanding preserves the population, selected gene, environmental values, saved comparison and curve preference.

The normal laptop view places the model selector, drop buttons, auto-run, pause/resume, reset and speed in the page header. Pause/resume uses an icon and the speed menu uses a gauge icon; both retain accessible names and tooltips. On narrow screens the header controls wrap.


## Environmental direction and gene-specific pegs

Choose **Positive** (green) or **Negative** (red), then toggle the factors below the board. A second click returns that factor to its neutral midpoint. The master selector reverses currently active prenatal, nutrition and sleep influences; it does not activate inactive factors. **Illness** always activates high burden and tilts the represented pathways left, regardless of the master selector. Combined factors can oppose or reinforce one another. Each change starts a fresh population and preserves saved A.

Negative mode displays **Prenatal smoking** on the board, in the explorer and on its slider. The smoking slider is reversed relative to the internal prenatal-support value, so a higher displayed exposure means less growth support. Its values are illustrative relative conditions, not cigarette counts or exposure thresholds.

`src/data/interactions.ts` contains the illustrative pathway mapping. Prenatal effects use IGF signalling; nutrition uses the GH–IGF pathway and downstream cartilage proteins; sleep uses the GH–IGF pathway; illness uses growth signalling and downstream cartilage proteins. Weights are teaching choices, not measured gene-by-environment interaction coefficients. Unlisted genes mean no specific effect is represented, not evidence of biological independence. Tilt represents the net branching probability, not expression up/downregulation; the same per-gene function drives both the seesaw angle and individual outcomes. Positive angles lower the right end; negative angles lower the left.

The single-gene mode uses IGF1 so all four illustrative pathways can be explored with one row. Supporting background:

- [Maternal smoking, fetal growth and growth factors](https://pubmed.ncbi.nlm.nih.gov/17407461/)
- [Growth hormone secretion during sleep](https://pubmed.ncbi.nlm.nih.gov/5675428/)
- [Inflammatory disease, the GH–IGF axis and growth plates](https://pmc.ncbi.nlm.nih.gov/articles/PMC5618527/)
- [Nutrition and linear growth](https://pmc.ncbi.nlm.nih.gov/articles/PMC9100533/)
