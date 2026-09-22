'use strict';
(() => {
const $ = s => document.querySelector(s);
const root=$('#experience'), world=$('#world'), story=$('#story'), art=$('#earth-image');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let phase=-1,elapsed=0,time=0,paused=reduced,autoplay=false,soundOn=true,last=0,visible=true;
const duration=22,visited=new Set();
const chapters=[
 {title:'A world born\nin fire.',era:'4.6 billion years ago',color:'#ffab73',intro:'A young Earth radiates heat. Volcanoes reshape its surface and release gases into the sky.',facts:[['CO₂','<strong>Carbon dioxide and water vapour</strong> dominate the early atmosphere.'],['N₂','Eruptions also release <strong>nitrogen</strong>, with traces of other gases.'],['O₂','There is <strong>almost no free oxygen.</strong> This is a world before breathable air.']],note:'A simplified view of early Earth; the exact mix of its first atmosphere remains uncertain.'},
 {title:'The sky becomes\nthe sea.',era:'Earth cools',color:'#91d7fa',intro:'As the planet cools, water vapour condenses. Relentless rain gathers in the first ocean basins.',facts:[['H₂O','Rain fills low ground, forming <strong>the first oceans.</strong>'],['CO₂','<strong>Carbon dioxide dissolves</strong> into the growing seas.'],['↓','Carbon becomes locked in <strong>carbonate sediments and rock,</strong> reducing atmospheric CO₂.']],note:'The rain and rising water compress immense spans of geological time.'},
 {title:'Life changes\nthe air.',era:'Billions of years of change',color:'#b9e994',intro:'Photosynthetic microbes begin a transformation. Much later, plants spread across the land and forests take root.',facts:[['☀','Photosynthesis uses <strong>carbon dioxide and sunlight</strong> and releases oxygen.'],['O₂','Oxygen builds up over time, opening the way to <strong>more complex life.</strong>'],['↟','Plants eventually colonise bare ground. <strong>Forests turn landscapes green.</strong>']],note:'Oxygen-producing microbes came long before land plants. Forests did not exist 2.7 billion years ago.'},
 {title:'Life takes\nits next step.',era:'From water to land',color:'#f2d6a6',intro:'Across many generations, some fish lineages give rise to early four-limbed vertebrates. Their descendants explore the shore.',facts:[['≈','Changing bodies and habitats allow <strong>some vertebrates to move onto land.</strong>'],['N₂','Today’s dry atmosphere is about <strong>78% nitrogen and 21% oxygen.</strong>'],['+','The remainder is mostly <strong>argon</strong>, with a little CO₂. Water vapour varies.']],note:'The animals represent stages across evolutionary history, not one animal transforming during its lifetime.'}
];
function renderChapter(){
 const c=chapters[phase];root.style.setProperty('--accent',c.color);
 $('#chapter-count').textContent='CHAPTER 0'+(phase+1);$('#era').textContent=c.era;
 $('#story-title').textContent=c.title;$('#story-intro').textContent=c.intro;
 $('#facts').innerHTML=c.facts.map(f=>`<div class="fact"><span class="fact-symbol" aria-hidden="true">${f[0]}</span><p>${f[1]}</p></div>`).join('');
 $('#science-note').textContent=c.note;$('#next').innerHTML=phase===3?'Back to the beginning <span aria-hidden="true">↗</span>':'Next chapter <span aria-hidden="true">↗</span>';
 document.querySelectorAll('.quadrant').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.phase===phase)));
 story.scrollTop=0;$('#status').textContent=c.title.replace('\n',' ')+' '+c.intro;
}
function select(n,fromJourney=false){
 if(!fromJourney)stopJourney();phase=n;elapsed=0;visited.add(n);root.classList.add('has-story');story.hidden=false;renderChapter();
 if(soundOn&&!paused)audio.start();audio.setPhase(n);bursts.length=0;
}
function closeStory(){story.hidden=true;root.classList.remove('has-story');phase=-1;stopJourney();audio.quiet();document.querySelectorAll('.quadrant').forEach(b=>b.setAttribute('aria-pressed','false'));}
function stopJourney(){autoplay=false;$('#journey-symbol').textContent='▷';$('#journey-label').textContent='Play the journey';}
document.querySelectorAll('.quadrant').forEach(b=>b.addEventListener('click',()=>select(+b.dataset.phase)));
$('#close-story').onclick=()=>{const n=phase;closeStory();document.querySelector(`[data-phase="${n}"]`).focus();};
$('#replay').onclick=()=>{elapsed=0;bursts.length=0;if(soundOn&&!paused)audio.start();$('#status').textContent='Replaying '+chapters[phase].title.replace('\n',' ');};
$('#next').onclick=()=>select((phase+1)%4);
$('#journey').onclick=()=>{if(autoplay){stopJourney();return;}autoplay=true;setPaused(false);$('#journey-symbol').textContent='■';$('#journey-label').textContent='Stop journey';select(0,true);};
function setPaused(value){paused=value;root.classList.toggle('paused',paused);$('#motion').innerHTML=paused?'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7Z"/></svg>':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6v12M15 6v12"/></svg>';$('#motion').setAttribute('aria-label',paused?'Resume animations':'Pause animations');$('#motion').title=paused?'Resume animations':'Pause animations';if(paused)audio.suspend();else if(soundOn&&phase>=0)audio.start();}
$('#motion').onclick=()=>setPaused(!paused);
$('#sound').onclick=()=>{soundOn=!soundOn;$('#sound').setAttribute('aria-pressed',String(soundOn));$('#sound').setAttribute('aria-label',soundOn?'Mute sound':'Enable sound');$('#sound').title=soundOn?'Mute sound':'Enable sound';$('#sound').innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4ZM${soundOn?'15 8q5 4 0 8m3-11q8 7 0 14':'16 9l5 6m0-6-5 6'}"/></svg>`;if(soundOn&&!paused)audio.start();else audio.suspend();};
$('#fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await root.requestFullscreen();}catch{$('#status').textContent='Full screen is unavailable in this browser.';}};
document.addEventListener('fullscreenchange',()=>{$('#fullscreen').setAttribute('aria-label',document.fullscreenElement?'Exit full screen':'Enter full screen');});
document.addEventListener('keydown',e=>{if(e.target.matches('input,textarea,select'))return;if(/^[1-4]$/.test(e.key))select(+e.key-1);if(e.key==='Escape'&&phase>=0)closeStory();});
document.addEventListener('visibilitychange',()=>{visible=!document.hidden;last=0;if(!visible)audio.suspend();else if(soundOn&&!paused&&phase>=0)audio.start();});

// All sound is synthesised locally. No audio plays before a user gesture.
const audio={ctx:null,master:null,bed:null,tone:null,noise:null,nextEvent:0,
 start(){try{if(!this.ctx)this.init();this.ctx.resume().catch(()=>{});this.master.gain.setTargetAtTime(.28,this.ctx.currentTime,.5);this.setPhase(phase);}catch{$('#status').textContent='Sound is unavailable. The visual journey is still ready.';}},
 init(){const C=window.AudioContext||window.webkitAudioContext;if(!C)return;this.ctx=new C();const c=this.ctx;this.master=c.createGain();this.master.gain.value=0;this.master.connect(c.destination);this.noise=c.createBuffer(1,c.sampleRate*4,c.sampleRate);const d=this.noise.getChannelData(0);let brown=0;for(let i=0;i<d.length;i++){brown=(brown+(Math.random()*2-1)*.03)/1.02;d[i]=brown*4+(Math.random()*2-1)*.35;}const src=c.createBufferSource();src.buffer=this.noise;src.loop=true;this.filter=c.createBiquadFilter();this.filter.type='lowpass';this.bed=c.createGain();src.connect(this.filter);this.filter.connect(this.bed);this.bed.connect(this.master);src.start();this.tone=c.createOscillator();this.tone.type='sine';this.tone.frequency.value=42;this.toneGain=c.createGain();this.toneGain.gain.value=0;this.tone.connect(this.toneGain);this.toneGain.connect(this.master);this.tone.start();},
 setPhase(n){if(!this.ctx)return;const t=this.ctx.currentTime;this.filter.frequency.setTargetAtTime([210,5200,1200,650][n]||120,t,.9);this.bed.gain.setTargetAtTime([.6,.28,.045,.19][n]||.015,t,.7);this.toneGain.gain.setTargetAtTime(n===0?.13:0,t,.7);},
 suspend(){if(this.ctx)this.ctx.suspend().catch(()=>{});},quiet(){if(this.ctx)this.master.gain.setTargetAtTime(0,this.ctx.currentTime,.7);},
 event(kind){if(!this.ctx||this.ctx.state!=='running'||!soundOn||phase<0)return;const c=this.ctx,t=c.currentTime,g=c.createGain();g.connect(this.master);if(kind==='chirp'){const o=c.createOscillator();o.type='sine';o.frequency.setValueAtTime(1200+Math.random()*1600,t);o.frequency.exponentialRampToValueAtTime(2600+Math.random()*1600,t+.11);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.035,t+.03);g.gain.exponentialRampToValueAtTime(.001,t+.25);o.connect(g);o.start(t);o.stop(t+.3);o.onended=()=>g.disconnect();}else{const s=c.createBufferSource();s.buffer=this.noise;const f=c.createBiquadFilter();f.type='lowpass';f.frequency.value=kind==='thunder'?140:kind==='crackle'?1500:250;s.connect(f);f.connect(g);g.gain.setValueAtTime(.001,t);g.gain.linearRampToValueAtTime(kind==='thunder'?.9:.19,t+.06);g.gain.exponentialRampToValueAtTime(.001,t+(kind==='thunder'?2.8:.5));s.start(t);s.stop(t+3);s.onended=()=>{f.disconnect();g.disconnect();};}}
};
setPaused(reduced);

const rand=(a,b)=>a+Math.random()*(b-a),clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const ease=v=>{v=clamp(v);return v*v*(3-2*v);};
const space=$('#space'),sx=space.getContext('2d');let sw=0,sh=0,dpr=Math.min(devicePixelRatio||1,2),stars=[];
const effects=$('#effects'),fx=effects.getContext('2d');let size=600;
const bursts=[],rain=Array.from({length:430},()=>({x:rand(.48,1),y:Math.random(),z:rand(.3,1),seed:rand(0,30)}));
const pollen=Array.from({length:45},()=>({x:rand(.51,.95),y:rand(.53,.94),s:rand(0,10)}));
let lightning=0,nextThunder=5,nextEruption=0,sprites=[];
const trees=[
 [.80,.78,.071,0,0],[.84,.71,.07,1,.6],[.77,.85,.063,2,1.1],[.71,.82,.092,0,1.6],[.88,.66,.064,0,2.3],[.85,.80,.077,1,3.2],[.73,.89,.058,2,4.0],
 [.79,.72,.064,2,4.4],[.85,.74,.060,0,5],[.67,.87,.06,0,5.6],[.73,.89,.045,1,6.3],[.79,.84,.05,0,6.7],[.61,.84,.04,2,7],
 [.69,.76,.07,0,7.5],[.72,.70,.045,1,8],[.63,.81,.055,2,8.6],[.87,.58,.04,0,9],[.77,.80,.067,1,9.5],[.87,.68,.04,2,10.3],
 [.65,.72,.05,0,11],[.58,.85,.05,0,11.5],[.69,.92,.04,1,12],[.81,.83,.035,2,12.5],[.80,.87,.05,1,13]
].sort((a,b)=>a[1]-b[1]);
const atlas=new Image();atlas.src='assets/life-atlas.png';atlas.onload=()=>{
 // Remove the neutral atlas background at render time; retain original generated art on disk.
 const sheet=document.createElement('canvas');sheet.width=atlas.width;sheet.height=atlas.height;const a=sheet.getContext('2d',{willReadFrequently:true});a.drawImage(atlas,0,0);const im=a.getImageData(0,0,sheet.width,sheet.height),d=im.data;
 for(let i=0;i<d.length;i+=4){const hi=Math.max(d[i],d[i+1],d[i+2]),lo=Math.min(d[i],d[i+1],d[i+2]),sat=hi-lo;if(lo>100&&sat<24)d[i+3]=0;else if(lo>110&&sat<37)d[i+3]=Math.round((sat-24)/13*255);}
 a.putImageData(im,0,0);
 const crops=[[12,25,490,590],[523,25,480,590],[1005,155,515,420],[14,700,490,229],[522,709,468,220],[997,702,520,235]];
 sprites=crops.map(([x,y,w,h])=>{const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(sheet,x,y,w,h,0,0,w,h);return c;});
};
function resize(){dpr=Math.min(devicePixelRatio||1,2);sw=root.clientWidth;sh=root.clientHeight;space.width=Math.round(sw*dpr);space.height=Math.round(sh*dpr);sx.setTransform(dpr,0,0,dpr,0,0);size=world.clientWidth;effects.width=Math.round(size*dpr);effects.height=Math.round(size*dpr);fx.setTransform(effects.width,0,0,effects.height,0,0);stars=Array.from({length:Math.round(sw*sh/1900)},()=>({x:Math.random()*sw,y:Math.random()*sh,r:rand(.3,1.15),a:rand(.15,.85),s:rand(0,6.3),speed:rand(.15,.7)}));if(globeRenderer)globeRenderer.resize();}
new ResizeObserver(resize).observe(world);window.addEventListener('resize',resize);

function drawSpace(){sx.clearRect(0,0,sw,sh);for(const s of stars){const a=s.a*(.65+.35*Math.sin(time*s.speed+s.s));sx.fillStyle=`rgba(193,216,241,${a})`;sx.beginPath();sx.arc(s.x,s.y,s.r,0,Math.PI*2);sx.fill();if(s.r>1&&a>.72){sx.fillStyle=`rgba(176,209,244,${a*.2})`;sx.fillRect(s.x-3,s.y-.3,6,.6);sx.fillRect(s.x-.3,s.y-3,.6,6);}}
 if(window.SolarSurface?.ready){window.SolarSurface.draw(sx,time,sw,sh);return;}
 const r=Math.min(sw,sh)*.27,cx=-r*.53,cy=-r*.5;
 let g=sx.createRadialGradient(cx,cy,r*.8,cx,cy,r*2.7);g.addColorStop(0,'#ffeec466');g.addColorStop(.19,'#ffb03c36');g.addColorStop(.4,'#f7951811');g.addColorStop(1,'#ed6b0000');sx.fillStyle=g;sx.fillRect(0,0,r*3,r*3);
 sx.save();sx.beginPath();sx.arc(cx,cy,r,0,Math.PI*2);sx.clip();g=sx.createRadialGradient(cx+r*.28,cy+r*.3,0,cx,cy,r);g.addColorStop(0,'#fffde4');g.addColorStop(.56,'#fff1b0');g.addColorStop(.85,'#ffc250');g.addColorStop(1,'#e67b20');sx.fillStyle=g;sx.fillRect(0,0,r*2,r*2);
 // Sun granulation and slow-moving convection at the visible solar limb.
 for(let i=0;i<650;i++){const a=i*2.39996,rr=Math.sqrt(i/650)*r;let x=cx+Math.cos(a)*rr,y=cy+Math.sin(a)*rr;if(x< -5||y< -5)continue;sx.fillStyle=`rgba(197,68,8,${.02+.045*(1+Math.sin(i+time*.3))})`;sx.beginPath();sx.ellipse(x+Math.sin(time*.1+i)*1.5,y,r*.009,r*.006,Math.sin(i),0,Math.PI*2);sx.fill();}sx.restore();
 sx.strokeStyle='#fff4cf99';sx.lineWidth=1;sx.shadowColor='#ffaf48';sx.shadowBlur=16;sx.beginPath();sx.arc(cx,cy,r,0,Math.PI*2);sx.stroke();sx.shadowBlur=0;
}

// A texture shader keeps the photograph itself alive: moving sea, incandescent lava and wind in foliage.
let globeRenderer=null;
function setupGlobe(){
 const canvas=document.createElement('canvas');canvas.className='living-texture';Object.assign(canvas.style,{position:'absolute',inset:'0',width:'100%',height:'100%',pointerEvents:'none'});
 const gl=canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'});if(!gl)return;
 const vs='attribute vec2 a; varying vec2 uv; void main(){uv=vec2((a.x+1.)*.5,(1.-a.y)*.5);gl_Position=vec4(a,0.,1.);}';
 const fs=`precision mediump float;
 varying vec2 uv;uniform sampler2D tex;uniform sampler2D barren;uniform float barrenReady;uniform float t;uniform float phase;uniform float p;
 float hash(vec2 v){return fract(sin(dot(v,vec2(127.1,311.7)))*43758.5453);}
 float noise(vec2 v){vec2 i=floor(v),f=fract(v);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);}
 float fbm(vec2 v){return .55*noise(v)+.27*noise(v*2.1)+.13*noise(v*4.3);}
 void main(){vec2 u=uv;vec3 raw=texture2D(tex,u).rgb;float ocean=smoothstep(.01,.12,raw.b-raw.r)*smoothstep(.025,.1,raw.g-raw.r);float seaBand=smoothstep(.26,.4,u.y)*(1.-smoothstep(.90,.97,u.y));float sea=ocean*seaBand;
 float waves=sin(u.y*180.-t*1.8+sin(u.x*35.+t*.45))*sin(u.x*80.+t*.7);u.x+=sea*waves*.0018;u.y+=sea*sin(u.x*145.+t*1.3)*.0012;
 float green=smoothstep(.03,.16,raw.g-raw.r)*step(.49,u.x)*step(.5,u.y);u.x+=green*sin(t*1.3+u.y*80.)*.001;
 vec3 col=texture2D(tex,u).rgb;float lava=smoothstep(.12,.5,col.r-col.b)*smoothstep(.10,.35,col.r-col.g)*(1.-smoothstep(.49,.55,u.y));col+=vec3(.23,.10,.015)*lava*(.4+.6*sin(t*3.-u.y*90.+u.x*65.))*(phase==0.?1.:.45);
 col+=vec3(.04,.08,.1)*sea*max(0.,waves)*.22;
 if(phase==1.){float reach=.56-p*.27;float boundary=u.y-reach+noise(vec2(u.x*25.,u.y*14.)+t*.12)*.025;float flood=smoothstep(-.016,.018,boundary)*smoothstep(.48,.56,u.x)*(1.-smoothstep(.49,.57,u.y));float radius=1.-smoothstep(.455,.475,length(u-.5));float ground=(1.-ocean)*radius*(1.-smoothstep(.61,.8,max(col.r,max(col.g,col.b))));float coverage=flood*ground;vec2 waterUV=vec2(.48+fract(u.x*1.3+t*.003)*.27,.41+fract(u.y*2.+waves*.015)*.09);vec3 water=texture2D(tex,waterUV).rgb*vec3(.55,.89,1.08);water=mix(water,vec3(.045,.21,.29),.32);col=mix(col,water,coverage*.91);col+=vec3(.16,.24,.28)*(1.-smoothstep(.003,.016,abs(boundary)))*ground*.5;}
 if(phase==2.){float patch=smoothstep(.46,.54,u.x)*smoothstep(.48,.56,u.y);float growth=smoothstep(.10,.96,p);float colonies=fbm(u*21.);float reveal=smoothstep(colonies-.16,colonies+.16,growth*1.35-.1);vec3 dry=texture2D(barren,u).rgb;float rocky=clamp(dot(col,vec3(.28,.52,.2)),0.,1.);vec3 fallback=vec3(rocky*.94,rocky*.73,rocky*.56);dry=mix(fallback,dry,barrenReady);col=mix(col,dry,patch*(1.-reveal));}
 gl_FragColor=vec4(col,1.);}`;
 function shader(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s;}
 try{const pr=gl.createProgram();gl.attachShader(pr,shader(gl.VERTEX_SHADER,vs));gl.attachShader(pr,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pr);if(!gl.getProgramParameter(pr,gl.LINK_STATUS))throw Error('Shader link failed');gl.useProgram(pr);const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);let loc=gl.getAttribLocation(pr,'a');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);const tx=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tx);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,art);gl.uniform1i(gl.getUniformLocation(pr,'tex'),0);
 const dryTexture=gl.createTexture();gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,dryTexture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,1,1,0,gl.RGB,gl.UNSIGNED_BYTE,new Uint8Array([45,35,25]));gl.uniform1i(gl.getUniformLocation(pr,'barren'),1);
 const barren=new Image();barren.src='assets/earth-barren.png';barren.onload=()=>{gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,dryTexture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,barren);gl.uniform1f(gl.getUniformLocation(pr,'barrenReady'),1);gl.activeTexture(gl.TEXTURE0);};gl.activeTexture(gl.TEXTURE0);
 const lt=gl.getUniformLocation(pr,'t'),lp=gl.getUniformLocation(pr,'p'),lf=gl.getUniformLocation(pr,'phase');$('.planet-art').appendChild(canvas);globeRenderer={resize(){canvas.width=Math.round(world.clientWidth*dpr);canvas.height=canvas.width;gl.viewport(0,0,canvas.width,canvas.height);},draw(){gl.uniform1f(lt,time);gl.uniform1f(lp,ease(Math.min(elapsed,16)/16));gl.uniform1f(lf,phase);gl.drawArrays(gl.TRIANGLES,0,6);}};globeRenderer.resize();canvas.addEventListener('webglcontextlost',()=>{canvas.remove();globeRenderer=null;});}catch(e){console.warn('Using still photograph fallback:',e.message);}
}
if(art.complete&&art.naturalWidth)setupGlobe();else art.addEventListener('load',setupGlobe,{once:true});

