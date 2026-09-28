import assert from 'node:assert/strict';
import { genes, activeGenes } from '../src/data/genes.ts';
import { geneInfluence } from '../src/data/interactions.ts';
import { neutralEnvironment, toggleFactor, setFactorPolarity, factorMetadata, factors } from '../src/data/environment.ts';
import { histogram, seededRandom, simulateIndividual, statistics } from '../src/lib/simulation.ts';
const count=50000;
function population(overall:number,illness=50){const random=seededRandom(42);return Array.from({length:count},(_,i)=>simulateIndividual(i,{...neutralEnvironment,overall,illness},random).height);}
assert.equal(genes.length,12);assert.equal(new Set(genes.map(g=>g.id)).size,12);
const neutral=population(0),adverse=statistics(population(-100)),supportive=statistics(population(100)),n=statistics(neutral);
assert.ok(Math.abs(n.mean-175)<.15,'Neutral mean should be close to 175 cm');
assert.ok(n.sd>5.8&&n.sd<6.6,'Neutral spread should be about six cm');
assert.ok(adverse.mean<n.mean-4&&supportive.mean>n.mean+4,'Environment should visibly shift the population');
const illnessLow=statistics(population(0,0)),illnessHigh=statistics(population(0,100));
assert.ok(illnessLow.mean>illnessHigh.mean+1,'Illness burden should reduce the mean');
assert.ok(illnessHigh.sd>illnessLow.sd,'Illness burden should increase spread');
const bins=histogram(neutral);assert.equal(bins.reduce((a,b)=>a+b,0),count);
assert.equal(histogram([110,250]).reduce((a,b)=>a+b,0),2,'Outliers must not disappear');
const within=neutral.filter(v=>Math.abs(v-n.mean)<=n.sd).length/count;
assert.ok(within>.65&&within<.71,'Many effects should approximate the one-SD normal interval');
assert.deepEqual(population(0).slice(0,10),neutral.slice(0,10),'Seed should reproduce the same sample');
const random=seededRandom(1),person=simulateIndividual(0,neutralEnvironment,random);
assert.equal(person.steps.length,12);
console.log(JSON.stringify({result:'All model checks passed',count,neutral:n,adverse,supportive,illnessLow,illnessHigh,withinOneSD:within},null,2));
// Introductory mode deliberately isolates two contributions, without noise.
const singleRandom=seededRandom(42);
const single=Array.from({length:10000},(_,i)=>simulateIndividual(i,neutralEnvironment,singleRandom,1));
assert.ok(single.every(person=>person.steps.length===1));
assert.equal(new Set(single.map(person=>person.height)).size,2,'One gene should have exactly two illustrative outcomes');
const effect=activeGenes(1)[0].effectSize*Math.sqrt(20/genes.length);
assert.ok(single.every(person=>Math.abs(Math.abs(person.height-175)-effect)<1e-9),'Mode switching must keep each gene effect fixed');
const rightShare=single.filter(person=>person.height>175).length/single.length;
assert.ok(rightShare>.48&&rightShare<.52,'Neutral single-gene branches should be approximately balanced');
const supportedRandom=seededRandom(42);
const supported=Array.from({length:10000},(_,i)=>simulateIndividual(i,{...neutralEnvironment,overall:100},supportedRandom,1));
assert.ok(supported.filter(person=>person.height>175).length>single.filter(person=>person.height>175).length+900,'Environment changes the frequency of the two contributions');
console.log('Single-gene mode: one step, two outcomes, fixed effect sizes and environmental bias passed.');

const sick=toggleFactor(neutralEnvironment,'illness','positive');
assert.equal(sick.illness,100);
for(const id of ['IGF1','IGF1R','GH1','GHR','ACAN','COL2A1']){
 assert.ok(geneInfluence(id,sick).angle<0,`${id} should tilt left with illness`);
 assert.ok(geneInfluence(id,sick).probability<.5,`${id} left tilt must match branching bias`);
}
assert.equal(geneInfluence('SHOX',sick).angle,0,'No local pathway effect is assigned to SHOX');
assert.deepEqual(toggleFactor(sick,'illness','positive'),neutralEnvironment,'A second click removes the factor');
const nourished=toggleFactor(neutralEnvironment,'nutrition','positive');
assert.ok(geneInfluence('IGF1',nourished).angle>0);
const undernourished=setFactorPolarity(nourished,'negative');
assert.ok(geneInfluence('IGF1',undernourished).angle<0);
assert.equal(undernourished.sleep,50,'Master switch must not enable inactive factors');
assert.equal(setFactorPolarity(sick,'positive').illness,100,'Illness remains adverse');
const smoking=toggleFactor(neutralEnvironment,'prenatal','negative');
assert.equal(smoking.prenatal,0);
assert.ok(geneInfluence('IGF1',smoking).angle<0);
assert.equal(factorMetadata(factors[0],'negative').short,'Prenatal smoking');
assert.equal(factorMetadata(factors[0],'positive').short,'Prenatal');
console.log('Selective factor links, visible tilt directions, toggles, polarity and prenatal smoking passed.');
