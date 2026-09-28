import { useEffect, useRef } from 'react';
import type { Environment } from '../data/environment';
interface Tool { name:string; description:string; inputSchema:object; annotations:{readOnlyHint:boolean}; execute:(input:unknown)=>unknown }
interface Context { registerTool:(tool:Tool,options:{signal:AbortSignal})=>void|Promise<void> }
interface ModelActions { read:()=>unknown; drop:(n:number)=>void; configure:(e:Environment)=>void; environment:Environment }
// Optional progressive enhancement for browsers with the proposed WebMCP API.
export function useModelTools(actions:ModelActions) {
 const current=useRef(actions);current.current=actions;
 useEffect(()=>{
  const context=(document as Document&{modelContext?:Context}).modelContext;
  if(!context?.registerTool)return;
  const lifecycle=new AbortController();
  const afterPaint=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  const tools:Tool[]=[
   {name:'read_height_simulation',description:'Read the visible population statistics and current environmental settings.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>current.current.read()},
   {name:'queue_height_individuals',description:'Queue 1 to 100 individuals for the animated height simulation. Results appear after they land.',inputSchema:{type:'object',properties:{count:{type:'integer',minimum:1,maximum:100}},required:['count'],additionalProperties:false},annotations:{readOnlyHint:false},execute:async(input)=>{const count=(input as {count?:unknown})?.count;if(typeof count!=='number'||!Number.isInteger(count)||count<1||count>100)throw new Error('count must be an integer between 1 and 100');current.current.drop(count);await afterPaint();return {queued:count};}},
   {name:'configure_height_environment',description:'Adjust one or more environmental controls. Starts a fresh empty population and stops auto-run, preserving a saved comparison.',inputSchema:{type:'object',properties:{overall:{type:'number',minimum:-100,maximum:100},prenatal:{type:'number',minimum:0,maximum:100},nutrition:{type:'number',minimum:0,maximum:100},sleep:{type:'number',minimum:0,maximum:100},illness:{type:'number',minimum:0,maximum:100}},additionalProperties:false},annotations:{readOnlyHint:false},execute:async(input)=>{if(!input||typeof input!=='object'||Array.isArray(input))throw new Error('Expected an object');const next={...current.current.environment};for(const [key,value] of Object.entries(input)){if(!Object.prototype.hasOwnProperty.call(next,key)||typeof value!=='number'||!Number.isFinite(value)||value<(key==='overall'?-100:0)||value>100)throw new Error('Invalid environment setting');next[key as keyof Environment]=value;}current.current.configure(next);await afterPaint();return current.current.read();}}
  ];
  tools.forEach(tool=>{try{void Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{/* This optional API must not affect the simulation. */}});
  return()=>lifecycle.abort();
 },[]);
}