function glow(x,y,r,color,alpha=1){fx.save();fx.globalAlpha=alpha;const g=fx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'transparent');fx.fillStyle=g;fx.fillRect(x-r,y-r,r*2,r*2);fx.restore();}
const lavaPaths=[[[.356,.132],[.36,.177],[.37,.205],[.42,.214],[.46,.23]],[[.352,.137],[.333,.18],[.328,.223],[.291,.244],[.308,.287],[.341,.31],[.348,.353],[.38,.397],[.409,.447]],[[.217,.186],[.222,.224],[.258,.25],[.268,.29],[.249,.33],[.215,.362],[.194,.406]],[[.255,.218],[.27,.264],[.291,.295],[.301,.332],[.272,.37],[.28,.407],[.243,.441]],[[.351,.241],[.372,.283],[.411,.314],[.451,.356],[.47,.399]]];
function pointOn(path,p){let k=clamp(p)*(path.length-1),i=Math.min(path.length-2,Math.floor(k)),f=k-i;return[path[i][0]+(path[i+1][0]-path[i][0])*f,path[i][1]+(path[i+1][1]-path[i][1])*f];}
function volcano(dt){const active=phase===0;const strength=active?1:.2;
 fx.save();fx.globalCompositeOperation='screen';
 for(let j=0;j<lavaPaths.length;j++){const path=lavaPaths[j],amount=active?clamp(elapsed/7):.35;fx.beginPath();fx.moveTo(...path[0]);for(let k=1;k<70*amount;k++){fx.lineTo(...pointOn(path,k/70));}fx.lineWidth=.0028;fx.strokeStyle=`rgba(255,69,8,${strength*.6})`;fx.shadowColor='#ff4000';fx.shadowBlur=active?8:3;fx.stroke();fx.shadowBlur=0;
 for(let i=0;i<12;i++){const pp=(time*.052+i/12+j*.14)%1;if(pp>amount)continue;const [x,y]=pointOn(path,pp);glow(x,y,.005,'#ff7217',strength*(.5+.3*Math.sin(i+time*4)));fx.fillStyle=`rgba(255,215,92,${strength*.8})`;fx.beginPath();fx.arc(x,y,.0012,0,7);fx.fill();}}
 if(active&&time>nextEruption){nextEruption=time+rand(.035,.09);const vent=Math.random()>.3?[.353,.131]:[.218,.187];for(let i=0;i<4;i++)bursts.push({x:vent[0],y:vent[1],vx:rand(-.065,.07),vy:rand(-.17,-.045),age:0,life:rand(.7,2.5),r:rand(.0006,.002)});}
 for(let i=bursts.length-1;i>=0;i--){const b=bursts[i];b.age+=dt;b.x+=b.vx*dt;b.y+=b.vy*dt;b.vy+=dt*.08;if(b.age>b.life){bursts.splice(i,1);continue;}fx.globalAlpha=(1-b.age/b.life)*strength;fx.strokeStyle='#ff9f2f';fx.lineWidth=b.r;fx.beginPath();fx.moveTo(b.x,b.y);fx.lineTo(b.x-b.vx*.035,b.y-b.vy*.035);fx.stroke();glow(b.x,b.y,.006,'#ff5400',.45*strength);}
 fx.globalAlpha=1;glow(.353,.127,.033,'#ff701b',(.5+Math.sin(time*7)*.12)*strength);glow(.218,.184,.022,'#ff8627',strength*.7);fx.restore();
 if(active){fx.save();for(let i=0;i<19;i++){let a=(time*.19+i/19)%1;let x=.352+Math.sin(i*2.3+a*4)*(.01+a*.03)+a*.03,y=.117-a*.12;const r=.014+a*.04;glow(x,y,r,'#54545b',Math.sin(a*Math.PI)*.16);}fx.restore();}
}
function storm(dt){if(phase!==1)return;const power=ease(elapsed/2);fx.save();fx.beginPath();fx.arc(.5,.5,.467,0,7);fx.clip();fx.beginPath();fx.rect(.49,.05,.51,.51);fx.clip();fx.lineCap='round';
 for(const r of rain){const y=.06+((r.y+time*(.38+r.z*.4))%.55),x=r.x-(y-.1)*.12;fx.strokeStyle=`rgba(185,221,239,${(.08+r.z*.42)*power})`;fx.lineWidth=.00055*r.z;fx.beginPath();fx.moveTo(x,y);fx.lineTo(x-.005*r.z,y+.028*r.z);fx.stroke();}
 // Expanding rings and foam remain on the water after each heavy drop.
 for(let i=0;i<33;i++){let t=(time*.8+i*.71)%1,x=.52+(Math.sin(i*89)*.5+.5)*.42,y=.34+(Math.cos(i*41)*.5+.5)*.18;fx.strokeStyle=`rgba(201,233,246,${(1-t)*.30*power})`;fx.lineWidth=.0006;fx.beginPath();fx.ellipse(x,y,.002+t*.008,.0005+t*.002,0,0,7);fx.stroke();}
 if(elapsed>nextThunder){lightning=.17;nextThunder=elapsed+rand(7,11);audio.event('thunder');}lightning=Math.max(0,lightning-dt);if(lightning>0){fx.fillStyle=`rgba(187,217,255,${lightning*.85})`;fx.fillRect(.49,0,.51,.55);fx.strokeStyle=`rgba(216,232,255,${lightning*4})`;fx.lineWidth=.0013;fx.shadowColor='#b2d3ff';fx.shadowBlur=15;fx.beginPath();fx.moveTo(.72,.17);fx.lineTo(.70,.213);fx.lineTo(.729,.224);fx.lineTo(.695,.285);fx.stroke();}fx.restore();
}
function drawSprite(index,x,y,w,h,alpha=1,flip=false,rotate=0){const sp=sprites[index];if(!sp)return;fx.save();fx.translate(x,y);fx.rotate(rotate);if(flip)fx.scale(-1,1);fx.globalAlpha=alpha;fx.drawImage(sp,-w/2,-h,w,h);fx.restore();}
function forest(){if(phase!==2)return;fx.save();fx.beginPath();fx.arc(.5,.495,.453,0,Math.PI*2);fx.clip();for(const [x,y,h,kind,delay] of trees){const g=ease((elapsed-delay)/2.6);if(g<=0)continue;const sp=sprites[kind];if(!sp)continue;const sway=Math.sin(time*1.5+y*50)*.018;drawSprite(kind,x,y,h*sp.width/sp.height*(.45+.55*g),h*g,g,false,sway);glow(x,y,.012,'#9dda61',(1-g)*g*.5);}
 fx.save();fx.globalCompositeOperation='screen';for(const p of pollen){const a=(time*.14+p.s)%1,x=p.x+Math.sin(time*.4+p.s)*.012,y=p.y-a*.045;fx.fillStyle=`rgba(194,236,157,${Math.sin(a*Math.PI)*.5})`;fx.beginPath();fx.arc(x,y,.0009,0,7);fx.fill();}fx.restore();fx.restore();}
