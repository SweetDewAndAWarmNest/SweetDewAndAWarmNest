// CJS, using built-in require, run under --experimental-strip-types
const { isValidPhrase, PHRASES } = require('./a.ts');
console.log('isValidPhrase(g1)=', isValidPhrase('g1'));
console.log('PHRASES len=', PHRASES.length);
