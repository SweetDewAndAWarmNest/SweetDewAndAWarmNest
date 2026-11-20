import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { isValidPhrase } = require('./a.ts');
console.log('isValidPhrase(g1)=', isValidPhrase('g1'));
console.log('isValidPhrase(g2)=', isValidPhrase('g2'));