function animal(index,x,y,w,alpha,walk,flip){const sp=sprites[index];if(!sp)return;const h=w*sp.height/sp.width;fx.save();fx.translate(x,y);if(flip)fx.scale(-1,1);fx.globalAlpha=alpha;
 // Narrow strips let the photographed body undulate and the limbs move independently.
 const n=28;for(let i=0;i<n;i++){const slice=sp.width/n;const off=Math.sin(time*(walk?6:3)+i*.27)*h*(walk?.028:.06);fx.drawImage(sp,i*slice,0,slice+1,sp.height,-w/2+i*w/n,-h+off,w/n+.0005,h);}fx.restore();}
function fauna(){if(phase!==3)return;const t=elapsed;
 const fishFade=1-ease((t-6)/3);if(fishFade>.005){let p=ease(t/9);animal(3,.46-p*.13,.64+p*.073,.1,fishFade*.92,false,true);}
 if(t>5){const p=ease((t-5)/10),fade=ease((t-5)/2)*(1-ease((t-15)/3));animal(4,.365-p*.14,.735+p*.055,.11,fade,true,true);}
 if(t>14){const p=ease((t-14)/8);animal(5,.29-p*.095,.82+p*.04,.123,ease((t-14)/2),true,true);}
 // Two later shoreline wanderers make the populated coast continue to move.
 if(t>9){let p=(t-9)*.015;animal(4,.39-Math.min(.11,p),.895+Math.sin(p*4)*.02,.06,ease((t-9)/2),true,true);}
 for(let i=0;i<9;i++){const p=(time*.4+i*.27)%1;fx.strokeStyle=`rgba(194,234,238,${(1-p)*.3})`;fx.lineWidth=.0007;fx.beginPath();fx.ellipse(.35+i*.005,.69+i*.017,.009+p*.008,.001+p*.003,-.4,0,Math.PI);fx.stroke();}
}
function ambient(){fx.save();fx.globalCompositeOperation='screen';for(let i=0;i<12;i++){let t=(time*.08+i*.37)%1;let x=.47+Math.sin(i*4)*.10,y=.55+i*.024;fx.strokeStyle=`rgba(135,223,241,${Math.sin(t*Math.PI)*.09})`;fx.lineWidth=.001;fx.beginPath();fx.ellipse(x+t*.016,y,.027,.003,-.15,0,Math.PI);fx.stroke();}fx.restore();}
let soundEventAt=0;
function frame(ts){requestAnimationFrame(frame);if(!visible)return;const dt=last?Math.min(.04,(ts-last)/1000):0;last=ts;
 if(!paused){time+=dt;if(phase>=0)elapsed+=dt;if(autoplay&&elapsed>=duration){if(phase===3){stopJourney();}else{select(phase+1,true);nextThunder=5;}}}
 const liveDt=paused?0:dt;drawSpace();if(globeRenderer)globeRenderer.draw();fx.clearRect(0,0,1,1);ambient();volcano(liveDt);storm(liveDt);forest();fauna();
 const dryFallback=$('#barren-fallback');if(dryFallback)dryFallback.style.opacity=!globeRenderer&&phase===2?String(1-ease(elapsed/16)):'0';
 if(phase>=0)$('#chapter-progress').style.transform=`scaleX(${clamp(elapsed/duration)})`;
 if(!paused&&phase>=0&&time>soundEventAt){soundEventAt=time+rand(2,4);if(phase===0)audio.event('crackle');else if(phase===2)audio.event('chirp');}
}
// Reset effect schedules with each new selection, including repeated replay.
const originalSelect=select;
select=function(n,journey=false){nextThunder=5;lightning=0;nextEruption=0;originalSelect(n,journey);};
$('#replay').addEventListener('click',()=>{nextThunder=5;lightning=0;});
resize();requestAnimationFrame(frame);
})();
