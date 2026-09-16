# Natural Dynamics — Predator & Prey

A self-contained, slide-ready reimagining of the original population simulator for Vibe Deck. No dependencies, API keys, accounts, external images, or network requests are needed by the activity.

## Preview or use offline
Open `index.html` with the adjacent JavaScript and CSS files, or open `natural-dynamics.html`, which bundles everything into one file. The ZIP includes both versions.

## Put it inside Vibe Deck
1. Copy `index.html`, `style.css`, `model.js`, and `activity.js` into the Vibe Deck site's publicly served `/interactives/predator-prey/` folder (normally `public/interactives/predator-prey/` in a Vercel application).
2. Merge the fields from `vibe-deck-slide.json` into the slide that should contain the activity. Preserve that slide's existing number, title, image, and other metadata. This JSON is a slide configuration fragment, not a complete deck or a verified dashboard upload format.
3. Deploy Vibe Deck using its normal process. The fragment uses its exact public domain. If the domain changes, update that URL.
4. Open the slide and start the simulation. Open the presentation display to check it mirrors the controls and populations.

This package has not been installed into the live Vibe Deck app. Its application source and selected target lesson were not available in this workspace.

## Why same-origin hosting matters
The Vibe Deck public `js/app.js` inspected on 16 September 2026 recognises `interactiveType: "web_embed"` and `webEmbed.url`. In the separate presentation window, it adds `presentation=1` and then uses only the URL's pathname and query. An external-only hosted URL would consequently point at a missing path on Vibe Deck. Hosting these files under Vibe Deck resolves that issue without changing its code.

The activity implements `INTERACTIVE_STATE_UPDATE`, `REQUEST_INTERACTIVE_STATE`, and `APPLY_INTERACTIVE_STATE`. It removes `presentation=1` from its state-cache URL, so both displays share the same key. Use the absolute URL in the provided fragment. State messages include populations, seeded agent state, graph history, parameters, speed, explanation and chart view. The audience display mirrors snapshots at two updates per second instead of running an independent random simulation. Messages are accepted only from the actual parent window at the Vibe Deck origin or the activity's own origin. If hosting Vibe Deck on a different domain, update `allowedParents` as well as the configuration fragment.

The separately hosted Sites preview is owner-private. It is a preview, not the recommended production iframe URL. The ZIP is the deployable integration deliverable.

## Classroom sequence
- Predict: which population will peak first?
- Observe: run the model through one cycle. Prey are green circles / a solid line; predators are orange triangles / a dashed line.
- Explain: reveal the explanation only after discussion.
- Investigate: reset, make one disturbance, then compare the response.
- Extend: switch to the phase portrait, limit prey resources, or compare the individual-agent model.

## Scientific scope
The population model solves the Lotka–Volterra equations with fixed-step RK4 (`dt=0.02`). Optional prey carrying capacity adds logistic growth. Time is in arbitrary model units; numbers are continuous estimates rounded for the headline counts. The arena illustrates the ODE population and does not drive it.

The agent model is a separate, seeded stochastic teaching model with movement, encounter-based predation, prey reproduction, predator offspring and starvation. Its rates are illustrative, not a calibrated equivalent of the ODE. Agent extinction is a valid outcome. Display safety limits stop extreme runs rather than allowing unbounded memory use. The graph rescales and shows the most recent 45 model-time units once the run is long enough. Resource-limited growth can damp oscillations for suitable parameters; no universal stability claim is made.

Species pairings are simplified examples rather than complete ecological food webs. In particular, wolves do not depend on rabbits as their only prey. This is not a forecast or empirical data.

## Accessibility and fit
Designed around a landscape presentation canvas, with a compact layout for small slide frames and a vertically stacked layout below 760 CSS pixels. Native buttons, selects, range inputs and dialogs support keyboard and touch. The model starts paused. System reduced-motion preferences stop decorative ODE arena movement; mathematical and agent motion occur only after explicit play. The arena uses shape as well as colour; the chart uses solid/dashed lines. Accessible labels expose current counts and time. No global arrow-key or space shortcut captures Vibe Deck's navigation.

## Verification
Automated checks cover all four ODE presets over 200 model units, the classical invariant, analytic logistic equilibrium, agent counts/bounds, snapshot round-trip, invalid snapshots, real UI action handlers, and origin-checked message handling. Syntax and local HTTP delivery were checked. Live Vibe Deck integration and visual/device QA have not been performed.
