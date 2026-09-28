import { PanelViewButton } from './PanelView';
import { useEffect, useRef, useState } from 'react';
import { ArrowDown, MousePointer2 } from 'lucide-react';
import { genes as allGenes, activeGenes } from '../data/genes';
import { geneInfluence } from '../data/interactions';
import { factors, factorMetadata } from '../data/environment';
import type { Environment, EnvironmentalPolarity, FactorId } from '../data/environment';
import type { MovingIndividual } from '../lib/useSimulation';
import { environmentalInfluence, histogram } from '../lib/simulation';

interface Geometry { center:number; step:number; floor:number; width:number; top:number; gap:number; single:boolean }
function positions(ball:MovingIndividual, geometry:Geometry) {
 const {center:CENTER,step:STEP,floor,width,top:TOP,gap:GAP,single}=geometry;
 let x=CENTER;
 const points=[{x,y:31},{x,y:TOP}];
 ball.steps.forEach((s,i)=>{x+=(s>(ball.steps[i-1]??0)?1:-1)*STEP;points.push({x,y:TOP+(i+1)*GAP});});
 points.push({x:CENTER+(Math.max(140,Math.min(210,ball.height))-175)*(width-155)/(single?10:70),y:floor});
 return points;
}
function ballPosition(ball:MovingIndividual,geometry:Geometry){const points=positions(ball,geometry);const t=ball.progress*(points.length-1),i=Math.min(Math.floor(t),points.length-2),f=t-i;return{x:points[i].x+(points[i+1].x-points[i].x)*f,y:points[i].y+(points[i+1].y-points[i].y)*f};}
export function Board({polarity,onPolarityChange,onFactorToggle,geneCount,selected,onSelect,environment,balls,values,paused}:{polarity:EnvironmentalPolarity;onPolarityChange:(value:EnvironmentalPolarity)=>void;onFactorToggle:(id:FactorId)=>void;geneCount:1|12;selected:string;onSelect:(id:string)=>void;environment:Environment;balls:MovingIndividual[];values:number[];paused:boolean}) {
 const genes=activeGenes(geneCount);
 const TOP=geneCount===1?120:48,GAP=geneCount===1?95:24;
 const wrap=useRef<HTMLDivElement>(null);
 const [width,setWidth]=useState(760);
 useEffect(()=>{ const el=wrap.current!; const observer=new ResizeObserver(([entry])=>setWidth(Math.max(300,entry.contentRect.width))); observer.observe(el);return()=>observer.disconnect(); },[]);
 const CENTER=(width+140)/2, STEP=geneCount===1?genes[0].effectSize*Math.sqrt(20/allGenes.length)*(width-155)/10:(width-185)/(genes.length*2), floor=TOP+genes.length*GAP+30;
 const geometry={center:CENTER,step:STEP,floor,width,top:TOP,gap:GAP,single:geneCount===1};
 const {tilt}=environmentalInfluence(environment);
 const bins=histogram(values),max=Math.max(1,...bins);
 const leading=balls[0];
 return <section className="panel board-panel" aria-labelledby="board-title">
 <div className="panel-heading"><div className="heading-with-number"><span className="section-number">01</span><h2 id="board-title">{geneCount===1?'One gene, one small step':'The polygenic journey'}</h2></div><div className="panel-actions"><span className="board-status"><i className={balls.length&&!paused?'live':''}/>{paused?'Paused':balls.length?'Individuals in motion':'Ready to explore'}</span><PanelViewButton panel="board" label="gene board"/></div></div>
 <div className="board-key"><span><i className="dot violet"/>{genes.length} gene {geneCount===1?'contribution':'contributions'}</span><span><i className="dot green"/>4 environmental influences</span><span className="one-ball"><i className="dot white"/>1 ball = 1 individual</span></div>
 <div className="board-svg-wrap" ref={wrap}><svg className="board-svg" viewBox={`0 0 ${width} ${floor+32}`} aria-label={`Interactive Galton board with ${genes.length} selectable gene rows`}>
 <defs><linearGradient id="board-glow" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#a49aff" stopOpacity=".05"/><stop offset="1" stopColor="#7774dc" stopOpacity=".14"/></linearGradient><linearGradient id="bin-gradient" x2="0" y2="1"><stop stopColor="#b1a9ff"/><stop offset="1" stopColor="#6c65b9" stopOpacity=".35"/></linearGradient><filter id="ball-glow"><feGaussianBlur stdDeviation="3"/></filter></defs>
 <text x="28" y="26" className="svg-micro">GENE</text>
 <g style={{transform:`rotate(${tilt}deg)`,transformOrigin:`${CENTER}px 300px`,transition:'transform 700ms ease'}}>
 <path d={`M${CENTER} 35 ${CENTER+STEP*(geneCount===1?1.2:genes.length+1)} ${floor-24}H${CENTER-STEP*(geneCount===1?1.2:genes.length+1)}Z`} fill="url(#board-glow)" stroke="#7272b5" strokeOpacity=".17"/>
 <path d={`M${CENTER-20} 8h40l-14 18h-12Z`} fill="#24293f" stroke="#7d77b4"/><path d={`M${CENTER} 0v6`} stroke="#b6adfc" strokeWidth="2"/>
 <path d={`M${CENTER} 51v${floor-75}`} stroke="#85819a" strokeOpacity=".15" strokeDasharray="3 7"/>
 {genes.map((gene,row)=>{const influence=geneInfluence(gene.id,environment);const affected=Math.abs(influence.probability-.5)>.001;const pegColor=affected?(influence.angle<0?'#ed929c':'#96dcbb'):null;const y=TOP+row*GAP,active=selected===gene.id,passing=balls.some(b=>Math.abs(b.progress*(genes.length+2)-(row+1))<.35);
 return <g key={gene.id} data-gene={gene.id} data-peg-angle={influence.angle.toFixed(1)} data-right-probability={influence.probability.toFixed(3)} className={`gene-row ${active?'selected':''}`} role="button" tabIndex={0} aria-label={`Explore gene ${row+1}: ${gene.displayName}`} aria-pressed={active} onClick={()=>onSelect(gene.id)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onSelect(gene.id);}}}>
 <title>{gene.displayName}: {gene.role}. Model: {Math.round(influence.probability*100)}% right branches.{influence.links.length?` Illustrative links: ${influence.links.join(', ')}.`:``}</title><rect className="row-hit" x="13" y={y-9} width={width-26} height="19" rx="4" fill={active?'#ddbc88':'transparent'} fillOpacity={active?'.10':'0'}/>
 {active&&<rect x="13" y={y-8} width="2.5" height="17" rx="1" fill="#e0c393"/>}
 <text x="28" y={y+4} className="row-number">{String(row+1).padStart(2,'0')}</text><text x="54" y={y+4} className="gene-name">{gene.displayName}</text>
 <path d={`M127 ${y}H${CENTER-row*STEP-19}`} stroke={active?'#d6b785':'#4a506c'} strokeOpacity={active?'.45':'.20'} strokeDasharray="2 5"/>
 {Array.from({length:row+1},(_,j)=>{const x=CENTER+(j*2-row)*STEP;return <g key={j} transform={`translate(${x} ${y})`}><path className="seesaw-beam" style={{transform:`rotate(${influence.angle}deg)`}} d={`M${-Math.min(7,STEP*.8)} 0L${Math.min(7,STEP*.8)} 0`} stroke={pegColor??(active?'#f0d9b6':passing?'#afa2f4':'#66628f')} strokeWidth={active?2.2:1.6} strokeLinecap="round"/><path d="m0 1-2 4h4Z" fill={active?'#b99b6a':'#44435e'}/><circle r={active?2.2:1.5} fill={pegColor??(active?'#f5dfbc':'#9690c5')}/></g>})}
 {active&&<text x={width-30} y={y+4} className="selected-arrow">←</text>}
 </g>})}
 {leading&&<polyline points={positions(leading,geometry).slice(0,Math.max(2,Math.floor(leading.progress*(genes.length+2))+1)).map(p=>`${p.x},${p.y}`).join(' ')} fill="none" stroke="#d6c8ff" strokeWidth="1.8" strokeOpacity=".45"/>}
 {geneCount>1&&bins.map((count,i)=><rect key={i} x={145+i*(width-155)/35} y={floor-count/max*30} width={(width-155)/35-2} height={count/max*30} fill="url(#bin-gradient)" rx="2" opacity=".65"/>)}
 {geneCount===1&&[-1,1].map(sign=>{const count=values.filter(value=>sign<0?value<175:value>175).length;const height=values.length?count/values.length*34:0;return <g key={sign}><rect x={CENTER+sign*STEP-16} y={floor-36} width="32" height="36" rx="3" fill="none" stroke="#b1a9ff" strokeOpacity=".25"/><rect x={CENTER+sign*STEP-14} y={floor-height} width="28" height={height} rx="2" fill="url(#bin-gradient)"/></g>;})}
 <path d={`M143 ${floor}H${width-10}`} stroke="#787293" strokeOpacity=".4"/>
 {balls.map(ball=>{const p=ballPosition(ball,geometry);return <g key={ball.id}><circle cx={p.x} cy={p.y} r="6" fill="#d1c1ff" opacity=".6" filter="url(#ball-glow)"/><circle cx={p.x} cy={p.y} r="2.8" fill={ball.id%5===0?'#a8e8d3':'#e9ddff'}/></g>})}
 <text x="145" y={floor+24} className="svg-axis">← Smaller</text><text x={width-12} y={floor+24} className="svg-axis" textAnchor="end">Larger →</text>
 </g></svg></div>
 {geneCount===1&&<p className="single-gene-note">One contribution, two possible steps.<br/>Switch to 12 genes to see many effects combine.</p>}
 <div className="factor-master" role="group" aria-label="Environmental direction"><span>Factor effect</span><button className="positive" aria-pressed={polarity==='positive'} onClick={()=>onPolarityChange('positive')}>Positive</button><button className="negative" aria-pressed={polarity==='negative'} onClick={()=>onPolarityChange('negative')}>Negative</button></div>
 <div className="environment-nodes"><span><ArrowDown size={14}/> Influenced by</span>{factors.map(f=>{const active=environment[f.id]!==50;const adverse=f.id==='illness'?environment.illness>50:environment[f.id]<50;return <button className={`${active?'selected':''} ${active&&adverse?'adverse':''}`} key={f.id} aria-pressed={active} title={f.id==='illness'?'Toggle illness burden: linked pegs tilt left.':`Toggle ${factorMetadata(f,polarity).short.toLowerCase()}`} onClick={()=>onFactorToggle(f.id)}><i/>{factorMetadata(f,polarity).short}</button>;})}</div>
 <p className="factor-link-note">Illustrative pathway links · Illness acts negatively</p>
 <div className="board-foot"><MousePointer2 size={14}/><span>Select a gene row to discover its role in growth.</span><span className="tilt-label">Board tilt <b>{tilt>0?'+':''}{tilt.toFixed(1)}°</b></span></div>
 </section>;
}
