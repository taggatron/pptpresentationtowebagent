(() => {
'use strict';
const $ = s => document.querySelector(s);
const scene = $('#laboratory'), canvas = $('#particles'), ctx = canvas.getContext('2d');
const dustCanvas = $('#dust'), dustCtx = dustCanvas.getContext('2d');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let paused = reduced.matches, sound = false, audio, w=scene.clientWidth, h=scene.clientHeight, clock=0, last=0, count=0, feedbackTimer;
let pointer={x:.5,y:.5}, particles=[], waves=[], active=new Map(), sequence=0;
let productsReady=false,productsStartedAt=Infinity,reactantsCompleteAt=null;
let cellSelection=null,selectionToken=0;
const cellTransfers=[];
// Confirmed products in Miller's spark-discharge work (1953 / expanded 1955 report).
// Cellular roles describe later biological processing, not structures made in the flask.
const organic = [
 {name:'Glycine',formula:'C₂H₅NO₂',organic:true,color:'#39f5ad',location:'Cytoplasm',target:[.282,.643],feature:'protein',
  why:'An amino acid made in the experiment. In cells, glycine joins other amino acids to build proteins.',
  found:'Free glycine occurs in the cytosol, the fluid part of the cytoplasm.',
  role:'Cells join amino acids into proteins: enzymes, membrane channels and structural fibres.',
  route:'Amino acid → proteins',evidence:'Identified in the 1953 experiment.'},
 {name:'Alanine',formula:'C₃H₇NO₂',organic:true,color:'#26d9ff',location:'Cytoplasm',target:[.185,.437],feature:'protein',
  why:'A protein-building amino acid made in the experiment. The glow shows its cellular context.',
  found:'Free alanine is part of the cytosolic amino-acid pool.',
  role:'Ribosomes join alanine with other amino acids. Those proteins work throughout the cell.',
  route:'Amino acid → proteins',evidence:'Identified in the 1953 experiment.'},
 {name:'Acetic acid',formula:'CH₃COOH',organic:true,color:'#ff4ecb',location:'Cytoplasm → membrane lipids',target:[.171,.535],feature:'membrane',
  why:'Reported in Miller’s 1955 experiments. Cells can process acetate into carbon for fatty acids and membrane lipids.',
  found:'In cells, acetate can become acetyl-CoA in the cytosol.',
  role:'Cells use this carbon to build fatty acids for membrane lipids.',
  route:'Acetate → fatty acids → lipids',evidence:'Reported in Miller’s 1955 experiments.'},
 {name:'Lactic acid',formula:'C₃H₆O₃',organic:true,color:'#ffb629',location:'Cytoplasm → mitochondrion',target:[.311,.668],feature:'mitochondrion',
  why:'Reported in Miller’s 1955 experiments. In cells, lactate can become pyruvate and help fuel mitochondrial ATP production.',
  found:'Cells convert lactate to pyruvate in the cytosol.',
  role:'Pyruvate can fuel mitochondrial ATP production. This supplies energy rather than cell structure.',
  route:'Lactate → pyruvate → energy',evidence:'Reported in Miller’s 1955 experiments.'}
];
const inorganic = [
 ['Sodium chloride','NaCl','Table salt is an inorganic ionic compound.'],
 ['Calcium carbonate','CaCO₃','Carbonates are classified as inorganic, despite containing carbon.'],
 ['Carbon monoxide','CO','Like carbon dioxide, carbon monoxide is an inorganic carbon oxide.']
].map(([name,formula,why])=>({name,formula,why,organic:false}));
const reactantData=[
 {name:'Water vapour',formula:'H₂O',start:0,x:.17},
 {name:'Methane',formula:'CH₄',start:2.5,x:.82},
 {name:'Ammonia',formula:'NH₃',start:5,x:.29},
 {name:'Hydrogen',formula:'H₂',start:7.5,x:.70}
];
// Feed gases never enter the interactive output pool, including future additions.
const feedFormulas=new Set(reactantData.map(r=>r.formula));
const compoundPool=[...organic,...inorganic].filter(c=>!feedFormulas.has(c.formula));
const deck=[organic[0],inorganic[0],organic[1],inorganic[1]];
function formulaMarkup(formula){return formula.replace(/[₀-₉]+/g,m=>'<sub>'+m.replace(/[₀-₉]/g,c=>'₀₁₂₃₄₅₆₇₈₉'.indexOf(c))+'</sub>');}
// Reserve each compound when it first emerges, including the opening deck.
// A completed experiment stays complete until the page is reloaded.
const generatedCompounds=new Set();
function nextCompound(){
 const remaining=compoundPool.filter(c=>!generatedCompounds.has(c.formula));
 return remaining[Math.floor(Math.random()*remaining.length)];
}
const slots=[[.24,.27],[.22,.62],[.83,.57],[.82,.81]];
const outlet={x:.4258,y:.440};
function position(slot){return slots[slot];}
function placeCompound(item){
 const {button,slot,born}=item, end=position(slot);
 const t=reduced.matches?1:Math.max(0,Math.min(1,(clock-born)/4.4));
 const from=apparatus(outlet.x,outlet.y), to={x:end[0]*w,y:end[1]*h};
 // A droplet grows at the spout, falls clear of the glass, then floats outward.
 const travel=Math.max(0,(t-.16)/.84), u=travel*travel*(3-2*travel), v=1-u;
 const bend=slot%2===0?-.08:.09;
 const x=v*v*v*from.x+3*v*v*u*(from.x+bend*w)+3*v*u*u*(to.x+bend*w)+u*u*u*to.x;
 const y=v*v*v*from.y+3*v*v*u*(from.y+.22*h)+3*v*u*u*(to.y+.18*h)+u*u*u*to.y;
 button.style.left=x+'px';button.style.top=y+'px';
 button.style.setProperty('--birth-scale',String(.045+.955*Math.pow(t,.82)));
 button.style.setProperty('--label-opacity',String(Math.max(0,(t-.42)/.58)));
 button.style.opacity=clock<born&&!paused?'0':'1';
 button.classList.toggle('emerging',t<1);
 button.disabled=t<.70;button.tabIndex=t<.70?-1:0;
 return t;
}
function addCompound(slot,data=nextCompound(),delay=0){
 if(!productsReady||!data||generatedCompounds.has(data.formula))return;
 generatedCompounds.add(data.formula);
 const button=document.createElement('button');const id='compound-'+(++sequence);
 button.className='compound';button.dataset.id=id;button.setAttribute('aria-label',`${data.name}, ${data.formula}. Investigate compound`);
 button.style.setProperty('--drift',(5+Math.random()*3)+'s');
 button.innerHTML=`<span class="glass"><span class="formula">${formulaMarkup(data.formula)}</span><span class="compound-name">${data.name}</span></span>`;
 const p=position(slot);
 button.addEventListener('click',()=>react(id));
 $('#compounds').append(button);const item={data,button,slot,born:paused?clock-4.4:clock+delay};active.set(id,item);placeCompound(item);
 if(!paused) waves.push({x:p[0],y:p[1],start:clock,power:.14,good:true});
}
function burst(rect,good){
 const n=good?100:145;
 for(let i=0;i<n;i++){
  const angle=Math.random()*Math.PI*2, radius=1+Math.random()*4;
  const x=rect.x+rect.width/2+Math.cos(angle)*rect.width*.48;
  const y=rect.y+rect.height/2+Math.sin(angle)*rect.height*.46;
  const speed=good?15+Math.random()*60:80+Math.random()*420;
  particles.push({x,y,px:x,py:y,vx:Math.cos(angle)*speed,vy:good?-35-Math.random()*90:Math.sin(angle)*speed-55,r:good?radius: .7+Math.random()*1.8,life:0,max:good?1.4+Math.random()*2.3:.5+Math.random()*1.4,type:good?'bubble':'spark'});
 }
}
function react(id){
 const item=active.get(id);if(!item||item.button.disabled)return null;
 const {button,data,slot}=item;active.delete(id);
 const focused=document.activeElement===button, bounds=button.getBoundingClientRect(), stage=scene.getBoundingClientRect();
 const rect={x:bounds.x-stage.x,y:bounds.y-stage.y,width:bounds.width,height:bounds.height};
 dischargeUntil=clock+1.3;
 button.disabled=true;
 if(data.organic)sendToCell(button,data,rect);
 else button.classList.add('reacting','inorganic');
 $('#invitation').classList.add('dismissed');
 if(!paused){burst(rect,data.organic);waves.push({x:(rect.x+rect.width/2)/w,y:(rect.y+rect.height/2)/h,start:clock,power:1,good:data.organic});}
 if(data.organic){count++;$('#collected').textContent=count===organic.length?'All '+organic.length+' discovered':count+' / '+organic.length+' discovered';}
 const feedback=$('#feedback');feedback.className='visible'+(data.organic?'':' inorganic');
 feedback.innerHTML=`<strong>${data.name} · ${data.organic?'organic':'inorganic'}</strong><span>${data.why}</span>`;
 clearTimeout(feedbackTimer);feedbackTimer=setTimeout(()=>feedback.classList.remove('visible'),5500);
 if(sound) playReaction(data.organic);
 if(focused){const next=[...active.values()][0];if(next)next.button.focus({preventScroll:true});}
 if(!data.organic)setTimeout(()=>button.remove(),950);
 setTimeout(()=>addCompound(slot),2200);
 return {name:data.name,organic:data.organic,explanation:data.why,discoveries:count};
}
function playReaction(good){
 if(!audio)return;
 const now=audio.currentTime;
 if(good){for(let i=0;i<9;i++){const osc=audio.createOscillator(),gain=audio.createGain();osc.type='sine';osc.frequency.setValueAtTime(300+Math.random()*600,now+i*.055);osc.frequency.exponentialRampToValueAtTime(1300+Math.random()*500,now+i*.055+.13);gain.gain.setValueAtTime(0,now+i*.055);gain.gain.linearRampToValueAtTime(.025,now+i*.055+.01);gain.gain.exponentialRampToValueAtTime(.001,now+i*.055+.15);osc.connect(gain).connect(audio.destination);osc.start(now+i*.055);osc.stop(now+i*.055+.17);}}
 else{const buffer=audio.createBuffer(1,audio.sampleRate*.65,audio.sampleRate),channel=buffer.getChannelData(0);for(let i=0;i<channel.length;i++)channel[i]=(Math.random()*2-1)*Math.pow(1-i/channel.length,4);const source=audio.createBufferSource(),gain=audio.createGain(),filter=audio.createBiquadFilter();source.buffer=buffer;filter.type='highpass';filter.frequency.value=1300;gain.gain.value=.13;source.connect(filter).connect(gain).connect(audio.destination);source.start();}
}
$('#sound').addEventListener('click',async()=>{sound=!sound;if(sound){try{audio??=new(window.AudioContext||window.webkitAudioContext)();await audio.resume();}catch{sound=false;}}$('#sound').setAttribute('aria-pressed',String(sound));$('#sound').setAttribute('aria-label',sound?'Mute sound':'Enable sound');$('#sound').title=sound?'Mute sound':'Enable sound';$('#sound path').setAttribute('d',sound?'M11 5 6 9H3v6h3l5 4ZM15 8q5 4 0 8m3-11q8 7 0 14':'M11 5 6 9H3v6h3l5 4ZM16 9l5 6m0-6-5 6');});
function syncMotion(){scene.classList.toggle('paused',paused);$('#motion').setAttribute('aria-label',paused?'Resume animations':'Pause animations');$('#motion').title=paused?'Resume animations':'Pause animations';$('#motion path').setAttribute('d',paused?'m8 5 11 7-11 7Z':'M8 6v12M16 6v12');}
$('#motion').addEventListener('click',()=>{paused=!paused;syncMotion();});reduced.addEventListener('change',e=>{paused=e.matches;syncMotion();});syncMotion();
if(!document.fullscreenEnabled)$('#fullscreen').hidden=true;
$('#fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{}});
document.addEventListener('fullscreenchange',()=>$('#fullscreen').setAttribute('aria-label',document.fullscreenElement?'Exit full screen':'Enter full screen'));
scene.addEventListener('pointermove',e=>{const r=scene.getBoundingClientRect();pointer={x:(e.clientX-r.left)/w,y:(e.clientY-r.top)/h};});
scene.addEventListener('pointerleave',()=>pointer={x:.5,y:.5});
let gl,program,uniforms={},textureReady=false;
const image=$('#photograph'), atmosphere=$('#atmosphere');
try {
 gl=atmosphere.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'});
 if(gl){
  const vertex='attribute vec2 position;varying vec2 uv;void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}';
  const fragment=`precision mediump float;
  varying vec2 uv;uniform sampler2D photo;uniform vec2 resolution;uniform vec2 picture;uniform vec2 mouse;uniform float time;uniform vec4 reaction;uniform float reactionAge;uniform float still;
  void main(){
   vec2 p=vec2(uv.x,1.-uv.y);float aspect=resolution.x/resolution.y;float ia=picture.x/picture.y;
   vec2 scale=aspect>ia?vec2(1.,ia/aspect):vec2(aspect/ia,1.);
   vec2 q=(p-.5)*scale+.5;
   // Animate the photographed flame itself, keeping the nozzle fixed.
   vec2 fire=(q-vec2(.495,.718))/vec2(.012,.022);
   float flameMask=exp(-dot(fire,fire)*1.3);
   q.x+=sin(q.y*95.+time*16.)*.0014*flameMask*(1.-still);
   q.y+=sin(time*11.+q.x*90.)*.0014*flameMask*(1.-still);
   float heat=exp(-pow((q.x-.499)*15.,2.))*(1.-smoothstep(.48,.78,q.y))*smoothstep(.12,.53,q.y);
   q.x+=sin(q.y*170.+time*2.1)*.0009*heat*(1.-still);q.y+=cos(q.x*110.+time*1.4)*.0005*heat*(1.-still);
   vec2 delta=p-reaction.xy;delta.x*=aspect;float d=length(delta);float ring=exp(-pow((d-reactionAge*.33)*15.,2.))*exp(-reactionAge*1.1)*reaction.z;
   q+=normalize(delta+vec2(.0001))*sin(d*65.-reactionAge*14.)*ring*.005;
   vec3 color=texture2D(photo,q).rgb;
   float breath=(sin(time*.65)*.5+.5)*.017*(1.-still);color+=vec3(1.,.76,.43)*breath*exp(-length((q-vec2(.16,.33))*vec2(2.,1.))*3.);
   float flicker=.72+sin(time*13.)*.13+sin(time*23.)*.09;
   float flame=flicker*(1.-still);
   color+=vec3(.06,.24,.65)*flameMask*flame*.24;
   // Blue firelight gently plays across the bottom of the boiling flask.
   color+=vec3(.05,.14,.29)*flame*exp(-length((q-vec2(.495,.689))*vec2(1.9,1.))*80.);
   vec3 tint=reaction.w>.5?vec3(.55,.79,.49):vec3(1.,.43,.12);
   color+=tint*(ring*.11+exp(-d*3.7)*exp(-reactionAge*3.)*reaction.z*.23);
   color+=tint*exp(-length((q-vec2(.498,.57))*vec2(1.2,1.))*10.)*exp(-reactionAge*1.5)*reaction.z*.15;
   gl_FragColor=vec4(color,1.);
  }`;
  function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
  program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vertex));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Scene shader did not link');gl.useProgram(program);
  const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  const loc=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
  for(const name of ['resolution','picture','mouse','time','reaction','reactionAge','still'])uniforms[name]=gl.getUniformLocation(program,name);
  const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  function loadPhoto(){gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,image);gl.uniform2f(uniforms.picture,image.naturalWidth,image.naturalHeight);textureReady=true;atmosphere.classList.add('ready');}
  if(image.complete&&image.naturalWidth)loadPhoto();else image.addEventListener('load',loadPhoto,{once:true});
 }
}catch(error){console.warn('Using photographic fallback:',error.message);gl=null;}
atmosphere.addEventListener('webglcontextlost',e=>{e.preventDefault();textureReady=false;atmosphere.classList.remove('ready');});
function resize(){w=scene.clientWidth;h=scene.clientHeight;const dpr=Math.min(devicePixelRatio||1,1.7);canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);dustCanvas.width=w*dpr;dustCanvas.height=h*dpr;dustCtx.setTransform(dpr,0,0,dpr,0,0);atmosphere.width=w*dpr;atmosphere.height=h*dpr;if(gl)gl.viewport(0,0,atmosphere.width,atmosphere.height);for(const a of active.values())placeCompound(a);}
addEventListener('resize',resize);new ResizeObserver(resize).observe(scene);resize();
// Dust occupies the window's light shaft in photograph coordinates.
// A few nearer, softer motes give the shaft depth without looking like snow.
const dust=Array.from({length:340},(_,i)=>({
 x:.095+Math.random()*.34,y:.105+Math.random()*.70,
 depth:Math.random(),phase:Math.random()*Math.PI*2,
 speed:.65+Math.random()*.7,near:i%9===0
}));
const dustSprites=[false,true].map(soft=>{
 const sprite=document.createElement('canvas');sprite.width=sprite.height=40;
 const c=sprite.getContext('2d'),g=c.createRadialGradient(20,20,0,20,20,20);
 g.addColorStop(0,soft?'rgba(255,242,213,.48)':'rgba(255,251,235,1)');
 g.addColorStop(soft?.22:.24,soft?'rgba(255,236,198,.3)':'rgba(255,239,200,.8)');
 g.addColorStop(soft?.57:.58,'rgba(255,230,183,.12)');
 g.addColorStop(1,'rgba(255,225,176,0)');
 c.fillStyle=g;c.fillRect(0,0,40,40);return sprite;
});
function drawDust(dt){
 dustCtx.clearRect(0,0,w,h);
 dustCtx.save();dustCtx.globalCompositeOperation='lighter';
 const size=w/1440;
 for(const d of dust){
  if(!paused){
   const flow=clock*.32+d.phase;
   d.x+=(.0023+Math.sin(flow+d.y*11)*.0037)*d.speed*(.55+d.depth)*dt;
   d.y+=(Math.cos(flow*.83+d.x*17)*.006-.0014)*d.speed*(.55+d.depth)*dt;
   if(d.x>.435)d.x=.095;if(d.x<.095)d.x=.435;
   if(d.y>.805)d.y=.105;if(d.y<.105)d.y=.805;
  }
  const center=.125+d.y*.21,width=.040+d.y*.095;
  const distance=(d.x-center)/width;
  const beam=Math.exp(-distance*distance*1.7);
  const edge=Math.min(1,(d.x-.095)*35,(.435-d.x)*35,(d.y-.105)*18,(.805-d.y)*18);
  const glint=.65+.35*Math.pow(Math.sin(clock*(.5+d.depth*.4)+d.phase),2);
  const alpha=beam*Math.max(0,edge)*glint*(d.near?.55:.90);
  if(alpha<.012)continue;
  const p=apparatus(d.x,d.y),radius=(d.near?3.2+d.depth*2.2:1.65+d.depth*2.0)*size;
  dustCtx.globalAlpha=alpha;
  dustCtx.drawImage(dustSprites[d.near?1:0],p.x-radius,p.y-radius,radius*2,radius*2);
 }
 dustCtx.restore();
}
function apparatus(x,y){const scale=Math.max(w/2816,h/1536);return{x:(w-2816*scale)/2+x*2816*scale,y:(h-1536*scale)/2+y*1536*scale};}
let dischargeUntil=0;
const feedDuration=7;
const feedFlights=reactantData.map(data=>{
 const el=document.createElement('div');el.className='reactant';el.setAttribute('aria-hidden','true');el.dataset.formula=data.formula;
 el.innerHTML=`<span class="glass"><span class="formula">${formulaMarkup(data.formula)}</span><span class="compound-name">${data.name}</span><span class="reactant-kind">Original reactant</span></span>`;
 el.style.opacity='0';$('#reactants').append(el);
 return{data,el,lastFusion:-1};
});
function animateReactants(){
 const target=apparatus(.495,.579);
 for(const flight of feedFlights){
  const {data,el}=flight,elapsed=clock-data.start;
  if(reduced.matches){
   // Respect reduced motion while keeping all the incoming ingredients visible.
   const i=feedFlights.indexOf(flight);el.style.left=((i+.5)/feedFlights.length*w)+'px';el.style.top=(h*.85)+'px';el.style.transform='translate(-50%,-50%) scale(.68)';el.style.opacity='1';el.style.filter='none';continue;
  }
  if(elapsed<0){el.style.opacity='0';continue;}
  const cycle=0,local=elapsed;
  if(local>=feedDuration){
   el.style.opacity='0';
   if(flight.lastFusion<cycle){
    flight.lastFusion=cycle;dischargeUntil=Math.max(dischargeUntil,clock+.8);
    waves.push({x:target.x/w,y:target.y/h,start:clock,power:.48,good:true});
    // A small ring collapses into the vessel, then dissolves into the contents.
    for(let i=0;i<14;i++){const a=i/14*Math.PI*2;particles.push({x:target.x+Math.cos(a)*9,y:target.y+Math.sin(a)*7,vx:Math.cos(a)*6,vy:-8-Math.random()*14,r:1+Math.random()*1.8,life:0,max:.6+Math.random()*.6,type:'bubble'});}
   }continue;
  }
  const t=local/feedDuration;
  // First rise into view at full size; then accelerate upward and shrink into the glass.
  const enter=Math.min(1,t/.23),lift=enter*enter*(3-2*enter);
  const travel=Math.max(0,(t-.23)/.77),ease=travel*travel*(3-2*travel);
  const startX=data.x*w,startY=h*(1.10-.24*lift);
  const bend=(data.x<.5?-1:1)*Math.sin(ease*Math.PI)*w*.035;
  const x=startX+(target.x-startX)*ease+bend;
  const y=startY+(target.y-startY)*ease;
  const scale=1-.975*Math.pow(travel,1.25);
  const alpha=Math.min(1,t/.10)*Math.min(1,(1-t)/.085);
  el.style.left=x+'px';el.style.top=y+'px';el.style.transform=`translate(-50%,-50%) scale(${scale})`;
  el.style.opacity=String(Math.max(0,alpha));el.style.filter=`blur(${Math.max(0,(travel-.85)*8)}px)`;
 }
}

