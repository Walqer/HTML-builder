const path = require('path');
const fs = require('fs');
const dir = path.join(path.dirname(__filename), 'secret-folder');

fs.readdir(dir, (err, files) => {
  if (err) {
    console.log(err);
  } else {
    files.forEach(file => {
      let fileDir = path.join(dir, file);
      let fileNameWithoutExt = path.basename(fileDir, path.extname(fileDir));
      let fileExt = path.extname(fileDir).slice(1);
      fs.stat(fileDir, (err, stats) => {
        if (!stats.isDirectory()) {
          console.log(`${fileNameWithoutExt} - ${fileExt} - ${stats.size / 1000}kb`);
        }
      });
    });
  }
});