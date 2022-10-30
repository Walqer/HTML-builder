const fs = require('fs');
const path = require('path');
const dir = (path.dirname(__filename));
const readableStream = fs.createReadStream(path.join(dir,'text.txt'), 'utf-8');
let data = '';
readableStream.on('data', chunk => data+=chunk);
readableStream.on('end', () => console.log(data));
readableStream.on('error', error => console.log('Error', error.message));