function drawDischarge(){
 // Confine the discharge and its reflected light to the large reaction vessel.
 const center=apparatus(.495,.580), unit=w/2048;
 const cycle=clock%3.1, energized=clock<dischargeUntil;
 const pulse=energized?.9:cycle<.72?Math.pow(Math.sin(cycle/.72*Math.PI),.65)*.78:0;
 if(pulse<.01||paused)return;
 ctx.save();ctx.beginPath();ctx.ellipse(center.x,center.y,114*unit,104*unit,0,0,Math.PI*2);ctx.clip();
 ctx.globalCompositeOperation='lighter';
 const halo=ctx.createRadialGradient(center.x,center.y,1,center.x,center.y,100*unit);
 halo.addColorStop(0,`rgba(150,167,255,${pulse*.19})`);halo.addColorStop(.45,`rgba(106,125,250,${pulse*.09})`);halo.addColorStop(1,'rgba(70,95,255,0)');ctx.fillStyle=halo;ctx.fillRect(center.x-120*unit,center.y-120*unit,240*unit,240*unit);
 const start=apparatus(.474,.558),end=apparatus(.519,.579);
 const tick=Math.floor(clock*16);
 const noise=i=>{const n=Math.sin(i*127.1+tick*311.7)*43758.5453;return(n-Math.floor(n))*2-1;};
 const points=Array.from({length:19},(_,i)=>{const t=i/18,envelope=Math.sin(Math.PI*t);return{x:start.x+(end.x-start.x)*t+noise(i+23)*envelope*1.7*unit,y:start.y+(end.y-start.y)*t+(noise(i)*6+Math.sin(t*5+tick)*3)*envelope*unit};});
 const trace=()=>{ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));};
 ctx.globalAlpha=pulse;ctx.lineJoin='round';ctx.lineCap='round';
 ctx.strokeStyle='#747aff';ctx.lineWidth=5*unit;ctx.shadowColor='#647dff';ctx.shadowBlur=17*unit;trace();ctx.stroke();
 ctx.strokeStyle='#dce8ff';ctx.lineWidth=1.65*unit;ctx.shadowBlur=4*unit;trace();ctx.stroke();
 ctx.strokeStyle='#ffffff';ctx.lineWidth=.65*unit;trace();ctx.stroke();
 for(let j=0;j<3;j++){const p=points[5+j*4];ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x+(5+j*3)*unit,p.y-(6+j*2)*unit);ctx.lineTo(p.x+(2+j*4)*unit,p.y-(13+j*4)*unit);ctx.strokeStyle='#b3caff';ctx.lineWidth=.7*unit;ctx.stroke();}
 for(let i=0;i<8;i++){const angle=i*2.399+clock*1.2,travel=(clock*1.1+i*.13)%1;const x=center.x+Math.cos(angle)*travel*40*unit,y=center.y+Math.sin(angle)*travel*25*unit;ctx.fillStyle=`rgba(222,231,255,${1-travel})`;ctx.fillRect(x,y,1.6*unit,1.6*unit);}
 ctx.restore();
}
function draw(dt){
 drawDust(dt);
 ctx.clearRect(0,0,w,h);
 drawDischarge();
 // Small transparent beads continuously form at the same outlet as the compounds.
 if(productsReady)for(let i=0;i<7;i++){const phase=(clock*.30+i/7)%1,p=apparatus(outlet.x+Math.sin(i*3.1+clock)*.003*phase,outlet.y+phase*.085);const radius=(1.4+phase*2.8)*w/1440;ctx.globalAlpha=Math.sin(phase*Math.PI)*.55;ctx.strokeStyle='#f6f1cf';ctx.lineWidth=.7;ctx.beginPath();ctx.arc(p.x,p.y,radius,0,Math.PI*2);ctx.stroke();}ctx.globalAlpha=1;
 // Minute rising bubbles follow the liquid in the photograph, even after cropping.
 for(let i=0;i<13;i++){const phase=(clock*.11+i/13)%1;const p=apparatus(.468+(i%5)*.011,.665-phase*.045);const r=.65+Math.sin(i)*.3;ctx.strokeStyle=`rgba(240,219,164,${Math.sin(phase*Math.PI)*.3})`;ctx.lineWidth=.6;ctx.beginPath();ctx.arc(p.x,p.y,r,0,Math.PI*2);ctx.stroke();}
 for(let i=particles.length-1;i>=0;i--){const p=particles[i];if(!paused){p.life+=dt;p.px=p.x;p.py=p.y;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.type==='spark'){p.vy+=160*dt;p.vx*=Math.pow(.985,dt*60);}else{p.vx+=Math.sin(clock*3+p.r)*dt*12;p.vy-=dt*13;}}if(p.life>p.max){particles.splice(i,1);continue;}const alpha=Math.pow(1-p.life/p.max,1.2);ctx.globalAlpha=alpha;
  if(p.type==='bubble'){const r=p.r*(1+p.life*.26);const fill=ctx.createRadialGradient(p.x-r*.35,p.y-r*.4,.1,p.x,p.y,r);fill.addColorStop(0,'rgba(255,255,232,.55)');fill.addColorStop(.22,'rgba(218,248,209,.04)');fill.addColorStop(.78,'rgba(218,248,209,.02)');fill.addColorStop(1,'rgba(228,255,220,.65)');ctx.fillStyle=fill;ctx.beginPath();ctx.arc(p.x,p.y,r,0,Math.PI*2);ctx.fill();ctx.strokeStyle='rgba(250,255,225,.55)';ctx.lineWidth=.55;ctx.stroke();}
  else{ctx.globalCompositeOperation='lighter';ctx.strokeStyle='#ffb24f';ctx.lineWidth=p.r;ctx.shadowColor='#ff8424';ctx.shadowBlur=8;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-p.vx*.025,p.y-p.vy*.025);ctx.stroke();ctx.fillStyle='#fff5cf';ctx.fillRect(p.x,p.y,1.5,1.5);ctx.shadowBlur=0;ctx.globalCompositeOperation='source-over';}
 }ctx.globalAlpha=1;
}
function frame(now){const dt=Math.min((now-last)/1000||0,.04);last=now;if(!document.hidden){if(!paused)clock+=dt;
 for(const item of active.values())placeCompound(item);
 updateCellTransfers();
 animateReactants();
 if(!productsReady&&(reduced.matches||feedFlights.every(f=>f.lastFusion===0))){
  reactantsCompleteAt??=clock;
  if(reduced.matches||clock-reactantsCompleteAt>=.8){
   productsReady=true;productsStartedAt=clock;scene.dataset.phase='products';
   $('#invitation').innerHTML='<p>Now, find the organic compounds.</p><span>Touch a molecule. Watch it react.</span>';
   deck.forEach((data,i)=>addCompound(i,data,i*1.15));
  }
 }
 if(productsReady&&clock-productsStartedAt>9)$('#invitation').classList.add('dismissed');
 waves=waves.filter(r=>clock-r.start<5);const r=waves[waves.length-1];
 if(gl&&textureReady){gl.uniform2f(uniforms.resolution,w,h);gl.uniform2f(uniforms.mouse,pointer.x,pointer.y);gl.uniform1f(uniforms.time,clock);gl.uniform1f(uniforms.still,paused?1:0);gl.uniform4f(uniforms.reaction,r?r.x:.5,r?r.y:.5,r?r.power:0,r&&r.good?1:0);gl.uniform1f(uniforms.reactionAge,r?clock-r.start:10);gl.drawArrays(gl.TRIANGLES,0,6);}draw(dt);
 }requestAnimationFrame(frame);}
