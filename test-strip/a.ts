export const PHRASES = [{id:'g1', text:'hi', emoji:'👋', category:'greeting', enabled:true}];
export function isValidPhrase(id:string){ return PHRASES.some(p=>p.id===id); }
