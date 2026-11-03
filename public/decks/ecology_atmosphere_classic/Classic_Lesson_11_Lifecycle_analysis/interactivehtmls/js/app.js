/* Local, dependency-free explorer. All measurements come from the supplied data.js. */
(() => {
'use strict';
const $ = id => document.getElementById(id);
const models = Object.values(IPHONE_MODELS_DATA).sort((a,b)=>a.year-b.year);
const groups = [
  {id:'stainless_steel',label:'Enclosure',color:'#5476a5'},
  {id:'battery',label:'Battery',color:'#237c67'},
  {id:'glass',label:'Glass',color:'#8b8142'},
  {id:'circuit_boards',label:'Circuit boards',color:'#9970ad'},
  {id:'other',label:'Magnets & other',color:'#499ca6'},
  {id:'plastics',label:'Plastics',color:'#b68747'},
  {id:'display',label:'Display',color:'#d27850'},
  {id:'aluminum',label:'Shielding / thermal',color:'#a55869'}
];
const whole = {id:'whole',label:'Whole phone',color:'#264d3b'};
const group = id => id==='whole' ? whole : groups.find(g=>g.id===id);
const state = {model:'xs',component:null, selected:new Set(['stainless_steel','battery','circuit_boards']),from:'xs',to:'16pro',mode:'absolute',scenarios:false};
const num = n => Number.isFinite(n) ? new Intl.NumberFormat('en-GB',{maximumFractionDigits:1}).format(n) : '—';
const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const value = (m,id,metric) => id==='whole' ? (metric==='carbon'?m.overview.totalEmissions:m.overview.totalWeight) : metric==='carbon' ? m.components[id]?.carbonFootprint : m.overview.materialsBreakdown.find(x=>x.id===id)?.weight;
const available = () => models.filter(m=>state.scenarios||m.year<=2024);
const ranged = () => available().filter(m=>m.year>=IPHONE_MODELS_DATA[state.from].year&&m.year<=IPHONE_MODELS_DATA[state.to].year);
const selectedGroups = () => [...state.selected].map(group).filter(Boolean);
// Keep SVG paths stable so selection moves smoothly and model changes morph arcs.
const donutState = new Map();
let activePhase = null;
function arcPath(start, end) {
  const outer=88,inner=64,cx=110,cy=110;
  if(end-start<.00001)return '';
  const point=(r,a)=>[cx+r*Math.cos(a),cy+r*Math.sin(a)];
  const [ax,ay]=point(outer,start),[bx,by]=point(outer,end),[cx1,cy1]=point(inner,end),[dx,dy]=point(inner,start);
  const large=end-start>Math.PI?1:0;
  return `M${ax},${ay} A${outer},${outer} 0 ${large} 1 ${bx},${by} L${cx1},${cy1} A${inner},${inner} 0 ${large} 0 ${dx},${dy} Z`;
}
function drawDonut(hostId,segments,selected,onSelect,onPreview) {
  const host=$(hostId),svgNS='http://www.w3.org/2000/svg';
  let saved=donutState.get(hostId);
  if(!saved){
    const svg=document.createElementNS(svgNS,'svg');svg.setAttribute('viewBox','0 0 220 220');svg.setAttribute('role','group');svg.setAttribute('aria-label',hostId==='emissions-donut'?'Lifecycle emissions by phase':'Material mass by component');
    host.appendChild(svg);saved={svg,paths:new Map(),angles:new Map(),frame:0};donutState.set(hostId,saved);
  }
  cancelAnimationFrame(saved.frame);
  const sum=segments.reduce((s,x)=>s+x.value,0);let angle=-Math.PI/2;
  const moves=[];
  segments.forEach(segment=>{
    const sweep=segment.value/sum*2*Math.PI,gap=Math.min(.024,sweep*.16);
    const start=angle+gap/2,end=angle+sweep-gap/2,mid=angle+sweep/2;angle+=sweep;
    let path=saved.paths.get(segment.id);
    if(!path){path=document.createElementNS(svgNS,'path');path.setAttribute('class','donut-slice');path.setAttribute('tabindex','0');path.setAttribute('role','button');path.dataset.segment=segment.id;saved.svg.appendChild(path);saved.paths.set(segment.id,path);}
    path.setAttribute('fill',segment.color);path.setAttribute('aria-label',segment.label+': '+num(segment.amount)+' '+segment.unit+', '+num(segment.value/sum*100)+'%.');
    path.setAttribute('aria-pressed',String(selected===segment.id));path.style.setProperty('--lift-x',Math.cos(mid)*6+'px');path.style.setProperty('--lift-y',Math.sin(mid)*6+'px');
    path.classList.toggle('is-selected',selected===segment.id);
    path.onclick=()=>onSelect(segment.id);
    path.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onSelect(segment.id);}};
    path.onmouseenter=()=>onPreview(segment.id);path.onmouseleave=()=>onPreview(null);
    path.onfocus=()=>onPreview(segment.id);path.onblur=()=>onPreview(null);
    moves.push({id:segment.id,path,from:saved.angles.get(segment.id)||[start,start],to:[start,end]});
  });
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const started=performance.now();
  function tick(now){
    const t=reduced?1:Math.min(1,(now-started)/480),ease=1-Math.pow(1-t,3);
    moves.forEach(({id,path,from,to})=>{const next=from.map((a,i)=>a+(to[i]-a)*ease);path.setAttribute('d',arcPath(...next));saved.angles.set(id,next);});
    if(t<1)saved.frame=requestAnimationFrame(tick);
  }
  saved.frame=requestAnimationFrame(tick);
}
function renderDonuts(m,c){
  const phases=c?c.emissionsBreakdown:m.overview.emissionsBreakdown;
  const total=c?c.carbonFootprint:m.overview.totalEmissions;
  const colors=['#27684f','#92ad6b','#d4b465','#a8bcad'];
  const labels=['Production','Use','Transport',c?'Recovery':'Recycling'];
  function previewPhase(id){
    const chosen=id===null?activePhase:Number(id),p=chosen===null?null:phases[chosen];
    $('carbon-value').innerHTML=num(p?total*p.percentage/100:total)+'<small>kg CO₂e</small>';
    $('carbon-share').textContent=p?labels[chosen]+' · '+p.percentage+'% of lifecycle':c?num(total/m.overview.totalEmissions*100)+'% of stated device footprint':'Total across the supplied lifecycle';
    document.querySelectorAll('[data-phase]').forEach(el=>el.classList.toggle('phase-highlight',p&&Number(el.dataset.phase)===chosen));
  }
  drawDonut('emissions-donut',phases.map((p,i)=>({id:String(i),label:p.label,value:p.percentage,amount:total*p.percentage/100,color:colors[i],unit:'kg CO₂e'})),activePhase===null?null:String(activePhase),id=>{
    activePhase=activePhase===Number(id)?null:Number(id);
    document.querySelectorAll('#emissions-donut .donut-slice').forEach(el=>{const selected=Number(el.dataset.segment)===activePhase;el.classList.toggle('is-selected',selected);el.setAttribute('aria-pressed',selected);});previewPhase(null);
  },previewPhase);
  drawDonut('materials-donut',groups.map(g=>({id:g.id,label:g.label,value:value(m,g.id,'mass'),amount:value(m,g.id,'mass'),color:g.color,unit:'grams'})),state.component,id=>selectComponent(state.component===id?null:id),id=>{
    showCutaway(id||state.component);
    const selected=id||state.component;
    $('mass-value').innerHTML=num(value(m,selected||'whole','mass'))+'<small>grams</small>';
    $('mass-share').textContent=selected?group(selected).label+' · '+num(value(m,selected,'mass')/m.overview.totalWeight*100)+'% of device mass':'Materials contained in the device';
  });
  document.querySelectorAll('.donut-center').forEach(el=>{el.getAnimations().forEach(a=>a.cancel());if(!matchMedia('(prefers-reduced-motion: reduce)').matches)el.animate([{opacity:.25,transform:'translateY(4px)'},{opacity:1,transform:'translateY(0)'}],{duration:320,easing:'ease-out'});});
}

