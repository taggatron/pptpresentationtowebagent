(() => {
  'use strict';
  const scene = document.getElementById('scene');
  const labelLayer = document.getElementById('labels');
  const feedback = document.getElementById('feedback');
  const completion = document.getElementById('completion');
  const chambers = [...document.querySelectorAll('.chamber')];
  const instructions = document.getElementById('instructions');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const portrait = matchMedia('(max-aspect-ratio: 1/1)');
  const resources = [
    { id:'light', text:'Light', x:44.0, y:24.5, w:10.5, style:'warm' },
    { id:'space', text:'Space', x:56.5, y:31.0, w:9.7 },
    { id:'food', text:'Food', x:43.5, y:39.5, w:8.0 },
    { id:'mineral-ions', text:'Mineral Ions', x:57.0, y:48.5, w:16.1, style:'mineral' },
    { id:'mates', text:'Mates', x:43.0, y:58.0, w:8.5 },
    { id:'water', text:'Water', x:56.5, y:66.5, w:8.0 },
    { id:'territory', text:'Territory', x:45.0, y:76.0, w:12.3 },
  ];
  document.getElementById('total').textContent=resources.length;
  document.getElementById('completion-summary').textContent=`All ${resources.length} labels sorted.`;
  const rules = {
    'Light': { accepts:['plant'], success:'Plants compete for light to photosynthesise.', wrong:'Think photosynthesis: plants compete for light.' },
    'Mineral Ions': { accepts:['plant'], success:'Plants compete for mineral ions in the soil.', wrong:'Think roots: plants absorb mineral ions from the soil.' },
    'Food': { accepts:['animal'], success:'Animals compete for food.', wrong:'Plants make their own food. Try the Animal container.' },
    'Mates': { accepts:['animal'], success:'Animals compete for mates to reproduce.', wrong:'Animals compete for mates. Try the Animal container.' },
    'Territory': { accepts:['animal'], success:'Animals compete for territory.', wrong:'Territory belongs in the Animal container.' },
    'Water': { accepts:['plant','animal'], success:'Correct! Both plants and animals compete for water.' },
    'Space': { accepts:['plant','animal'], success:'Correct! Both plants and animals compete for space.' },
  };
  let selected = null, drag = null, target = null, feedbackTimer = null;
  let score = 0, busy = false;
  const assigned = {plant:[], animal:[]};
  const elements = new Map();
  const timers = new Set();
  const chamberTimers = new Map();
  function later(fn, ms) { const id = setTimeout(() => {timers.delete(id); fn();}, ms); timers.add(id); return id; }
  const pointer = {x:.5,y:.45,active:false};
  const bursts = [];
  const home = (r, i) => portrait.matches ? {x: i % 2 ? 71:29, y:53.2 + Math.floor(i/2)*5.5} : {x:r.x,y:r.y};
  const position = (el, x, y) => {el.style.left = x+'%'; el.style.top = y+'%';};
  function announce(text, kind = '') {
    clearTimeout(feedbackTimer); feedback.textContent=text; feedback.dataset.kind=kind; feedback.classList.add('visible');
    feedbackTimer = setTimeout(() => feedback.classList.remove('visible'), 4400);
  }
  function setTarget(zone) { target=zone; chambers.forEach(el=>el.classList.toggle('is-target',el.dataset.zone===zone)); }
  function clearSelection() {
    if(selected) elements.get(selected)?.classList.remove('selected');
    selected=null; setTarget(null); instructions.textContent='Drag each label into a container';
  }
  function select(id) {
    if(busy || elements.get(id).classList.contains('sorted'))return;
    clearSelection(); selected=id; elements.get(id).classList.add('selected');
    instructions.textContent=portrait.matches?'Now tap Plant or Animal':'Choose a container · ← Plant / Animal →';
  }
  function detectZone(clientX,clientY) {
    return chambers.find(el=>{const r=el.getBoundingClientRect();return clientX>=r.left&&clientX<=r.right&&clientY>=r.top&&clientY<=r.bottom;})?.dataset.zone??null;
  }
  function returnHome(id) {
    const el=elements.get(id), index=resources.findIndex(r=>r.id===id), pos=home(resources[index],index);
    el.classList.add('returning'); el.classList.remove('dragging'); position(el,pos.x,pos.y);
    later(()=>el.classList.remove('returning','incorrect'),500);
  }
  function layoutSorted(zone) {
    const count=assigned[zone].length;
    assigned[zone].forEach((id,index)=>{
      const x=portrait.matches?(zone==='plant'?26:74):(zone==='plant'?17.7:82.2);
      const y=portrait.matches?19+index*Math.min(4.2,25/Math.max(count-1,1)):27+index*Math.min(6.25,46/Math.max(count-1,1));
      position(elements.get(id),x,y);
    });
  }
  function burst(x,y,color,amount=50) {
    if(reducedMotion.matches)return;
    for(let i=0;i<amount;i++){const angle=Math.random()*Math.PI*2;const speed=.03+Math.random()*.12;bursts.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:1,color});}
  }
  function drop(id, zone) {
    if(!elements.has(id)||!['plant','animal'].includes(zone))return {ok:false,error:'Unknown label or container.'};
    const el=elements.get(id);
    if(el.classList.contains('sorted'))return {ok:false,error:'This label is already sorted.'};
    if(busy)return {ok:false,error:'Wait for the current placement to finish.'};
    const resource=resources.find(r=>r.id===id),rule=rules[resource.text];
    const correct=rule.accepts.includes(zone),chamber=chambers.find(el=>el.dataset.zone===zone);
    clearSelection(); el.classList.remove('dragging');
    chamber.classList.remove('success','wrong'); void chamber.offsetWidth;
    chamber.classList.add(correct?'success':'wrong');
    chamber.querySelector('.zone-result').textContent=correct?'✓ CORRECT':'× TRY AGAIN';
    chamber.querySelector('.outcome-symbol').textContent=correct?'✓':'×';
    chamber.querySelector('.outcome-word').textContent=correct?'CORRECT!':'TRY AGAIN';
    clearTimeout(chamberTimers.get(zone));
    chamberTimers.set(zone,later(()=>{chamber.classList.remove('success','wrong');chamberTimers.delete(zone);},1900));
    const chamberBox=chamber.getBoundingClientRect(),sceneBox=scene.getBoundingClientRect();
    const chamberX=(chamberBox.x+chamberBox.width/2-sceneBox.x)/sceneBox.width;
    const chamberY=(chamberBox.y+chamberBox.height/2-sceneBox.y)/sceneBox.height;
    const color=correct?(zone==='plant'?'122,255,172':'113,224,255'):'255,85,120';
    burst(chamberX,chamberY,color,correct?100:65);
    if(correct)later(()=>{burst(chamberX-.075,chamberY-.19,color,30);burst(chamberX+.075,chamberY+.19,color,30);},180);
    if(!correct){
      el.classList.add('incorrect');returnHome(id);announce(rule.wrong,'wrong');
      return {ok:true,correct:false,sorted:score,message:rule.wrong};
    }
    busy=true; el.classList.add('sorted');el.classList.remove('warm','mineral','incorrect','returning');el.dataset.container=zone;el.setAttribute('aria-label',resource.text+' — correctly sorted into '+zone);el.setAttribute('aria-disabled','true');el.tabIndex=-1;
    assigned[zone].push(id);layoutSorted(zone);score++;document.getElementById('score').textContent=score;
    broadcastState('drop_label');
    announce(rule.success,'success');
    const pos={x:parseFloat(el.style.left)/100,y:parseFloat(el.style.top)/100};
    later(()=>burst(pos.x,pos.y,zone==='plant'?'122,255,172':'113,224,255'),350);
    later(()=>{busy=false;if(score===resources.length){completion.hidden=false;feedback.classList.remove('visible');instructions.textContent='All connections complete';burst(.5,.45,'161,255,208',120);document.getElementById('play-again').focus({preventScroll:true});}else if(document.activeElement===el){resources.map(r=>elements.get(r.id)).find(e=>!e.classList.contains('sorted'))?.focus({preventScroll:true});}},600);
    return {ok:true,correct:true,sorted:score,message:rule.success};
  }
  function cancelDrag() {if(drag){const el=elements.get(drag.id);if(el.hasPointerCapture?.(drag.pointerId))el.releasePointerCapture(drag.pointerId);returnHome(drag.id);drag=null;}clearSelection();}
  function reset() {
    cancelDrag();timers.forEach(clearTimeout);timers.clear();chamberTimers.clear();clearTimeout(feedbackTimer);busy=false;score=0;assigned.plant=[];assigned.animal=[];bursts.length=0;
    feedback.textContent='';feedback.classList.remove('visible');completion.hidden=true;document.getElementById('score').textContent='0';
    chambers.forEach(el=>{el.classList.remove('success','wrong');el.querySelector('.zone-result').textContent='';});
    resources.forEach((r,i)=>{const el=elements.get(r.id);el.className='label '+(r.style||'');el.tabIndex=0;el.removeAttribute('aria-disabled');el.removeAttribute('data-container');el.setAttribute('aria-label',r.text+', unsorted');const p=home(r,i);position(el,p.x,p.y);});
    instructions.textContent='Drag each label into a container';
    broadcastState('reset');
  }

  const syncChannel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('slideshow_interactive_sync') : null;
  let isApplyingRemoteState = false;

  function broadcastState(action = 'state_change') {
    if (isApplyingRemoteState) return;
    const message = {
      type: 'INTERACTIVE_STATE_UPDATE',
      interactiveId: 'plant_animal_neon_sort',
      interactiveUrl: window.location.pathname,
      action,
      state: {
        assigned: { plant: [...assigned.plant], animal: [...assigned.animal] },
        score,
        completed: score === resources.length
      },
      timestamp: Date.now()
    };
    if (syncChannel) {
      try { syncChannel.postMessage(message); } catch (_) {}
    }
    try { window.parent.postMessage(message, '*'); } catch (_) {}
  }

  function applyRemoteState(data) {
    if (!data || !data.state) return;
    isApplyingRemoteState = true;
    try {
      const s = data.state;
      if (!s.assigned) return;
      if (s.assigned.plant.length === 0 && s.assigned.animal.length === 0 && score > 0) {
        reset();
        return;
      }
      ['plant', 'animal'].forEach(zone => {
        (s.assigned[zone] || []).forEach(id => {
          if (!assigned[zone].includes(id)) {
            const el = elements.get(id);
            const resource = resources.find(r => r.id === id);
            if (el && resource && !el.classList.contains('sorted')) {
              el.classList.add('sorted');
              el.classList.remove('warm', 'mineral', 'incorrect', 'returning', 'selected', 'dragging');
              el.dataset.container = zone;
              el.setAttribute('aria-label', resource.text + ' — correctly sorted into ' + zone);
              el.setAttribute('aria-disabled', 'true');
              el.tabIndex = -1;
              assigned[zone].push(id);
            }
          }
        });
        layoutSorted(zone);
      });
      score = assigned.plant.length + assigned.animal.length;
      document.getElementById('score').textContent = score;
      if (score === resources.length) {
        completion.hidden = false;
        feedback.classList.remove('visible');
        instructions.textContent = 'All connections complete';
      }
    } finally {
      isApplyingRemoteState = false;
    }
  }

  window.addEventListener('message', event => {
    const data = event.data;
    if (!data || typeof data !== 'object') return;
    if (data.type === 'APPLY_INTERACTIVE_STATE' || data.type === 'INTERACTIVE_STATE_UPDATE') {
      applyRemoteState(data);
    }
  });

  if (syncChannel) {
    syncChannel.onmessage = event => {
      const data = event.data;
      if (!data || typeof data !== 'object') return;
      if (data.interactiveId === 'plant_animal_neon_sort' || !data.interactiveId) {
        if (data.type === 'INTERACTIVE_STATE_UPDATE' || data.type === 'INTERACTIVE_SYNC') {
          applyRemoteState(data);
        }
      }
    };
  }

  try {
    const req = {
      type: 'REQUEST_INTERACTIVE_STATE',
      interactiveId: 'plant_animal_neon_sort',
      interactiveUrl: window.location.pathname
    };
    if (syncChannel) { try { syncChannel.postMessage(req); } catch (_) {} }
    window.parent.postMessage(req, '*');
  } catch (_) {}
  resources.forEach((resource,index)=>{
    const el=document.createElement('button');el.type='button';el.className='label '+(resource.style||'');el.textContent=resource.text;el.dataset.id=resource.id;el.setAttribute('aria-label',resource.text+', unsorted');el.setAttribute('aria-describedby','keyboard-help');
    el.style.setProperty('--pill-width',resource.w+'cqw');
    const p=home(resource,index);position(el,p.x,p.y);elements.set(resource.id,el);labelLayer.append(el);
    el.addEventListener('pointerdown',event=>{
      if(event.button!==0||busy||el.classList.contains('sorted')||drag)return;
      event.preventDefault();clearSelection();el.classList.remove('returning','incorrect');el.focus({preventScroll:true});
      const box=el.getBoundingClientRect();drag={id:resource.id,pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,offsetX:event.clientX-box.x-box.width/2,offsetY:event.clientY-box.y-box.height/2,moved:false};el.setPointerCapture(event.pointerId);
    });
    el.addEventListener('pointermove',event=>{
      if(!drag||drag.id!==resource.id||event.pointerId!==drag.pointerId)return;
      if(Math.hypot(event.clientX-drag.startX,event.clientY-drag.startY)>4)drag.moved=true;
      if(!drag.moved)return;el.classList.add('dragging');
      const s=scene.getBoundingClientRect();position(el,Math.max(3,Math.min(97,(event.clientX-s.left-drag.offsetX)/s.width*100)),Math.max(5,Math.min(94,(event.clientY-s.top-drag.offsetY)/s.height*100)));
      pointer.x=(event.clientX-s.left)/s.width;pointer.y=(event.clientY-s.top)/s.height;pointer.active=true;setTarget(detectZone(event.clientX,event.clientY));
    });
    el.addEventListener('pointerup',event=>{
      if(!drag||drag.id!==resource.id||event.pointerId!==drag.pointerId)return;
      const wasMoved=drag.moved;drag=null;el.releasePointerCapture(event.pointerId);el.classList.remove('dragging');
      if(!wasMoved){select(resource.id);return;}
      const zone=detectZone(event.clientX,event.clientY);if(zone)drop(resource.id,zone);else{returnHome(resource.id);setTarget(null);}
    });
    el.addEventListener('pointercancel',cancelDrag);
    el.addEventListener('lostpointercapture',()=>{if(drag?.id===resource.id)cancelDrag();});
    el.addEventListener('click',event=>{if(event.detail===0&&!el.classList.contains('sorted'))select(resource.id);});
    el.addEventListener('keydown',event=>{
      if(el.classList.contains('sorted'))return;
      if(['ArrowLeft','ArrowRight','Enter',' ','Escape'].includes(event.key))event.preventDefault();
      if(event.key==='Escape'){cancelDrag();return;}
      if(event.key==='ArrowLeft'||event.key==='ArrowRight'){if(selected!==resource.id)select(resource.id);setTarget(event.key==='ArrowLeft'?'plant':'animal');}
      if(event.key==='Enter'||event.key===' '){if(selected===resource.id&&target)drop(resource.id,target);else select(resource.id);}
    });
  });
  chambers.forEach(el=>el.addEventListener('click',()=>{if(selected)drop(selected,el.dataset.zone);else announce('Choose a label, then choose Plant or Animal.');}));
  document.getElementById('restart').addEventListener('click',reset);
  document.getElementById('play-again').addEventListener('click',()=>{reset();elements.get(resources[0].id).focus({preventScroll:true});});
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape')cancelDrag();
    if(event.key==='PageDown'||event.key==='PageUp'){
      try{window.parent.postMessage({type:'NAVIGATE',direction:event.key==='PageDown'?1:-1},'*');}catch(_){}
    }
  });
  window.addEventListener('blur',cancelDrag);
  scene.addEventListener('pointermove',event=>{const s=scene.getBoundingClientRect();pointer.x=(event.clientX-s.left)/s.width;pointer.y=(event.clientY-s.top)/s.height;pointer.active=true;scene.style.setProperty('--light-x',pointer.x*100+'%');scene.style.setProperty('--light-y',pointer.y*100+'%');});
  scene.addEventListener('pointerleave',()=>{if(!drag)pointer.active=false;});
  portrait.addEventListener('change',()=>{cancelDrag();resources.forEach((r,i)=>{if(!elements.get(r.id).classList.contains('sorted')){const p=home(r,i);position(elements.get(r.id),p.x,p.y);}});layoutSorted('plant');layoutSorted('animal');});

  // The circuit field reacts to each label's actual live position.
  const canvas=document.getElementById('circuits'),ctx=canvas.getContext('2d');
  let width=1376,height=768,lastTime=0,raf=0,seed=4387,ambientTime=0;
  const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
  const traces=Array.from({length:60},(_,i)=>{
    const side=i%4,t=random(),spread=.14+random()*.2;
    let points;
    if(side<2){const x=side===0?0:1,sign=side===0?1:-1;points=[[x,t],[x+sign*spread*.4,t],[x+sign*spread*.72,t+(random()-.5)*.14],[x+sign*spread,t+(random()-.5)*.17]];}
    else{const y=side===2?0:1,sign=side===2?1:-1;points=[[t,y],[t,y+sign*spread*.55],[t+(random()-.5)*.18,y+sign*spread*.86],[t+(random()-.5)*.2,y+sign*spread*1.25]];}
    return {points,phase:random(),speed:.075+random()*.055};
  });
  // A fixed pool keeps the background alive without growing memory usage.
  const motes=Array.from({length:44},()=>({x:random(),y:random(),speed:.009+random()*.018,size:.7+random()*1.1,phase:random()*Math.PI*2}));
  function tracePoint(trace,phase){
    const segment=Math.max(0,Math.min(.999999,phase))*3,index=Math.floor(segment),fraction=segment-index;
    const a=trace.points[index],b=trace.points[index+1];
    return {x:(a[0]+(b[0]-a[0])*fraction)*width,y:(a[1]+(b[1]-a[1])*fraction)*height};
  }
  function resize(){const s=scene.getBoundingClientRect();width=s.width;height=s.height;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx?.setTransform(dpr,0,0,dpr,0,0);}
  new ResizeObserver(resize).observe(scene);
  function draw(now){
    if(!ctx)return;
    const elapsed=Math.min((now-lastTime)/1000||.016,.05);lastTime=now;ctx.clearRect(0,0,width,height);
    if(!reducedMotion.matches)ambientTime+=elapsed;
    const livePositions=resources.map(r=>{const el=elements.get(r.id);return {x:parseFloat(el.style.left)/100,y:parseFloat(el.style.top)/100};});
    for(const trace of traces){
      const end=trace.points[3];let closest=Infinity;
      for(const p of livePositions)closest=Math.min(closest,Math.hypot((p.x-end[0])*1.3,p.y-end[1]));
      const proximity=Math.max(0,1-closest/.22);
      const pointerProx=pointer.active?Math.max(0,1-Math.hypot((pointer.x-end[0])*1.5,pointer.y-end[1])/.3):0;
      const green=end[0]<.32;const rgb=green?'85,255,155':'65,225,244';
      ctx.lineWidth=.8;ctx.strokeStyle=`rgba(${rgb},${.085+proximity*.09+pointerProx*.20})`;ctx.beginPath();trace.points.forEach((p,i)=>i?ctx.lineTo(p[0]*width,p[1]*height):ctx.moveTo(p[0]*width,p[1]*height));ctx.stroke();
      if(!reducedMotion.matches){
        trace.phase=(trace.phase+elapsed*trace.speed*(1+pointerProx*1.6))%1;
        const intensity=Math.min(1,.62+proximity*.2+pointerProx*.3);
        // Bright, tapering packets visibly travel along each circuit even at rest.
        for(let tail=7;tail>0;tail--){
          const phase=trace.phase-tail*.009;if(phase<0)continue;
          const a=tracePoint(trace,phase),b=tracePoint(trace,phase+.009);
          ctx.strokeStyle=`rgba(${rgb},${intensity*(1-tail/8)*.65})`;ctx.lineWidth=1.8;
          ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
        }
        const head=tracePoint(trace,trace.phase);
        ctx.shadowBlur=12+pointerProx*8;ctx.shadowColor=`rgb(${rgb})`;ctx.fillStyle=`rgba(${rgb},${intensity})`;
        ctx.beginPath();ctx.arc(head.x,head.y,1.7+pointerProx*.8,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='#e8ffff';ctx.fillRect(head.x-.6,head.y-.6,1.2,1.2);ctx.shadowBlur=0;
        const nodeGlow=.2+.45*Math.pow((Math.sin(ambientTime*1.5+trace.phase*9)+1)/2,3);
        ctx.fillStyle=`rgba(${rgb},${nodeGlow})`;ctx.beginPath();ctx.arc(end[0]*width,end[1]*height,2,0,Math.PI*2);ctx.fill();
      }
    }
    if(!reducedMotion.matches){
      for(const mote of motes){
        mote.y-=elapsed*mote.speed;if(mote.y<-.03)mote.y=1.03;
        const x=(mote.x+Math.sin(ambientTime*.4+mote.phase)*.018)*width,y=mote.y*height;
        const alpha=.2+.4*(Math.sin(ambientTime*1.1+mote.phase)+1)/2;
        const rgb=mote.x<.35?'128,255,181':'122,235,255';
        ctx.strokeStyle=`rgba(${rgb},${alpha*.25})`;ctx.lineWidth=mote.size*.7;
        ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-2,y+8);ctx.stroke();
        ctx.fillStyle=`rgba(${rgb},${alpha})`;ctx.beginPath();ctx.arc(x,y,mote.size,0,Math.PI*2);ctx.fill();
      }
    }
    if(drag&&drag.moved){
      const el=elements.get(drag.id),x=parseFloat(el.style.left)/100*width,y=parseFloat(el.style.top)/100*height;
      const glow=ctx.createRadialGradient(x,y,0,x,y,width*.16);glow.addColorStop(0,'rgba(132,255,236,.13)');glow.addColorStop(1,'rgba(55,230,244,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,width,height);
      ctx.strokeStyle=target==='plant'?'rgba(137,255,179,.45)':'rgba(124,237,255,.35)';ctx.lineWidth=1;
      const sceneBounds=scene.getBoundingClientRect();
      for(const z of chambers){const b=z.getBoundingClientRect(),zx=b.left-sceneBounds.left+b.width/2,zy=b.top-sceneBounds.top+b.height*.55;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+(zx-x)*.6,y);ctx.lineTo(zx,zy);ctx.stroke();}
      if(!reducedMotion.matches&&Math.random()<.4)burst(x/width,y/height,'173,255,245',1);
    }
    for(let i=bursts.length-1;i>=0;i--){const b=bursts[i];b.life-=elapsed*1.25;if(b.life<=0){bursts.splice(i,1);continue;}b.x+=b.vx*elapsed;b.y+=b.vy*elapsed;ctx.globalAlpha=b.life;ctx.fillStyle=`rgb(${b.color})`;ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=9;ctx.fillRect(b.x*width,b.y*height,2,2);}ctx.globalAlpha=1;ctx.shadowBlur=0;
    raf=requestAnimationFrame(draw);
  }
  document.addEventListener('visibilitychange',()=>{cancelAnimationFrame(raf);if(!document.hidden){lastTime=performance.now();raf=requestAnimationFrame(draw);}});
  reducedMotion.addEventListener('change',()=>{bursts.length=0;lastTime=performance.now();});
  raf=requestAnimationFrame(draw);

  const modelContext=document.modelContext;
  if(modelContext?.registerTool){
    const lifecycle=new AbortController();window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
    const register=tool=>{try{Promise.resolve(modelContext.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{}};
    register({name:'get_sorting_activity',title:'Read sorting activity',description:'Read the remaining labels, accepted plant/animal containers and sorting progress.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute:()=>({sorted:score,total:resources.length,labels:resources.map(r=>({id:r.id,label:r.text,container:elements.get(r.id).dataset.container||null})),containers:['plant','animal']})});
    register({name:'place_resource_label',title:'Place a resource label',description:'Place one unsorted resource label into the Plant or Animal container. The activity checks the answer and gives feedback.',inputSchema:{type:'object',properties:{labelId:{type:'string'},container:{type:'string',enum:['plant','animal']}},required:['labelId','container'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute:async input=>{if(!input||typeof input.labelId!=='string'||!['plant','animal'].includes(input.container)||Object.keys(input).some(k=>!['labelId','container'].includes(k)))throw new Error('Provide a labelId and a plant or animal container.');const result=drop(input.labelId,input.container);if(!result.ok)throw new Error(result.error);await new Promise(resolve=>setTimeout(resolve,650));return result;}});
    register({name:'restart_sorting_activity',title:'Restart sorting activity',description:'Return all resource labels to their starting positions and reset progress.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute:()=>{reset();return {sorted:0,total:resources.length};}});
  }
})();