scene.dataset.phase='reactants';requestAnimationFrame(frame);
const journal=$('#journal'),journalDialog=$('#journal-dialog');
if(journal&&journalDialog){
 const enlarged=journal.querySelector('.journal-sheet').cloneNode(true);
 enlarged.removeAttribute('aria-hidden');$('#journal-figure').prepend(enlarged);
 journal.addEventListener('click',()=>journalDialog.showModal());
 $('#journal-close').addEventListener('click',()=>journalDialog.close());
 journalDialog.addEventListener('click',e=>{if(e.target===journalDialog)journalDialog.close();});
}
function updateJournal(){
 const selected=cellSelection, d=selected?.data;
 for(const sheet of document.querySelectorAll('.journal-sheet')){
  sheet.classList.toggle('has-discovery',!!d);sheet.classList.toggle('has-arrived',!!selected?.arrived);
  sheet.dataset.feature=d?.feature||'';sheet.style.setProperty('--compound-color',d?.color||'#39f5ad');
  const copy=sheet.querySelector('.journal-copy');
  copy.innerHTML=d?`<span class="journal-kicker">DISCOVERY ${selected.number}</span><strong class="journal-name">${d.name}</strong><span class="journal-formula">${formulaMarkup(d.formula)}</span><span class="journal-location">${selected.arrived?d.location:'Travelling to the cell…'}</span><p>${d.found}</p><span class="journal-route">${d.route}</span><p>${d.role}</p><small>${d.evidence}</small>`:
   '<span class="journal-kicker">MILLER–UREY</span><strong class="journal-name">From chemistry<br>to cells</strong><p>Choose an organic molecule to follow its role in a living cell.</p><span class="journal-route">Find a molecule.<br>Watch the cell light up.</span><p>The experiment made small molecules. Cells use complex reactions to make structures.</p>';
 }
 if(d){
  journal.setAttribute('aria-label',`Open journal: ${d.name}. ${d.location}. ${d.role}`);
  $('#journal-detail').textContent=`${d.name} (${d.formula}). ${d.evidence} ${d.found} ${d.role} The illustration shows where a molecule is found and how cells can use it; it does not show an organelle made in the experiment.`;
 }
}
function sendToCell(button,data,rect){
 const token=++selectionToken;cellSelection={data,token,arrived:false,number:count+1};updateJournal();
 button.classList.remove('emerging');button.classList.add('transferring');button.setAttribute('aria-hidden','true');button.tabIndex=-1;
 button.style.setProperty('--transfer-color',data.color);button.style.opacity='1';
 $('#compound-transfers').append(button);
 const transfer={button,data,token,start:clock,x:(rect.x+rect.width/2)/w,y:(rect.y+rect.height/2)/h};
 if(paused||reduced.matches){button.remove();cellSelection.arrived=true;updateJournal();return;}
 cellTransfers.push(transfer);
}
function updateCellTransfers(){
 for(let i=cellTransfers.length-1;i>=0;i--){
  const f=cellTransfers[i],t=reduced.matches?1:Math.min(1,(clock-f.start)/2.25);
  const sheet=$('#journal .journal-sheet').getBoundingClientRect(),stage=scene.getBoundingClientRect();
  const target={x:sheet.left-stage.left+sheet.width*f.data.target[0],y:sheet.top-stage.top+sheet.height*f.data.target[1]};
  const ease=t*t*(3-2*t),x=f.x*w+(target.x-f.x*w)*ease,y=f.y*h+(target.y-f.y*h)*ease-Math.sin(t*Math.PI)*h*.13;
  f.button.style.left=x+'px';f.button.style.top=y+'px';f.button.style.transform=`translate(-50%,-50%) scale(${1-.955*Math.pow(t,1.55)})`;
  f.button.style.opacity=String(t>.91?1-(t-.91)/.09:1);
  if(t>=1){
   f.button.remove();cellTransfers.splice(i,1);
   if(cellSelection?.token===f.token){cellSelection.arrived=true;updateJournal();}
  }
 }
}
updateJournal();
const context=document.modelContext;
if(context?.registerTool){const lifecycle=new AbortController();const register=tool=>{try{Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{}};
 register({name:'list_visible_compounds',description:'Read the currently visible compounds and discovery count.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>({phase:productsReady?'products':'reactants',compounds:[...active].filter(([,a])=>!a.button.disabled).map(([id,a])=>({id,name:a.data.name,formula:a.data.formula})),discoveries:count})});
 register({name:'investigate_compound',description:'Select a visible compound, trigger its reaction, and reveal whether it is organic.',inputSchema:{type:'object',properties:{id:{type:'string'}},required:['id'],additionalProperties:false},annotations:{readOnlyHint:false},execute:input=>{if(!input||typeof input.id!=='string'||!active.has(input.id))throw Error('Choose an id from list_visible_compounds.');return react(input.id);}});
 addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
}
})();
