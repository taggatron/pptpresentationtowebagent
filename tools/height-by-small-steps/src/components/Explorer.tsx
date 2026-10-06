import { PanelViewButton } from './PanelView';
import { ArrowUpRight, Dna, Leaf } from 'lucide-react';
import { genes, activeGenes } from '../data/genes';
import { geneInfluence } from '../data/interactions';
import type { Environment, EnvironmentalPolarity } from '../data/environment';
import { factors, factorMetadata } from '../data/environment';
import { ProteinIllustration } from './ProteinIllustration';
export function Explorer({selected,geneCount,polarity,environment}:{selected:string;geneCount:1|12;polarity:EnvironmentalPolarity;environment:Environment}) {
 const gene=genes.find(g=>g.id===selected); const base=factors.find(f=>f.id===selected); const factor=base?factorMetadata(base,polarity):undefined;
 const influence=gene?geneInfluence(gene.id,environment):null;
 const environmental=!gene;
 return <section className={`panel explorer ${environmental?'environment-explorer':''}`} aria-labelledby="explorer-title">
 <div className="panel-heading"><h2 id="explorer-title">Gene / factor explorer</h2><PanelViewButton panel="explorer" label="gene explorer"/></div>
 <div className="explorer-content" key={selected}>
 <div className="eyebrow">{environmental?<Leaf size={14}/>:<Dna size={14}/>} {environmental?'ENVIRONMENTAL FACTOR':`GENE ${String(activeGenes(geneCount).findIndex(g=>g.id===selected)+1).padStart(2,'0')} / ${geneCount}`}</div>
 <h3>{gene?.displayName??factor?.name??'Overall environment'}</h3>
 <p className="role">{gene?.role??'Conditions that shape growth potential'}</p>
 <span className="type-tag">{gene?.proteinType??'Environmental influence'}</span>
 <ProteinIllustration type={gene?.icon??'message'} environment={environmental}/>
 <h4>What it does</h4><p>{gene?.description??factor?.description??'A combined view of the conditions supporting growth across a population.'}</p>
 {influence&&influence.links.length>0&&<p className="interaction-summary">Model links: {influence.links.map(id=>factorMetadata(factors.find(f=>f.id===id)!,polarity).short).join(', ')}. {Math.round(influence.probability*100)}% chance of a right step. Links and strengths are illustrative.</p>}
 <details className="explorer-details"><summary>Model & biology notes</summary><h4>In this model</h4><p>{gene&&geneCount===1?'Isolates one small contribution with two possible outcomes. Real height still involves many genes; this is not a dominant/recessive inheritance model.':gene?'Adds one small step to each individual’s path. Left slightly reduces the score; right slightly increases it.':geneCount===1?'Changes how often the left or right contribution occurs. Continuous environmental noise is omitted in this introductory mode.':selected==='illness'?'Higher illness burden biases steps toward shorter outcomes and adds more variation.':'Tilts selected growth-pathway pegs and changes their branching probabilities. The links and strengths are illustrative, not measured gene-specific effects.'}</p>
 <div className="biology-note"><span>REAL BIOLOGY</span><p>{gene?.note??factor?.note??'Environment changes growth and gene activity; it does not change the alleles an individual inherited. The board tilt is a visual metaphor.'}</p></div>
 <a className="source-link" href={gene?`https://www.ncbi.nlm.nih.gov/gene/?term=${encodeURIComponent(gene.id+'[Gene Name] AND Homo sapiens[Organism]')}`:'https://medlineplus.gov/genetics/understanding/traits/height/'} target="_blank" rel="noreferrer">{gene?'Explore this gene at NCBI':'Read about genes and height'} <ArrowUpRight size={14}/></a>
 </details></div></section>;
}
