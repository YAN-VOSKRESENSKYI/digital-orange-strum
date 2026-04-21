const fs = require('fs');
const s = fs.readFileSync('src/imports/VLob1.tsx', 'utf8');
const i = s.indexOf('function H8()');
console.log('H8 found at char', i);
if (i !== -1) {
  console.log(s.slice(i, i + 200));
}