function selectComponent(id){
  state.component=id;activePhase=null;
  if(id){state.selected=new Set([id]);renderFilters();renderComparison();}
  hotspots.update(id);renderInspector();showCutaway(id);
}
function showCutaway(id){
  const img=$('component-image');
  const baseImg=$('phone-image');
  if(id){
    img.setAttribute('href',IPHONE_MODELS_DATA[state.model].componentImages[id]);
    img.setAttribute('opacity','1');
    if(baseImg) baseImg.setAttribute('opacity','0');
  } else {
    img.setAttribute('opacity','0');
    if(baseImg) baseImg.setAttribute('opacity','1');
  }
  $('phone-hint').textContent=id?group(id).label+' · select to inspect':'Select a phone part or a component in the list';
}
const hotspots = new PhoneHotspots({modelId:state.model,onSelect:selectComponent,onHover:(id,on)=>showCutaway(on?id:state.component)});
function accessibleHotspots(){
  document.querySelectorAll('.phone-mesh-part').forEach(el=>{
    const id=el.dataset.id;
    el.setAttribute('tabindex','0');el.setAttribute('role','button');el.setAttribute('aria-label','Inspect '+group(id).label);
    el.querySelector('title').textContent=IPHONE_MODELS_DATA[state.model].components[id].name;
    el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();selectComponent(state.component===id?null:id);}});
    el.addEventListener('focus',()=>showCutaway(id));el.addEventListener('blur',()=>showCutaway(state.component));
  });
}
function renderTimeline(){
  $('timeline').innerHTML=models.map(m=>`<button class="model-button" data-model="${m.id}" aria-pressed="${state.model===m.id}" aria-label="Explore ${m.name}, ${m.year}${m.year>2024?', illustrative scenario':''}"><span class="year">${m.year}</span><span class="timeline-device"><img src="${m.thumbImage}" alt="" width="42" height="48"><strong>${m.timelineName}</strong></span>${m.year>2024?'<span class="scenario">Illustrative scenario</span>':''}</button>`).join('');
  $('timeline').querySelectorAll('button').forEach(b=>b.onclick=()=>switchModel(b.dataset.model));
}
function switchModel(id){
  state.model=id;activePhase=null;setModelData(id);
  const m=IPHONE_MODELS_DATA[id];
  $('phone-image').setAttribute('href',m.image);
  $('model-name').textContent=m.name;$('model-spec').textContent=m.storage.replace(' model','')+' · '+(m.year>2024?'Illustrative scenario':'Supplied lifecycle dataset');
  $('model-year').textContent=m.year;
  const b=MODEL_HOTSPOT_BOUNDS[id];const left=Math.min(b.front[0],b.back[0])-60;const width=Math.max(b.front[2],b.back[2])-left+60;
  $('phone-scene').setAttribute('viewBox',`${left} 245 ${width} 350`);
  hotspots.renderHotspotMesh(id);accessibleHotspots();hotspots.update(state.component);
  showCutaway(state.component);renderInspector();
  document.querySelectorAll('[data-model]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.model===id));
  renderComparison();
}
function renderInspector(){
  const m=IPHONE_MODELS_DATA[state.model],id=state.component,c=id?m.components[id]:null;
  $('selection-category').textContent=c?'COMPONENT / '+group(id).label:'COMPLETE DEVICE';
  $('selection-name').textContent=c?c.name:'The whole picture';
  $('carbon-value').innerHTML=num(c?c.carbonFootprint:m.overview.totalEmissions)+'<small>kg CO₂e</small>';
  $('mass-value').innerHTML=num(value(m,id||'whole','mass'))+'<small>grams</small>';
  $('carbon-share').textContent=c?num(c.carbonFootprint/m.overview.totalEmissions*100)+'% of stated device footprint':'Total across the supplied lifecycle';
  $('mass-share').textContent=c?num(value(m,id,'mass')/m.overview.totalWeight*100)+'% of device mass':'Materials contained in the device';
  const phases=c?c.emissionsBreakdown:m.overview.emissionsBreakdown;
  const phaseNames=c?['Production','Use','Transport','Recovery']:['Production','Use','Transport','Recycling'];
  const colors=['#27684f','#92ad6b','#d4b465','#a8bcad'];
  $('phase-legend').innerHTML=phases.map((p,i)=>`<span class="phase-item" data-phase="${i}" title="${esc(p.label)}"><span class="dot" style="--dot:${colors[i]}"></span>${phaseNames[i]}<b>${p.percentage}%</b></span>`).join('');
  $('component-list').innerHTML=groups.map(g=>`<button class="component-row" data-component="${g.id}" aria-pressed="${id===g.id}" aria-label="Inspect ${g.label}" style="--dot:${g.color}"><span class="component-name"><span class="dot"></span>${g.label}<span class="tiny-bar" aria-hidden="true"><i style="width:${value(m,g.id,'mass')/m.overview.totalWeight*100}%"></i></span></span><span>${num(value(m,g.id,'mass'))} g</span><span>${num(value(m,g.id,'carbon'))}</span></button>`).join('');
  $('component-list').querySelectorAll('button').forEach(b=>{
    b.onclick=()=>selectComponent(state.component===b.dataset.component?null:b.dataset.component);
    b.onmouseenter=()=>showCutaway(b.dataset.component);b.onmouseleave=()=>showCutaway(state.component);
  });
  $('source-facts').innerHTML=(c?c.quickFacts:m.overview.quickFacts).map(f=>'<li>'+esc(f)+'</li>').join('');
  $('reset').disabled=!id;
  renderDonuts(m,c);
}
function renderOptions(){
  const ms=available();
  if(!ms.some(m=>m.id===state.to))state.to=ms.at(-1).id;
  if(!ms.some(m=>m.id===state.from))state.from=ms[0].id;
  const opts=ms.map(m=>`<option value="${m.id}">${m.year} · ${esc(m.timelineName)}${m.year>2024?' (scenario)':''}</option>`).join('');
  $('from-model').innerHTML=opts;$('to-model').innerHTML=opts;
  $('from-model').value=state.from;$('to-model').value=state.to;
}
function renderFilters(){
  $('component-filters').innerHTML=groups.map(g=>`<button class="filter" data-filter="${g.id}" aria-pressed="${state.selected.has(g.id)}" style="--dot:${g.color}"><span class="dot"></span>${g.label}<span class="check" aria-hidden="true">✓</span></button>`).join('');
  $('component-filters').querySelectorAll('button').forEach(b=>b.onclick=()=>{
    const id=b.dataset.filter;state.selected.delete('whole');state.selected.has(id)?state.selected.delete(id):state.selected.add(id);
    b.setAttribute('aria-pressed',state.selected.has(id));renderComparison();
  });
  $('whole-phone').setAttribute('aria-pressed',state.selected.has('whole'));
}
function delta(a,b){
  if(!Number.isFinite(a)||!Number.isFinite(b))return '—';
  const d=b-a,p=a?Math.abs(d/a*100):null;
  return `<span class="delta ${d>0?'increase':''}">${d>0?'↑':d<0?'↓':'='} ${p===null?'n/a':num(p)+'%'}</span>`;
}
function chart(metric){
  const ms=ranged(),gs=selectedGroups();
  if(!gs.length)return '<div class="empty-chart">Choose one or more components above to compare.</div>';
  const indexed=state.mode==='indexed';
  const get=(m,g)=>{const v=value(m,g.id,metric),first=value(ms[0],g.id,metric);return indexed?(first?((v-first)/first*100):null):v;};
  const values=gs.flatMap(g=>ms.map(m=>get(m,g))).filter(Number.isFinite);
  let lo=indexed?Math.min(0,...values):0,hi=Math.max(0,...values);
  const span=hi-lo||1;const step=Math.pow(10,Math.floor(Math.log10(span/4)));const tickStep=Math.ceil(span/4/step)*step;
  lo=Math.floor(lo/tickStep)*tickStep;hi=Math.ceil(hi/tickStep)*tickStep;if(hi===lo)hi=lo+tickStep*4;
  const W=540,H=272,L=43,R=22,T=16,B=44,pw=W-L-R,ph=H-T-B;
  const x=m=>L+(ms.length===1?pw/2:(m.year-ms[0].year)/(ms.at(-1).year-ms[0].year)*pw);
  const y=v=>T+(hi-v)/(hi-lo)*ph;
  let s=`<svg viewBox="0 0 ${W} ${H}" role="group" aria-label="${metric==='carbon'?'Component CO₂e':'Material mass'} over release years${indexed?', percentage change from first year':''}"><title>${metric==='carbon'?'Component CO₂e':'Material mass'} by generation. Full values in the table below.</title>`;
  for(let v=lo;v<=hi+tickStep*.001;v+=tickStep)s+=`<line class="grid-line" x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}"/><text x="${L-10}" y="${y(v)+3}" text-anchor="end">${num(v)}${indexed?'%':''}</text>`;
  const sc=ms.filter(m=>m.year>2024);
  if(sc.length){const sx=Math.max(L,x(sc[0])-(ms.length>1?pw/(ms.length-1)/2:pw/2));s+=`<rect x="${sx}" y="${T}" width="${W-R-sx}" height="${ph}" fill="#b9ab6520"/><text x="${sx+5}" y="${T+11}" style="font-size:8px">SCENARIOS</text>`;}
  const active=ms.find(m=>m.id===state.model);
  if(active)s+=`<line x1="${x(active)}" x2="${x(active)}" y1="${T}" y2="${H-B}" stroke="#b1beab" stroke-dasharray="3 4"/>`;
  for(const g of gs){
    // Draw each segment separately so scenario transitions can be dashed.
    for(let i=1;i<ms.length;i++){const a=get(ms[i-1],g),b=get(ms[i],g);if(Number.isFinite(a)&&Number.isFinite(b))s+=`<path class="series-line" d="M${x(ms[i-1])},${y(a)} L${x(ms[i])},${y(b)}" stroke="${g.color}" ${ms[i].year>2024?'stroke-dasharray="5 5"':''}/>`;}
    ms.forEach(m=>{const v=get(m,g);if(!Number.isFinite(v))return;s+=`<circle class="plot-point" cx="${x(m)}" cy="${y(v)}" r="${m.id===state.model?4.7:3.5}" fill="white" stroke="${g.color}" tabindex="0" role="button" data-point-model="${m.id}" data-point-group="${g.id}" data-point-metric="${metric}" aria-label="${esc(g.label)}, ${esc(m.name)}, ${m.year}: ${num(value(m,g.id,metric))} ${metric==='carbon'?'kg CO₂e':'grams'}${indexed?', '+num(v)+' percent change':''}. Select to explore model."/>`;});
  }
  for(const m of ms)s+=`<text x="${x(m)}" y="${H-25}" text-anchor="middle" ${m.id===state.model?'style="fill:#213e35;font-weight:700"':''}>${m.year}</text><text x="${x(m)}" y="${H-10}" text-anchor="middle" style="font-size:8px">${esc(m.timelineName)}</text>`;
  return s+'</svg>';
}
function bindPoints(){
  const tooltip=$('chart-tooltip');
  document.querySelectorAll('.plot-point').forEach(el=>{
    function show(e){const m=IPHONE_MODELS_DATA[el.dataset.pointModel],g=group(el.dataset.pointGroup);tooltip.innerHTML=`<strong>${esc(g.label)} · ${m.year}</strong>${esc(m.name)}${m.year>2024?' · scenario':''}<br>${num(value(m,g.id,'carbon'))} kg CO₂e &nbsp; / &nbsp; ${num(value(m,g.id,'mass'))} g`;
      tooltip.hidden=false;const r=el.getBoundingClientRect();const px=e?.clientX??r.x,py=e?.clientY??r.y;tooltip.style.left=Math.max(8,Math.min(innerWidth-tooltip.offsetWidth-12,px+12))+'px';tooltip.style.top=Math.max(8,Math.min(innerHeight-tooltip.offsetHeight-12,py+14))+'px';}
    el.addEventListener('pointerenter',show);el.addEventListener('focus',()=>show());el.addEventListener('pointerleave',()=>tooltip.hidden=true);el.addEventListener('blur',()=>tooltip.hidden=true);
    function activate(){tooltip.hidden=true;const id=el.dataset.pointModel,g=el.dataset.pointGroup,metric=el.dataset.pointMetric;state.component=g==='whole'?null:g;switchModel(id);document.querySelector(`[data-point-model="${id}"][data-point-group="${g}"][data-point-metric="${metric}"]`)?.focus({preventScroll:true});}
    el.addEventListener('click',activate);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate();}});
  });
}
function renderComparison(){
  $('chart-tooltip').hidden=true;
  const ms=ranged(),gs=selectedGroups(),a=ms[0],b=ms.at(-1);
  const excluded=!ms.some(m=>m.id===state.model);
  $('comparison-status').textContent=gs.length?`${gs.length===1?gs[0].label:gs.length+' component groups'} · ${a.year}–${b.year} · ${ms.length} generation${ms.length===1?'':'s'}${excluded?' · The phone shown above is outside this comparison range.':''}`:'Choose a component to begin your comparison.';
  $('carbon-unit').textContent=state.mode==='indexed'?'% change from '+a.year:'kg CO₂e / device';
  $('mass-unit').textContent=state.mode==='indexed'?'% change from '+a.year:'grams / device';
  $('carbon-chart').innerHTML=chart('carbon');$('mass-chart').innerHTML=chart('mass');bindPoints();
  $('comparison-caption').textContent=`From ${a.name} (${a.year}) to ${b.name} (${b.year})${b.year>2024?' · includes illustrative scenarios':''}`;
  $('comparison-table').querySelector('tbody').innerHTML=gs.length?gs.map(g=>`<tr><td><span class="dot" style="--dot:${g.color}"></span>${g.label}</td><td>${num(value(a,g.id,'carbon'))} → ${num(value(b,g.id,'carbon'))} kg</td><td>${delta(value(a,g.id,'carbon'),value(b,g.id,'carbon'))}</td><td>${num(value(a,g.id,'mass'))} → ${num(value(b,g.id,'mass'))} g</td><td>${delta(value(a,g.id,'mass'),value(b,g.id,'mass'))}</td></tr>`).join(''):'<tr><td colspan="5">No components selected.</td></tr>';
  $('all-values-table').innerHTML='<table><thead><tr><th scope="col">Model / year</th><th scope="col">Component</th><th scope="col">kg CO₂e</th><th scope="col">Mass (g)</th></tr></thead><tbody>'+ms.flatMap(m=>gs.map(g=>`<tr><td>${esc(m.name)} · ${m.year}${m.year>2024?' (scenario)':''}</td><td>${g.label}</td><td>${num(value(m,g.id,'carbon'))}</td><td>${num(value(m,g.id,'mass'))}</td></tr>`)).join('')+'</tbody></table>';
  $('download').disabled=!gs.length;
  $('whole-phone').setAttribute('aria-pressed',state.selected.has('whole'));
}
$('reset').onclick=()=>selectComponent(null);
$('select-all').onclick=()=>{state.selected=new Set(groups.map(g=>g.id));renderFilters();renderComparison();};
$('whole-phone').onclick=()=>{state.selected=new Set(['whole']);renderFilters();renderComparison();};
$('include-scenarios').onchange=e=>{state.scenarios=e.target.checked;renderOptions();renderComparison();};
$('from-model').onchange=e=>{state.from=e.target.value;if(IPHONE_MODELS_DATA[state.from].year>IPHONE_MODELS_DATA[state.to].year)state.to=state.from;renderOptions();renderComparison();};
$('to-model').onchange=e=>{state.to=e.target.value;if(IPHONE_MODELS_DATA[state.to].year<IPHONE_MODELS_DATA[state.from].year)state.from=state.to;renderOptions();renderComparison();};
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{state.mode=b.dataset.mode;document.querySelectorAll('[data-mode]').forEach(x=>x.setAttribute('aria-pressed',x===b));renderComparison();});
$('download').onclick=()=>{
  const rows=[['Model','Release year','Storage','Component group','Material label in source','CO2e (kg/device)','Material mass (g/device)','Data status','Measurement note']];
  for(const m of ranged())for(const g of selectedGroups())rows.push([m.name,m.year,m.storage,g.label,g.id==='whole'?'Whole phone':m.overview.materialsBreakdown.find(x=>x.id===g.id)?.label,value(m,g.id,'carbon'),value(m,g.id,'mass'),m.year>2024?'Illustrative scenario':'Supplied; unverified','Component mass, not extracted raw resources; component CO2e may not sum to stated total']);
  const csv=rows.map(row=>row.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(',')).join('\r\n');
  const url=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8;'})),a=document.createElement('a');a.href=url;a.download=`iphone-components-${IPHONE_MODELS_DATA[state.from].year}-${IPHONE_MODELS_DATA[state.to].year}.csv`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
};
document.addEventListener('keydown',e=>{if(e.key==='Escape'){selectComponent(null);$('chart-tooltip').hidden=true;}});
renderTimeline();renderOptions();renderFilters();switchModel('xs');
})();
