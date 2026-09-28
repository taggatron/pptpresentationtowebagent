import { PanelViewButton } from './PanelView';
import { useEffect, useRef, useState } from 'react';
import { BookmarkPlus, X, ChartNoAxesCombined } from 'lucide-react';
import { BIN_WIDTH, MIN_HEIGHT, histogram, statistics } from '../lib/simulation';
import type { Scenario } from '../lib/simulation';
export function Distribution({geneCount,values,baseline,onSave,onClear}:{geneCount:1|12;values:number[];baseline:Scenario|null;onSave:()=>void;onClear:()=>void}) {
 const chart=useRef<SVGSVGElement>(null);
 const [chartSize,setChartSize]=useState({width:760,height:227});
 useEffect(()=>{const observer=new ResizeObserver(([entry])=>setChartSize({width:Math.max(300,entry.contentRect.width),height:Math.max(100,entry.contentRect.height)}));observer.observe(chart.current!);return()=>observer.disconnect();},[]);
 const [curve,setCurve]=useState(true);
 const domainMin=geneCount===1&&!baseline?170:MIN_HEIGHT,domainMax=geneCount===1&&!baseline?180:210;
 const domainWidth=domainMax-domainMin,binCount=domainWidth/BIN_WIDTH,offset=(domainMin-MIN_HEIGHT)/BIN_WIDTH;
 const stats=statistics(values),bins=histogram(values).slice(offset,offset+binCount),saved=baseline?histogram(baseline.values):[];
 const compare=!!baseline;
 // Use percentages for comparisons so unequal sample sizes remain comparable.
 const scale=(count:number,n:number)=>compare?100*count/Math.max(1,n):count;
 const current=bins.map(c=>scale(c,stats.n)),previous=saved.map(c=>scale(c,baseline?.stats.n??0));
 const peak=geneCount>1&&stats.n&&stats.sd?scale(stats.n*BIN_WIDTH/(stats.sd*Math.sqrt(2*Math.PI)),stats.n):0;
 const max=Math.max(compare?10:5,...current,...previous,peak)*1.15;
 const X0=43,Y0=chartSize.height-38,W=chartSize.width-63,H=Math.max(25,chartSize.height-65);
 const path=geneCount>1&&stats.n>1&&stats.sd>0?Array.from({length:141},(_,i)=>{const h=domainMin+i/140*domainWidth,normal=stats.n*BIN_WIDTH/(stats.sd*Math.sqrt(2*Math.PI))*Math.exp(-.5*((h-stats.mean)/stats.sd)**2);return `${i?'L':'M'}${X0+i/140*W},${Y0-scale(normal,stats.n)/max*H}`;}).join(' '):'';
 return <section className="panel distribution-panel" aria-labelledby="distribution-title"><div className="panel-heading"><div className="heading-with-number"><span className="section-number">02</span><h2 id="distribution-title">A population takes shape</h2></div><div className="panel-actions"><button className="text-button save-button" disabled={!stats.n} onClick={onSave}><BookmarkPlus size={15}/>{baseline?'Replace comparison':'Save comparison A'}</button><PanelViewButton panel="distribution" label="distribution chart"/></div></div>
 <div className="stats-grid"><div><span>MEAN HEIGHT</span><strong>{stats.n?stats.mean.toFixed(1):'—'}<small> cm</small></strong></div><div><span>STANDARD DEVIATION</span><strong>{stats.n?stats.sd.toFixed(1):'—'}<small> cm</small></strong></div><div><span>INDIVIDUALS</span><strong>{stats.n.toLocaleString()}</strong></div></div>
 <div className="chart-controls"><div className="chart-legends"><span><i className="dot violet"/>{baseline?`B · ${geneCount} ${geneCount===1?'gene':'genes'}`:geneCount===1?'1 gene · two outcomes':'Current population'}</span>{baseline&&<span className="baseline-key"><i className="dot amber"/>A · {baseline.geneCount} {baseline.geneCount===1?'gene':'genes'} ({baseline.stats.n})<button aria-label="Remove comparison" onClick={onClear}><X size={13}/></button></span>}</div><label className="curve-toggle"><input type="checkbox" disabled={geneCount===1} checked={geneCount>1&&curve} onChange={e=>setCurve(e.target.checked)}/>Bell curve</label></div>
 <svg className="histogram" ref={chart} viewBox={`0 0 ${chartSize.width} ${chartSize.height}`} role="img" aria-label={`Height distribution: ${stats.n} individuals${stats.n?`, mean ${stats.mean.toFixed(1)} centimetres, standard deviation ${stats.sd.toFixed(1)}`:''}${baseline?`. Saved mean ${baseline.stats.mean.toFixed(1)} centimetres`:''}`}>
 <defs><linearGradient id="hist-fill" x2="0" y2="1"><stop stopColor="#b1a4f4" stopOpacity=".9"/><stop offset="1" stopColor="#7165a3" stopOpacity=".45"/></linearGradient></defs>
 <text x={X0} y="14" className="svg-micro">{compare?'INDIVIDUALS (%)':'NUMBER OF INDIVIDUALS'}</text>
 {[0,1,2,3].map(i=>{const value=max*i/3,y=Y0-i/3*H;return <g key={i}><path d={`M${X0} ${y}H${X0+W}`} stroke="#ffffff" strokeOpacity=".065" strokeDasharray={i?'3 5':undefined}/><text x="34" y={y+4} textAnchor="end" className="svg-axis">{Math.round(value)}</text></g>})}
 {previous.map((v,i)=><rect key={i} x={X0+i/binCount*W+1} y={Y0-v/max*H} width={W/binCount-2} height={v/max*H} fill="#eac18c" fillOpacity=".09" stroke="#cba16d" strokeOpacity=".7" rx="2"/>)}
 {current.map((v,i)=><rect className="hist-bar" key={i} x={X0+i/binCount*W+3} y={Y0-v/max*H} width={W/binCount-6} height={v/max*H} fill="url(#hist-fill)" rx="2"><title>{domainMin===140&&i===0?'Below 142':domainMax===210&&i===binCount-1?'208 and above':`${domainMin+i*BIN_WIDTH}–${domainMin+(i+1)*BIN_WIDTH}`} cm: {bins[i]} individuals</title></rect>)}
 {curve&&path&&<path d={path} stroke="#d1c2ff" strokeWidth="2" fill="none"/>}
 {(domainMin===170?[170,172,174,176,178,180]:[140,150,160,170,180,190,200,210]).map(h=><text key={h} x={X0+(h-domainMin)/domainWidth*W} y={Y0+16} textAnchor="middle" className="svg-axis">{h===140?'140':h===210?'210':h}</text>)}
 <text x={X0+W/2} y={chartSize.height-3} textAnchor="middle" className="svg-axis">Approximate adult height (cm)</text>
 {!stats.n&&!baseline&&<text x={X0+W/2} y={Y0-H/2} textAnchor="middle" className="chart-empty">Drop individuals to build a distribution</text>}
 </svg>
 <div className="chart-insight"><ChartNoAxesCombined size={19}/><p>{baseline&&stats.n?<>The current mean is <b>{Math.abs(stats.mean-baseline.stats.mean).toFixed(1)} cm {stats.mean>=baseline.stats.mean?'higher':'lower'}</b> than A. Outlines show the saved population; bars show the current one.</>:geneCount===1?<>Two outcomes isolate one contribution. Real height is influenced by many genes.</>:<>Many small effects add up. Most individuals cluster near the average, with fewer at either extreme.</>}</p></div>
 {baseline&&<p className="comparison-detail">A: mean {baseline.stats.mean.toFixed(1)} cm · SD {baseline.stats.sd.toFixed(1)} cm · environment {baseline.environment.overall>0?'+':''}{baseline.environment.overall}. Comparisons use percentages to account for different sample sizes.</p>}
 <p className="chart-note">{geneCount>1&&curve?'Curve: a normal fit using the current mean and SD. ':''}Heights are illustrative; end bins include values beyond the plotted range.</p>
 </section>;
}
