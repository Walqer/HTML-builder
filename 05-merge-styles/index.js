const path = require('path');
const fs = require('fs');
const readline = require('readline');
const process = require('process');
const dir = path.join(path.dirname(__filename), 'styles');
const dist = path.join(path.dirname(__filename), 'project-dist');
const bundle = fs.createWriteStream(path.join(dist, 'bundle.css'));

let data = '';
let merge = fs.readdir(dir, (err, files) => {
  if (err) {
    console.log(err);
  } else {
    let counter = 0;
    let mergedCounter = 0;
    files.forEach(file => {
      let fileDir = path.join(dir, file);
      let fileNameWithoutExt = path.basename(fileDir, path.extname(fileDir));
      let fileExt = path.extname(fileDir).slice(1);
      fs.stat(fileDir, (err, stats) => {
        if (!stats.isDirectory() && fileExt === 'css') {
          counter++;
          const readableStream = fs.createReadStream(fileDir, 'utf-8');
          readableStream.on('data', chunk => data+= chunk);
          readableStream.on('end', () =>{
            mergedCounter++;
            if(mergedCounter === counter){
              bundle.write(data);
            }
          });
          readableStream.on('error', error => console.log('Error', error.message));
        }
      });
    });
  }
});
