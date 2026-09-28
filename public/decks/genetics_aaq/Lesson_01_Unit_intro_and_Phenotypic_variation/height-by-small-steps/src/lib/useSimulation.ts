import { useEffect, useRef, useState } from 'react';
import { neutralEnvironment } from '../data/environment';
import type { Environment } from '../data/environment';
import { seededRandom, simulateIndividual } from './simulation';
import type { GeneCount, Individual } from './simulation';
export interface MovingIndividual extends Individual { progress:number }
interface Engine { geneCount:GeneCount; values:number[]; balls:MovingIndividual[]; queued:number; auto:boolean; paused:boolean; speed:number; time:number; next:number; id:number; environment:Environment; random:()=>number }
const DURATION=4400;
function createEngine():Engine {
 const random=seededRandom(42);
 const values=Array.from({length:300},(_,i)=>simulateIndividual(i,neutralEnvironment,random).height);
 return {geneCount:12,values,balls:[],queued:0,auto:false,paused:false,speed:1,time:0,next:0,id:300,environment:{...neutralEnvironment},random};
}
export function useSimulation() {
 const engine=useRef<Engine|null>(null); if(!engine.current)engine.current=createEngine();
 const [snapshot,setSnapshot]=useState(()=>({...engine.current!}));
 function publish(){ const e=engine.current!; setSnapshot({...e,values:[...e.values],balls:[...e.balls]}); }
 useEffect(()=>{
  let last=performance.now();
  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const timer=window.setInterval(()=>{
   const now=performance.now(),delta=Math.min(now-last,100); last=now;
   const e=engine.current!;
   if(e.paused||(!e.auto&&!e.queued&&!e.balls.length))return;
   e.time+=delta*e.speed;
   e.balls=e.balls.map(b=>({...b,progress:reducedMotion.matches?1:b.progress+delta*e.speed/DURATION}));
   e.balls.filter(b=>b.progress>=1).forEach(b=>e.values.push(b.height));
   e.balls=e.balls.filter(b=>b.progress<1);
   if(!e.balls.length&&!e.queued&&!e.auto)e.next=e.time;
   let emitted=0;
   while((e.queued>0||e.auto)&&e.time>=e.next&&emitted++<10){
    e.balls.push({...simulateIndividual(e.id++,e.environment,e.random,e.geneCount),progress:0});
    if(e.queued)e.queued--;
    e.next=Math.max(e.next,e.time-100)+(e.queued>0?40:160);
   }
   publish();
  },32);
  return()=>window.clearInterval(timer);
 },[]);
 return { ...snapshot,
  drop:(count:number)=>{const e=engine.current!;e.queued+=count;e.paused=false;publish();},
  toggleAuto:()=>{const e=engine.current!;e.auto=!e.auto;e.paused=false;publish();},
  togglePause:()=>{const e=engine.current!;e.paused=!e.paused;publish();},
  setSpeed:(speed:number)=>{engine.current!.speed=speed;publish();},
  reset:(environment?:Environment,geneCount?:GeneCount)=>{const e=engine.current!;Object.assign(e,{values:[],balls:[],queued:0,auto:false,paused:false,time:0,next:0,id:0,random:seededRandom(42)});if(environment)e.environment={...environment};if(geneCount)e.geneCount=geneCount;publish();}
 };
}
