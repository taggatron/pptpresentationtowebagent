export type FactorId = 'prenatal' | 'nutrition' | 'sleep' | 'illness';
export interface Environment { overall: number; prenatal: number; nutrition: number; sleep: number; illness: number }
export interface Factor { id: FactorId; name: string; short: string; low: string; high: string; description: string; note: string }
export const neutralEnvironment: Environment = { overall:0, prenatal:50, nutrition:50, sleep:50, illness:50 };
export const factors: Factor[] = [
 {id:'prenatal', name:'Prenatal conditions', short:'Prenatal', low:'Adverse', high:'Supportive', description:'Conditions before birth, including maternal nutrition and health, can influence growth and development.', note:'Many different prenatal influences are combined into one illustrative control.'},
 {id:'nutrition', name:'Childhood nutrition', short:'Nutrition', low:'Limited', high:'Adequate', description:'Access to enough energy, protein and micronutrients supports growth. Poor nutrition may limit growth potential.', note:'Better nutrition supports growth potential; it does not make height increase without limit.'},
 {id:'sleep', name:'Sleep / recovery', short:'Sleep', low:'Disrupted', high:'Restorative', description:'Sleep and recovery support normal development and the regulation of growth-related hormones.', note:'This slider is a teaching abstraction, not a prediction of centimetres gained from sleep.'},
 {id:'illness', name:'Illness burden', short:'Illness', low:'Low burden', high:'High burden', description:'Persistent illness can use energy and disrupt processes needed for growth.', note:'A higher illness burden shifts this model toward shorter outcomes and increases variation. Real effects depend on the illness and its treatment.'},
];

export type EnvironmentalPolarity = 'positive' | 'negative';
export function factorMetadata(factor:Factor, polarity:EnvironmentalPolarity):Factor {
 if(factor.id!=='prenatal'||polarity!=='negative')return factor;
 return {...factor,name:'Prenatal smoking',short:'Prenatal smoking',low:'Lower exposure',high:'Higher exposure',description:'Smoking during pregnancy can restrict fetal growth, including through reduced oxygen supply and changes in growth signalling.',note:'This is an illustrative adverse prenatal condition. The slider is not a cigarette count or a prediction of adult height.'};
}
export function toggleFactor(e:Environment,id:FactorId,polarity:EnvironmentalPolarity):Environment {
 return {...e,[id]:e[id]!==50?50:id==='illness'?100:polarity==='positive'?100:0};
}
export function setFactorPolarity(e:Environment,polarity:EnvironmentalPolarity):Environment {
 const next={...e};
 for(const id of ['prenatal','nutrition','sleep'] as const){if(e[id]!==50)next[id]=50+(polarity==='positive'?1:-1)*Math.abs(e[id]-50);}
 // Illness always represents burden when activated, never a growth benefit.
 return next;
}
