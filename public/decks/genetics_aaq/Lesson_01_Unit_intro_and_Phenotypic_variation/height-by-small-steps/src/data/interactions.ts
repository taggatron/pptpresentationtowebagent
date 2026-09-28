import type { Environment, FactorId } from './environment.ts';
// Illustrative pathway weights, NOT measured gene-by-environment interactions.
// Hormonal pathway genes and downstream cartilage proteins are grouped to teach
// selective effects. Unlisted genes mean "not represented", not "no real effect".
export const pathwayWeights:Record<FactorId,Readonly<Record<string,number>>> = {
 prenatal:{IGF1:1,IGF1R:.7},
 nutrition:{IGF1:1,IGF1R:.7,GH1:.45,GHR:.8,ACAN:.35,COL2A1:.35},
 sleep:{GH1:1,GHR:.55,IGF1:.7,IGF1R:.5},
 illness:{IGF1:1,IGF1R:.8,GH1:.4,GHR:1,ACAN:.45,COL2A1:.45},
};
export function geneInfluence(id:string,e:Environment) {
 let localBias=0;
 const links:FactorId[]=[];
 for(const factor of Object.keys(pathwayWeights) as FactorId[]){
  const weight=pathwayWeights[factor][id]??0;
  const signal=(e[factor]-50)/50*(factor==='illness'?-1:1);
  localBias+=signal*weight*.11;
  if(weight&&signal)links.push(factor);
 }
 const probability=Math.max(.18,Math.min(.82,.5+.12*e.overall/100+localBias));
 return {probability,angle:Math.max(-38,Math.min(38,(probability-.5)*220)),links};
}
