export type ProteinIcon = 'switch' | 'message' | 'receiver' | 'scaffold' | 'enzyme';
export interface Gene {
  id: string; displayName: string; role: string; proteinType: string;
  icon: ProteinIcon; effectSize: number; description: string; note: string;
}
// Effect sizes are invented teaching weights, not estimates for these genes.
const examples: [string, string, string, ProteinIcon, string][] = [
 ['HMGA2','Helps regulate growth-related gene activity','Gene activity regulator','switch','Helps organise DNA so that other proteins can control growth-related genes.'],
 ['SHOX','Supports the growth of bones in the limbs','Transcription factor','switch','Helps switch on the instructions that growing bones need, especially in the arms and legs.'],
 ['IGF1','Carries a growth-promoting message','Hormone / growth signal','message','Insulin-like growth factor 1 sends signals that help cells grow and divide, including cells in growing bones.'],
 ['IGF1R','Receives growth messages from IGF1','Receptor','receiver','A receptor on the cell surface receives IGF1 and passes its growth message into the cell.'],
 ['GH1','Provides instructions for growth hormone','Hormone','message','Growth hormone from the pituitary gland supports body growth, partly by stimulating IGF1 production.'],
 ['GHR','Receives growth hormone messages','Receptor','receiver','This receptor lets cells respond to growth hormone and start a chain of signals inside the cell.'],
 ['ACAN','Helps build resilient cartilage','Structural proteoglycan','scaffold','Aggrecan helps cartilage hold water and resist compression. Cartilage forms the growth plates of developing bones.'],
 ['COL2A1','Builds a supporting network in cartilage','Structural protein','scaffold','Type II collagen forms strong fibres that help support cartilage, including cartilage in growing bones.'],
 ['FGFR3','Helps regulate bone growth signals','Receptor','receiver','Receives signals that help control the rate of bone growth. Some changes make this growth-limiting signal too strong.'],
 ['GDF5','Signals during joint and bone development','Growth signal','message','A signal that helps guide the development of bones, cartilage and joints.'],
 ['PAPPA2','Helps make growth factors available','Enzyme','enzyme','Cuts certain proteins that bind IGF growth factors, helping regulate how much of the growth signal is available.'],
 ['CYP19A1','Helps produce oestrogens','Enzyme','enzyme','Aromatase converts androgens into oestrogens, which are involved in bone development and growth-plate maturation.'],
];
export const genes: Gene[] = examples.map(([id,role,proteinType,icon,description],i) => ({
 id, displayName:id, role, proteinType, icon, description, effectSize: 1.15 + (i % 5) * .1,
 note: id === 'HMGA2' ? 'HMGA2 is a DNA-binding regulator, not a simple on/off switch. The switch is a teaching metaphor.' : 'Real variants can have different effects. A left or right step here does not describe a specific allele, mutation or measured gene effect.'
}));

// IGF1 illustrates all four environmental pathways in the introductory mode.
export function activeGenes(count:1|12):Gene[] { return count===1?[genes.find(g=>g.id==='IGF1')!]:genes; }
