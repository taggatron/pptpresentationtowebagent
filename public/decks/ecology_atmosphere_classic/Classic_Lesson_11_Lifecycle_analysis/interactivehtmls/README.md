# Inside iPhone — materials and carbon

Open index.html in a browser. The interactive uses local assets and runs without a server, packages or an internet connection.

## What changed
- Rebuilt the layout around a larger phone cutaway, a clear component inspector and a release-year timeline.
- Preserved all nine supplied models, component images, values and source notes.
- Added linked CO₂e and material-mass trend charts with multiple component selection, whole-device comparison, date ranges, percentage changes, accessible data tables and CSV export.
- Added narrow-screen layouts, keyboard controls, visible focus indicators and reduced-motion support.
- Selecting a chart point changes both the explored model and component.

## Data interpretation
The supplied data.js is unchanged. Its component allocations and technical claims are not independently verified. Some component CO₂e sums differ from the reported device totals. The 2025–26 entries are presented as illustrative scenarios and are excluded from comparisons by default.

Materials are measured as mass contained in components, not mined/raw resource inputs. Enclosure and shielding categories change material composition between generations; the comparison groups these by function. Storage configurations also vary. These limitations are visible in the interface and CSV export.

## Verification
Browser checks covered all nine model selectors; pointer and keyboard component selection; linked chart points; multi-component and whole-device comparisons; actual and percentage values; one-year and reversed ranges; excluding scenarios; empty selection; and a 390px mobile layout without page overflow. No browser errors were reported during those checks.

## Chart and layout update
The header navigation and footer are removed. Model timeline buttons now include the original phone thumbnails. Invisible phone hotspots retain click, hover and keyboard interaction without translucent fills or solid outlines.

The inspector contains two animated doughnut charts. The emissions ring shows lifecycle phases for the whole phone or selected component; choosing a phase shows its calculated emissions in the centre. The materials ring shows each component's mass, and selecting a slice updates the phone cutaway, inspector and comparison charts. Paths morph between models and selected slices lift out of the ring. Reduced-motion settings disable animation.

Verified pointer and keyboard slice selection, retained selection across models, phase calculations, reset, all nine thumbnail loads, and a 390px mobile layout without overflow.
