const path = require('path');
const fs = require('fs');
const process = require('process');
const readline = require('readline');
const { count } = require('console');
const templateDir = path.join(__dirname, 'template.html');
const componentsDir = path.join(__dirname, `components`);
const distDir = path.join(__dirname, 'project-dist');


fs.mkdir(distDir, {
  recursive: true
}, err => {
  if (err) {
    throw err; // не удалось создать папки
  }
});


let data = '';
const templateReader = fs.createReadStream(templateDir, 'utf-8');
const output = fs.createWriteStream(path.join(distDir, 'index.html'), 'utf-8');
templateReader.on('data', (chunk) => {
  data += chunk;
});
templateReader.on('end', () => {
  data = data.split('\n');
  let counterWrite  = 0;
  let counterRead  = 0;
  for (let i = 0; i < data.length; i++) {
    let startPos = data[i].indexOf('{{');
    let endPos = data[i].lastIndexOf('}') + 1;
    if (startPos && endPos) {
      counterRead++;
      const componentName = data[i].slice(startPos + 2, endPos - 2);
      const componentDir = path.join(__dirname, `components`, `${componentName}.html`);
      let component = fs.createReadStream(componentDir, 'utf-8');
      component.on('data', (part) => {
        data[i] = part;
      });
      component.on('end', () =>{
        counterWrite++;
        if(counterWrite === counterRead){
          output.write(data.join('\n'));
        }
        
      });
    }

  }


});



