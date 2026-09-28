import { createContext, useContext } from 'react';
import { Maximize2, X } from 'lucide-react';
export type PanelId = 'board' | 'explorer' | 'environment' | 'distribution';
export const PanelViewContext = createContext<{expanded:PanelId|null;toggle:(id:PanelId)=>void}>({expanded:null,toggle:()=>{}});
export function PanelViewButton({panel,label}:{panel:PanelId;label:string}) {
 const {expanded,toggle}=useContext(PanelViewContext);
 const isExpanded=expanded===panel;
 return <button className="panel-view-button" aria-label={isExpanded?`Close expanded ${label}`:`Expand ${label}`} aria-expanded={isExpanded} title={isExpanded?'Return to all panels (Esc)':`Expand ${label}`} onClick={()=>toggle(panel)}>{isExpanded?<X size={17}/>:<Maximize2 size={15}/>}</button>;
}
