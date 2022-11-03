const path = require('path');
const fs = require('fs');
const process = require('process');
const readline = require('readline');
const { count } = require('console');
const templateDir = path.join(__dirname, 'template.html');
const componentsDir = path.join(__dirname, `components`);
const distDir = path.join(__dirname, 'project-dist');
const bundle = fs.createWriteStream(path.join(distDir, 'style.css'));
const stylesDir = path.join(__dirname, 'styles');


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





let cssData = '';
fs.readdir(stylesDir, (err, files) => {
  if (err) {
    console.log(err);
  } else {
    files.forEach(file => {
      let fileDir = path.join(stylesDir, file);
      let fileNameWithoutExt = path.basename(fileDir, path.extname(fileDir));
      let fileExt = path.extname(fileDir).slice(1);
      fs.stat(fileDir, (err, stats) => {
        if (!stats.isDirectory() && fileExt === 'css') {
          const readableStream = fs.createReadStream(fileDir, 'utf-8');
          readableStream.on('data', chunk => cssData += chunk);
          readableStream.on('end', () =>  bundle.write(cssData));
          readableStream.on('error', error => console.log('Error', error.message));
        }
      });
    });
  }
});



const assetsDir = path.join(__dirname, 'assets');
const assetsDist = path.join(__dirname,'project-dist', 'assets');
const fsPromises = fs.promises;


function createFolder(dir,foldername){
  fs.mkdir(path.join(dir,foldername),{ recursive: true },(err)=>{
    if(err){
      console.log(err);
    }
  });
}

function copyFile(src,dest){
  fsPromises.copyFile(src,dest)
    .catch(function(error){
      console.log(error);
    });
}

function CopyDir(src,dest){
  fs.readdir(src, (err, files) => {
    if (err) {
      console.log(err);
    } else {
      files.forEach(file => {
        let fileDir = path.join(src, file);
        fs.stat(fileDir, (err, stats) => {
          if (!stats.isDirectory()) {
            copyFile(fileDir, path.join(dest,file));
          } else{
            createFolder(dest,path.basename(fileDir));
            CopyDir(fileDir,path.join(dest,path.basename(fileDir)));
          }
        });
      });
     
    }
    
  });
  return 'Копирование завершено';
}






createFolder(distDir,'assets');
CopyDir(assetsDir,assetsDist);
