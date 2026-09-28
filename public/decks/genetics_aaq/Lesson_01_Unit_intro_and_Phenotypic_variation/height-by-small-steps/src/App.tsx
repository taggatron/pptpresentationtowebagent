import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { ArrowDown, CircleHelp, Gauge, Pause, Play, RotateCcw, X } from 'lucide-react';
import { PanelViewContext } from './components/PanelView';
import type { PanelId } from './components/PanelView';
import { Board } from './components/Board';
import { Explorer } from './components/Explorer';
import { EnvironmentControls } from './components/EnvironmentControls';
import { Distribution } from './components/Distribution';
import { activeGenes } from './data/genes';
import { neutralEnvironment, setFactorPolarity, toggleFactor } from './data/environment';
import type { Environment, EnvironmentalPolarity, FactorId } from './data/environment';
import type { GeneCount, Scenario } from './lib/simulation';
import { statistics } from './lib/simulation';
import { useSimulation } from './lib/useSimulation';
import { useModelTools } from './lib/useModelTools';
export default function App() {
 const controlsRef=useRef<HTMLElement>(null);
 const [controlsHeight,setControlsHeight]=useState(40);
 useEffect(()=>{const observer=new ResizeObserver(([entry])=>setControlsHeight(entry.target.getBoundingClientRect().height));observer.observe(controlsRef.current!);return()=>observer.disconnect();},[]);
 const [expanded,setExpanded]=useState<PanelId|null>(null);
 useEffect(()=>{
  if(!expanded)return;
  const previous=document.body.style.overflow;
  document.body.style.overflow='hidden';
  const escape=(event:KeyboardEvent)=>{if(event.key==='Escape'){event.preventDefault();setExpanded(null);}};
  window.addEventListener('keydown',escape);
  return()=>{document.body.style.overflow=previous;window.removeEventListener('keydown',escape);};
 },[expanded]);
 const [selected,setSelected]=useState('IGF1');
 const [polarity,setPolarity]=useState<EnvironmentalPolarity>('positive');
 const [environment,setEnvironment]=useState<Environment>({...neutralEnvironment});
 const [baseline,setBaseline]=useState<Scenario|null>(null);
 const [help,setHelp]=useState(false);
 const [notice,setNotice]=useState('A 300-person starter sample is ready. Add individuals or explore a different environment.');
 const sim=useSimulation();
 const changeGeneCount=(count:GeneCount)=>{if(count===sim.geneCount)return;sim.reset(undefined,count);setSelected(activeGenes(count)[0].id);setNotice(`${count===1?'Single-gene':'12-gene'} mode selected. Drop individuals to begin a fresh population.`);};
 const pending=sim.queued+sim.balls.length;
 const environmentName=useMemo(()=>environment.overall===0&&Object.entries(environment).every(([k,v])=>k==='overall'||v===50)?'Neutral environment':'Adjusted environment',[environment]);
 const changeEnvironment=(value:Environment)=>{setEnvironment(value);sim.reset(value);setNotice('New conditions applied. Drop individuals or turn on auto-run to build this population.');};
 const changePolarity=(value:EnvironmentalPolarity)=>{setPolarity(value);const next=setFactorPolarity(environment,value);if(JSON.stringify(next)!==JSON.stringify(environment))changeEnvironment(next);};
 const activateFactor=(id:FactorId)=>{setSelected(id);changeEnvironment(toggleFactor(environment,id,polarity));};
 useModelTools({read:()=>({geneCount:sim.geneCount,polarity,statistics:statistics(sim.values),environment,queued:sim.queued,inFlight:sim.balls.length,paused:sim.paused,autoRun:sim.auto}),drop:sim.drop,configure:changeEnvironment,environment});
 function save(){setBaseline({geneCount:sim.geneCount,values:[...sim.values],environment:{...environment},stats:statistics(sim.values)});setNotice('Comparison A saved. Change the environment, then drop a new population to compare.');}
 return <PanelViewContext.Provider value={{expanded,toggle:id=>setExpanded(current=>current===id?null:id)}}><div className={`app-shell ${expanded?'is-expanded':''}`} style={{'--controls-height':`${controlsHeight}px`} as CSSProperties}>
 <main id="main"><header className="page-header"><div className="intro"><div><h1>Height by <em>many small steps.</em></h1><p>How genes and environment combine to produce continuous variation.</p></div></div><section ref={controlsRef} className="control-bar" aria-label="Simulation controls"><div className="gene-mode" role="group" aria-label="Number of genes"><span>MODEL</span>{([1,12] as const).map(count=><button key={count} aria-pressed={sim.geneCount===count} onClick={()=>changeGeneCount(count)}>{count} {count===1?'gene':'genes'}</button>)}</div><span className="control-divider"/><div className="drop-controls"><span className="controls-label">DROP INDIVIDUALS</span>{[1,100].map(n=><button key={n} className={n===100?'drop-button featured':'drop-button'} onClick={()=>{sim.drop(n);setNotice(`${n} individual${n===1?'':'s'} added to the queue.`);}}><ArrowDown size={15}/>{n===1?'1':`+${n}`}</button>)}</div><span className="control-divider"/><button className={`auto-button ${sim.auto?'running':''}`} onClick={sim.toggleAuto} aria-pressed={sim.auto}>{sim.auto?<span className="running-light"/>:<Play size={14} fill="currentColor"/>}Auto-run <span className="toggle-track"><i/></span></button><button className="utility-button pause-button" aria-label={sim.paused?'Resume':'Pause'} title={sim.paused?'Resume':'Pause'} onClick={sim.togglePause} disabled={!pending&&!sim.auto}>{sim.paused?<Play size={16}/>:<Pause size={16}/>}</button><button className="utility-button" aria-label="Reset" title="Reset" onClick={()=>{sim.reset();setNotice('Population reset. Your environmental settings and saved comparison are kept.');}}><RotateCcw size={16}/></button><label className="speed-control" title="Simulation speed"><Gauge size={18} aria-hidden="true"/><select aria-label="Simulation speed" value={sim.speed} onChange={e=>sim.setSpeed(Number(e.target.value))}><option value=".5">0.5×</option><option value="1">1×</option><option value="2">2×</option><option value="4">4×</option></select></label><button className={`help-button ${help?'active':''}`} aria-label="How to read this" title="How to read this" onClick={()=>setHelp(!help)} aria-expanded={help} aria-controls="how-to-read"><CircleHelp size={18}/></button></section></header>
 {help&&<section id="how-to-read" className="help-panel"><div><h2>One individual. Many small influences.</h2><p>Start with <strong>1 gene</strong> to isolate one small contribution with two possible outcomes. This mode omits continuous environmental noise, so the two branches stay distinct. Height itself is still a polygenic trait; this is not a model of dominant or recessive inheritance. Switch to <strong>12 genes</strong> to combine contributions and individual environmental variation. Changing mode starts a fresh population and keeps saved comparison A.</p><p>Each ball represents an individual. At every blue gene row, a left branch slightly reduces the height score and a right branch slightly increases it. Green environmental controls change these probabilities. Many drops build a roughly bell-shaped distribution.</p><p>Use the green <strong>Positive</strong> or red <strong>Negative</strong> selector, then toggle factors below the board. Active factors tilt linked pegs and change branching probabilities. Negative prenatal conditions are shown as <strong>Prenatal smoking</strong>. Illness always acts adversely when activated. These are illustrative pathway links, not measured interactions between specific alleles and environmental exposures; unlinked rows mean no effect is represented in this model.</p><p>Try saving the neutral population as A, changing nutrition, then dropping 100 individuals. The saved outline makes the shift visible. Environmental bias represents growth conditions, not changed inherited alleles.</p><p><strong>This is a simplified model.</strong> Real human height involves many more than these 12 genes, interactions between genes and environmental factors. The effects and heights here are illustrative. A normal curve is a useful approximation, not a rule for all populations. <a href="https://medlineplus.gov/genetics/understanding/traits/height/" target="_blank" rel="noreferrer">Read the biology at MedlinePlus ↗</a></p></div><button className="icon-button" aria-label="Close how to read this" onClick={()=>setHelp(false)}><X size={18}/></button></section>}

 <div className="workspace" data-expanded={expanded??undefined}><div className="main-column"><Board polarity={polarity} onPolarityChange={changePolarity} onFactorToggle={activateFactor} geneCount={sim.geneCount} selected={selected} onSelect={setSelected} environment={environment} balls={sim.balls} values={sim.values} paused={sim.paused}/><Distribution geneCount={sim.geneCount} values={sim.values} baseline={baseline} onSave={save} onClear={()=>setBaseline(null)}/></div><aside className="side-column"><Explorer polarity={polarity} environment={environment} geneCount={sim.geneCount} selected={selected}/><EnvironmentControls polarity={polarity} environment={environment} onChange={changeEnvironment} onSelect={setSelected}/></aside></div>
 <div className="session-status"><span><i className="dot green"/>{environmentName}</span><p role="status">{notice}</p><span>{pending?`${pending} in progress`:`Simplified model · ${sim.geneCount===1?'one contribution, not monogenic height':'12 representative genes'}`}</span></div>
 </main></div></PanelViewContext.Provider>;
}
