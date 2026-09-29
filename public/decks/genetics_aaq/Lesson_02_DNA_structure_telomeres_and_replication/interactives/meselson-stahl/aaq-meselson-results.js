const colours = { heavy: '#7953b4', hybrid: '#b370b9', light: '#178e9c', mixed: '#a16ec2' };
const percent = fraction => `${Number((fraction * 100).toFixed(2))}%`;
const models = [
  { id: 'semiconservative', name: 'Semi-conservative', mechanism: 'One old strand + one new strand' },
  { id: 'conservative', name: 'Conservative', mechanism: 'The parental double helix stays together' },
  { id: 'dispersive', name: 'Dispersive', mechanism: 'Old and new DNA interspersed in each strand' },
];

function densityTube(bands, name) {
  const description = bands.map(band => `${percent(band.fraction)} ${band.type} DNA at ${band.density === 0 ? 'light' : band.density === 1 ? 'heavy' : band.density === .5 ? 'intermediate' : `${percent(band.density)} of the way from light to heavy`} density`).join('; ');
  return `<svg viewBox="0 0 94 150" role="img" aria-label="${name}: ${description}">
    <path d="M23 12H65V119Q65 140 44 140Q23 140 23 119Z" fill="#edf5f5" stroke="#b2c9d0" stroke-width="2"/>
    <path d="M26 27H62V119Q62 137 44 137Q26 137 26 119Z" fill="#dbe9f5"/>
    <path d="M29 31V116" stroke="white" stroke-width="3" opacity=".8"/>
    ${[34, 78, 122].map((y, index) => `<path d="M19 ${y}H69" stroke="#7897a0" stroke-dasharray="2 3" opacity=".45"/><text x="74" y="${y + 3}" font-size="8" fill="#67848e">${['L', '½', 'H'][index]}</text>`).join('')}
    ${bands.map(band => `<rect x="26" y="${34 + band.density * 88 - (3 + band.fraction * 7) / 2}" width="36" height="${3 + band.fraction * 7}" rx="2" fill="${colours[band.type]}" opacity="${.55 + band.fraction * .45}"/>`).join('')}
    <path d="M21 11H67" stroke="#90aeb9" stroke-width="4" stroke-linecap="round"/>
  </svg>`;
}

export function renderMeselsonResults(rows, selectedGeneration) {
  if (!rows.length) return '<div class="aaq-panel-heading"><h2>DNA evidence notebook</h2><span>0 saved</span></div><div class="aaq-empty"><span>🧬</span><strong>Follow the evidence</strong><p>Complete and record a trial. Compare generations 1 and 2 to distinguish the replication models.</p></div>';
  const row = rows.findLast(item => item.generation === selectedGeneration) || rows.at(-1);
  const generations = [...new Set(rows.map(item => item.generation))].sort((a, b) => a - b);
  return `<div class="aaq-panel-heading"><h2>DNA evidence notebook</h2><span>${rows.length} saved</span></div>
    <p class="aaq-panel-intro">Inspect a recorded generation. Coloured bands are schematic; lighter DNA is nearer the top.</p>
    <div class="aaq-dna-generations" role="group" aria-label="Inspect recorded generation">${generations.map(generation => `<button data-dna-generation="${generation}" aria-pressed="${row.generation === generation}">Gen ${generation}</button>`).join('')}</div>
    <div class="aaq-dna-heading"><h3>Generation ${row.generation}</h3><span>MODEL PREDICTIONS</span></div>
    <div class="aaq-dna-predictions">${models.map(model => {
      const matches = row.generation === 0 || model.id === 'semiconservative' || (row.generation === 1 && model.id === 'dispersive');
      const bands = row.predictions[model.id];
      return `<figure class="aaq-dna-prediction${model.id === 'semiconservative' ? ' is-supported' : ''}"><figcaption>${model.name}</figcaption>${densityTube(bands, model.name)}<span class="aaq-dna-verdict${matches ? ' matches' : ''}">${row.generation === 0 ? 'Control' : matches ? 'Fits this trial' : 'Does not fit'}</span><p>${model.mechanism}</p><small>${bands.map(band => `${percent(band.fraction)} ${band.type}`).join('<br>')}</small></figure>`;
    }).join('')}</div>
    <p class="aaq-dna-key"><span>H · heavy ¹⁵N/¹⁵N</span><span>½ · intermediate density</span><span>L · light ¹⁴N/¹⁴N</span></p>
    <div class="aaq-result-explanation" aria-live="polite"><strong>What this generation tells us</strong><p>${row.explanation}</p></div>
    <div class="aaq-table-scroll"><table><caption>Meselson–Stahl · idealised DNA band proportions with equal DNA loading</caption><thead><tr><th>Trial</th><th>Gen.</th><th>Heavy<small>%</small></th><th>Hybrid<small>%</small></th><th>Light<small>%</small></th></tr></thead><tbody>${rows.map(item => `<tr><td>${item.trial}</td><td>${item.generation}</td><td>${percent(item.heavyFraction)}</td><td>${percent(item.hybridFraction)}</td><td>${percent(item.lightFraction)}</td></tr>`).join('')}</tbody></table></div>
    <button class="aaq-button aaq-export" id="aaq-export">↓ DOWNLOAD RESULTS (.CSV)</button>
    <details class="aaq-detail"><summary>How to interpret the bands</summary><p>These idealised proportions reproduce the distinguishing pattern of the historical experiment. They are not the original measured data. DNA forms equilibrium bands in a CsCl density gradient; it does not form a pellet or separate by fragment length.</p><p>At equal total DNA loading, relative band intensity indicates the DNA fraction. The diagram exaggerates faint bands for readability. Actual bands were detected using UV absorption, not these colours. Dispersive DNA contains interspersed old and new material in both strands.</p></details>
    <a class="aaq-source-link" href="https://authors.library.caltech.edu/records/pggy5-n0t48" target="_blank" rel="noreferrer">Meselson &amp; Stahl · original 1958 paper ↗</a>`;
}
