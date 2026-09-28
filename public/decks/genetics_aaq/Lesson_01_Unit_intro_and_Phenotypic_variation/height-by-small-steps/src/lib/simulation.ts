import { genes, activeGenes } from '../data/genes.ts';
import { geneInfluence } from '../data/interactions.ts';
import type { Environment } from '../data/environment.ts';
export interface Individual { id: number; steps: number[]; height: number }
export interface Statistics { n: number; mean: number; sd: number }
export type GeneCount = 1 | 12;
export interface Scenario { geneCount: GeneCount; values: number[]; environment: Environment; stats: Statistics }
export const MIN_HEIGHT = 140;
export const MAX_HEIGHT = 210;
export const BIN_WIDTH = 2;
export const BIN_COUNT = (MAX_HEIGHT - MIN_HEIGHT) / BIN_WIDTH;
export function seededRandom(seed: number) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
export function environmentalInfluence(e: Environment) {
 // Branch bias is calculated per gene in geneInfluence, shared with the pegs.
 return {spread:1.1+.012*e.illness+.005*Math.abs(e.nutrition-50),tilt:e.overall/100*2.3};
}
export function simulateIndividual(id:number, e:Environment, random:()=>number=Math.random, geneCount:GeneCount=12):Individual {
 const {spread}=environmentalInfluence(e);
 let score=0;
 const steps=activeGenes(geneCount).map(g=> { score+=(random()<geneInfluence(g.id,e).probability?1:-1)*g.effectSize; return score; });
 // Independent continuous variation smooths the discrete branching outcomes.
 // Neither weights nor environmental responses are calibrated to people.
 const noise=geneCount===1?0:Math.sqrt(-2*Math.log(Math.max(random(),1e-12)))*Math.cos(2*Math.PI*random());
 // Keep the per-gene scale fixed across modes. One-gene mode omits continuous
 // noise to isolate two contributions; it is not a model of monogenic height.
 const scoreScale=Math.sqrt(20/genes.length);
 return {id, steps, height:175+score*scoreScale+noise*spread};
}
export function statistics(values:readonly number[]):Statistics {
 if(!values.length) return {n:0, mean:0, sd:0};
 const mean=values.reduce((a,b)=>a+b,0)/values.length;
 return {n:values.length,mean,sd:Math.sqrt(values.reduce((a,b)=>a+(b-mean)**2,0)/values.length)};
}
export function histogram(values:readonly number[]) {
 const bins=Array<number>(BIN_COUNT).fill(0);
 // End bins include outliers; these are labelled as open-ended in the chart.
 values.forEach(h=>bins[Math.max(0,Math.min(BIN_COUNT-1,Math.floor((h-MIN_HEIGHT)/BIN_WIDTH)))]++);
 return bins;
}
