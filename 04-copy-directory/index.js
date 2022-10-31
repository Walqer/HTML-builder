
const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;
const dir = path.dirname(__filename);
const src = path.join(dir,'files');
const dest = path.join(dir,'files-copy');

function createFolder(dir,foldername){
  fs.mkdir(path.join(dir,foldername),{ recursive: true },(err)=>{
    if(err){
      console.log(err);
    }
  });
}
createFolder(dir,'files-copy');

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

console.log(CopyDir(src,dest));