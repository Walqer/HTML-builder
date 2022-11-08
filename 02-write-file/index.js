const fs = require('fs');
const path = require('path');
const process = require('process');
const readline = require('readline');
const rl = readline.createInterface
  (
    process.stdin,
    process.stdout
  );
const dir = path.dirname(__filename);
const output = fs.createWriteStream(path.join(dir, 'text.txt'));


rl.on('line', (input) => {
  output.write(input + '\n');
  if (input == 'exit') {
    console.log('Программа завершена');
    process.exit();
  }
});

rl.on('SIGINT', (code) => {
  console.log('Программа завершена');
  process.exit();
});