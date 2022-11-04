
const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;
const dir = path.dirname(__filename);
const src = path.join(dir,'files');
const dest = path.join(dir,'files-copy');




function copyFile(src,dest){
  fsPromises.copyFile(src,dest)
    .catch(function(error){
      console.log(error);
    });
}

async function copyDir(src,dest){

  async function createFolder(dest){
    await fsPromises.rm(dest,{ recursive: true, force: true },(err)=>{
      if(err){
        console.log(err);
      }
    });
    await fsPromises.mkdir(dest,{ recursive: true },(err)=>{
      if(err){
        console.log(err);
      }
    });
    
  }
  await createFolder(dest);


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
            copyDir(fileDir,path.join(dest,path.basename(fileDir)));
          }
        });
      });
     
    }
    
  });
}

copyDir(src,dest);