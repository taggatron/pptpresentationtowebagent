(()=>{'use strict';
const $=id=>document.getElementById(id),{Simulation,presets}=Ecology;
let sim=new Simulation(),running=false,speed=1,view='timeline',explained=false,last=0,accumulator=0,redraw=true,remote=false,toastTimer;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const colors={prey:'#86ecb7',predator:'#ffad72'};
const arena=$('arena'),chart=$('chart'),ac=arena.getContext('2d'),cc=chart.getContext('2d');
const meta=[['a','α','Prey birth rate',.1,1.5,.05,'How quickly prey reproduce without predation.'],['b','β','Hunting efficiency',.005,.06,.001,'How strongly predators reduce prey numbers.'],['g','γ','Predator death rate',.1,1.2,.05,'How quickly predators decline without enough prey.'],['d','δ','Predator reproduction',.005,.04,.001,'How strongly feeding supports predator offspring.']];
for(const [key,symbol,label,min,max,step,hint] of meta){const row=document.createElement('div');row.className='parameter';row.innerHTML=`<label for="param-${key}">${symbol} &nbsp; ${label}</label><output id="value-${key}" for="param-${key}"></output><input id="param-${key}" type="range" min="${min}" max="${max}" step="${step}" aria-describedby="hint-${key}"><small id="hint-${key}">${hint}</small>`;$('sliders').append(row);$('param-'+key).addEventListener('input',e=>{takeControl();sim.params[key]=Number(e.target.value);updateSettings();redraw=true;publish('parameter')})}
function updateSettings(){for(const [key] of meta){$('param-'+key).value=sim.params[key];$('value-'+key).value=sim.params[key].toFixed(key==='a'||key==='g'?2:3)}$('logistic').checked=sim.params.logistic;$('capacity').disabled=!sim.params.logistic;$('capacity').value=sim.params.k;$('capacity-value').value=sim.params.k;$('equation-prey').textContent=sim.params.logistic?'dN/dt = αN(1 − N/K) − βNP':'dN/dt = αN − βNP';$('model-note').textContent=sim.mode==='math'?'An idealised Lotka–Volterra model, solved with fourth-order Runge–Kutta integration. Populations are continuous estimates; arena marks are illustrative.':'A stochastic encounter model. The same sliders control individual birth, hunting, starvation and offspring probabilities; these rates are not directly equivalent to the population equations. The arena drives the graph.'}
function update(){const p=presets[sim.biome];$('ecosystem').value=sim.biome;$('biome-label').textContent=p.name.toUpperCase();$('prey-label').textContent=p.prey;$('predator-label').textContent=p.predator;$('prey-count').textContent=Math.round(sim.x).toLocaleString();$('predator-count').textContent=Math.round(sim.y).toLocaleString();$('time').textContent=sim.time.toFixed(1);$('play-text').textContent=running?'Pause simulation':'Run simulation';$('play').firstElementChild.textContent=running?'Ⅱ':'▶';$('status').textContent=sim.stopReason?'MODEL STOPPED':running?'OBSERVING LIVE':sim.time?'PAUSED':'READY TO OBSERVE';$('status').classList.toggle('running',running);$('mode-math').setAttribute('aria-pressed',sim.mode==='math');$('mode-agent').setAttribute('aria-pressed',sim.mode==='agent');$('timeline').setAttribute('aria-pressed',view==='timeline');$('phase').setAttribute('aria-pressed',view==='phase');$('speed').textContent=speed+'×';$('speed').setAttribute('aria-label','Simulation speed: '+speed+' times');$('chart-empty').hidden=sim.time>.15||sim.events.length>0;$('arena-caption').textContent=sim.mode==='agent'?'Individuals move, hunt and reproduce':Math.max(sim.x,sim.y)>140?'Illustrative marks · populations shown above':'Illustrative marks · one per estimated individual';$('arena-description').textContent=sim.mode==='agent'?'Encounters drive the population.':'The population model drives this view.';$('observation').textContent=explained?'More prey means more food. Predators increase after a delay, reducing prey. With less food, predators then decline.':'When prey increase, what happens to predators next?';$('explain').setAttribute('aria-expanded',explained);$('explain').innerHTML=explained?'Hide explanation':'Reveal why <span aria-hidden="true">↗</span>';chart.setAttribute('aria-label',`${view==='timeline'?'Population over time':'Phase portrait'}: ${p.prey} ${sim.x.toFixed(1)}, ${p.predator} ${sim.y.toFixed(1)} at time ${sim.time.toFixed(1)}.`)}
function notify(text){$('message').textContent=text;$('message').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('message').classList.remove('visible'),4200)}
function takeControl(){remote=false}
function restart(){takeControl();sim.reset();running=false;last=0;accumulator=0;updateSettings();update();redraw=true;publish('reset')}
$('play').onclick=()=>{takeControl();if(sim.stopReason){notify(sim.stopReason);return}running=!running;last=0;update();publish(running?'play':'pause')};$('reset').onclick=restart;
$('speed').onclick=()=>{takeControl();speed=speed===1?2:speed===2?4:1;update();publish('speed')};
$('ecosystem').onchange=e=>{sim.biome=e.target.value;restart()};
for(const mode of ['math','agent'])$('mode-'+mode).onclick=()=>{if(mode===sim.mode)return;sim.mode=mode;restart();notify(mode==='agent'?'Agent model: each individual now drives the outcome.':'Population model: smooth, idealised population cycles.')};
for(const [id,value]of[['timeline','timeline'],['phase','phase']])$(id).onclick=()=>{takeControl();view=value;update();redraw=true;publish('chart')};
$('explain').onclick=()=>{takeControl();explained=!explained;update();publish('explanation')};
function change(type){if(sim.stopReason){notify('Reset the model before making another change.');return}takeControl();sim.intervene(type);update();redraw=true;notify({famine:'Prey reduced by 75%. What happens to predators next?',disease:'Predators reduced by 80%. Will prey recover?',fire:'Both populations halved. Watch how they recover.',add:'10 prey added. Watch for the delayed response.'}[type]);publish(type)}
document.querySelectorAll('[data-event]').forEach(b=>b.onclick=()=>change(b.dataset.event));$('add-prey').onclick=()=>change('add');
$('settings').onclick=()=>{updateSettings();$('model-dialog').showModal()};$('info').onclick=()=>$('about-dialog').showModal();
$('logistic').onchange=e=>{takeControl();sim.params.logistic=e.target.checked;updateSettings();publish('resources')};$('capacity').oninput=e=>{takeControl();sim.params.k=Number(e.target.value);updateSettings();publish('capacity')};$('restore').onclick=()=>{takeControl();const p=presets[sim.biome];sim.params={a:p.a,b:p.b,g:p.g,d:p.d,k:200,logistic:false};updateSettings();publish('defaults');notify('Model settings restored. Populations and time are unchanged.')};
function dimensions(canvas,ctx){const r=canvas.getBoundingClientRect(),dpr=Math.min(2,devicePixelRatio||1);if(canvas.width!==Math.round(r.width*dpr)||canvas.height!==Math.round(r.height*dpr)){canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr)}ctx.setTransform(dpr,0,0,dpr,0,0);return[r.width,r.height]}
function drawArena(){const [w,h]=dimensions(arena,ac);ac.clearRect(0,0,w,h);if(w<1||h<1)return;ac.fillStyle='#253e46';for(let x=14;x<w;x+=24)for(let y=10;y<h-20;y+=24){ac.beginPath();ac.arc(x,y,.65,0,Math.PI*2);ac.fill()}
const draw=(u,v,angle,type)=>{const x=12+u*(w-24),y=8+v*Math.max(10,h-42);ac.save();ac.translate(x,y);ac.fillStyle=colors[type];if(type==='prey'){ac.beginPath();ac.arc(0,0,3.1,0,Math.PI*2);ac.fill();ac.strokeStyle='#86ecb71c';ac.lineWidth=5;ac.stroke()}else{ac.rotate(angle+Math.PI/2);ac.beginPath();ac.moveTo(0,-6);ac.lineTo(4.5,4);ac.lineTo(-4.5,4);ac.closePath();ac.fill();ac.strokeStyle='#ffad7218';ac.lineWidth=6;ac.stroke()}ac.restore()};
if(sim.mode==='agent'){for(const a of sim.agents)draw(a.u,a.v,a.angle,a.type)}else{for(const[type,count]of[['prey',sim.x],['predator',sim.y]])for(let i=0;i<Math.min(140,Math.round(count));i++){const t=reduced?0:sim.time*.07,seed=i+(type==='predator'?453:12);const u=.06+(((Math.sin(seed*17.12)*4231.23)%1+1)%1)*.86;const v=.08+(((Math.cos(seed*71.3)*2341.41)%1+1)%1)*.80;draw(Math.max(.025,Math.min(.975,u+Math.sin(t+seed)*.035)),Math.max(.025,Math.min(.975,v+Math.cos(t*.8+seed)*.04)),t+seed,type)}}}
function niceMax(n){const exponent=Math.pow(10,Math.floor(Math.log10(Math.max(n,10)))),f=n/exponent;return(f<=1?1:f<=2?2:f<=5?5:10)*exponent}
function drawChart(){const [w,h]=dimensions(chart,cc);cc.clearRect(0,0,w,h);if(w<90||h<70)return;const left=44,right=w-18,top=18,bottom=h-33,cw=right-left,ch=bottom-top;const history=sim.history.filter(p=>p.t>=Math.max(0,sim.time-45));const xmax=view==='phase'?niceMax(Math.max(30,...history.map(p=>p.x))*1.15):Math.max(30,sim.time);const xmin=view==='phase'?0:Math.max(0,xmax-45);const ymax=niceMax(Math.max(30,...history.map(p=>view==='phase'?p.y:Math.max(p.x,p.y)))*1.15);const px=n=>left+(n-xmin)/(xmax-xmin)*cw,py=n=>bottom-n/ymax*ch;
cc.font='11px system-ui';cc.textBaseline='middle';cc.lineWidth=1;for(let i=0;i<=4;i++){const y=bottom-i*ch/4;cc.strokeStyle='#29404b';cc.setLineDash([2,5]);cc.beginPath();cc.moveTo(left,y);cc.lineTo(right,y);cc.stroke();cc.fillStyle='#9bb1bd';cc.textAlign='right';cc.fillText(Math.round(ymax*i/4).toLocaleString(),left-9,y)}cc.setLineDash([]);for(let i=0;i<=4;i++){cc.fillStyle='#9bb1bd';cc.textAlign='center';cc.fillText((xmin+(xmax-xmin)*i/4).toFixed(0),left+cw*i/4,bottom+14)}cc.fillStyle='#9bb1bd';cc.textAlign='left';cc.fillText(view==='phase'?'Predators':'Population',left,7);cc.textAlign='right';cc.fillText(view==='phase'?'Prey':'Time · model units',right,h-3);
cc.save();cc.beginPath();cc.rect(left,top,cw,ch);cc.clip();if(view==='timeline'){for(const e of sim.events){if(e.t<xmin)continue;const x=px(e.t);cc.strokeStyle='#9bb1bd88';cc.setLineDash([3,4]);cc.beginPath();cc.moveTo(x,top);cc.lineTo(x,bottom);cc.stroke();cc.setLineDash([]);cc.fillStyle='#bdccd3';cc.font='10px system-ui';cc.textAlign=x>right-70?'right':'left';cc.fillText({famine:'Famine',disease:'Disease',fire:'Habitat loss',add:'+10 prey'}[e.type],x+3,top+9)}for(const [key,color]of[['x',colors.prey],['y',colors.predator]]){cc.lineWidth=2.4;cc.strokeStyle=color;cc.setLineDash(key==='y'?[6,4]:[]);cc.beginPath();history.forEach((p,i)=>i?cc.lineTo(px(p.t),py(p[key])):cc.moveTo(px(p.t),py(p[key])));cc.stroke();cc.setLineDash([]);cc.fillStyle=color;cc.beginPath();cc.arc(px(sim.time),py(sim[key]),4,0,Math.PI*2);cc.fill()}}else{cc.lineWidth=2.3;cc.strokeStyle=colors.prey;cc.beginPath();history.forEach((p,i)=>i?cc.lineTo(px(p.x),py(p.y)):cc.moveTo(px(p.x),py(p.y)));cc.stroke();cc.fillStyle=colors.predator;cc.beginPath();cc.arc(px(sim.x),py(sim.y),5,0,Math.PI*2);cc.fill()}cc.restore()}
new ResizeObserver(()=>{redraw=true}).observe($('workspace')||document.querySelector('.workspace'));
function frame(now){const delta=last?Math.min(.1,(now-last)/1000):0;last=now;if(running&&!remote&&!document.hidden){accumulator+=delta*speed*1.5;while(accumulator>=.02){sim.step(.02);accumulator-=.02;if(sim.stopReason){running=false;accumulator=0;notify(sim.stopReason);publish('stopped');break}}redraw=true}if(redraw){update();drawArena();drawChart();redraw=false}requestAnimationFrame(frame)}
// Vibe Deck's public embed bridge uses these exact message names.
// Accept only the actual parent window on a known host; never follow arbitrary origins.
const allowedParents=new Set(['https://pptpresentationtowebagent.vercel.app',location.origin]);
const embedded=window.parent!==window;let parentOrigin=location.origin||'https://pptpresentationtowebagent.vercel.app';
const activityUrl=new URL(location.href);activityUrl.searchParams.delete('presentation');
const interactiveUrl=activityUrl.pathname;
const syncChannel=typeof BroadcastChannel!=='undefined'?new BroadcastChannel('slideshow_interactive_sync'):null;
// The audience display mirrors snapshots instead of running a second random simulation.
if(embedded&&new URL(location.href).searchParams.get('presentation')==='1')remote=true;
try{const o=new URL(document.referrer).origin;if(allowedParents.has(o))parentOrigin=o}catch(_){}
function state(){return{simulation:sim.snapshot(),running,speed,view,explained}}
function publish(action){
  if(!embedded||remote)return;
  const payload={type:'INTERACTIVE_STATE_UPDATE',interactiveId:'natural-dynamics',interactiveUrl,state:state(),action,timestamp:Date.now()};
  try{window.parent.postMessage(payload,'*')}catch(_){}
  if(syncChannel){try{syncChannel.postMessage(payload)}catch(_){}}
}
function applyPayload(data){
  if(!data||typeof data!=='object')return;
  if(data.type==='REQUEST_INTERACTIVE_STATE'){publish('state_reply');return}
  if(data.type!=='APPLY_INTERACTIVE_STATE'&&data.type!=='INTERACTIVE_STATE_UPDATE'&&data.type!=='INTERACTIVE_SYNC')return;
  if(data.interactiveId&&data.interactiveId!=='natural-dynamics')return;
  const s=data.state;
  if(!s||typeof s.running!=='boolean'||![1,2,4].includes(s.speed)||!['timeline','phase'].includes(s.view)||typeof s.explained!=='boolean')return;
  if(!sim.apply(s.simulation))return;
  remote=true;running=s.running;speed=s.speed;view=s.view;explained=s.explained;accumulator=0;last=0;updateSettings();update();redraw=true;
}
window.addEventListener('message',event=>{
  if(event.source!==window.parent&&!allowedParents.has(event.origin))return;
  applyPayload(event.data);
});
if(syncChannel){
  syncChannel.onmessage=event=>{applyPayload(event.data)};
}
setInterval(()=>{if(running&&!remote)publish('tick')},500);
document.addEventListener('visibilitychange',()=>{last=0;accumulator=0;if(!document.hidden)redraw=true});
document.addEventListener('keydown',event=>{
  if(event.key==='PageDown'||event.key==='PageUp'){
    try{window.parent.postMessage({type:'NAVIGATE',direction:event.key==='PageDown'?1:-1},'*')}catch(_){}
  }
});
updateSettings();update();requestAnimationFrame(frame);if(embedded){
  const req={type:'REQUEST_INTERACTIVE_STATE',interactiveId:'natural-dynamics',interactiveUrl};
  try{window.parent.postMessage(req,'*')}catch(_){}
  if(syncChannel){try{syncChannel.postMessage(req)}catch(_){}}
}
})();
