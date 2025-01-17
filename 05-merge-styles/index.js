const fs = require('fs');
const path = require('path');

const styleDir = path.join(__dirname, 'styles');
const destFile = path.join(__dirname, 'project-dist', 'bundle.css');

fs.writeFile(destFile, '', (err) => {
  if (err) throw err;

  fs.readdir(styleDir, { withFileTypes: true }, (err, files) => {
    if (err) throw err;
  
    const readPromises = files
      .filter(file => file.isFile() && path.extname(file.name) === '.css')
      .map(file => fs.promises.readFile(path.join(styleDir, file.name), 'utf8'));

      Promise.all(readPromises)
        .then(contents => fs.writeFile(destFile, contents.join('\n'), err => {
          if (err) throw err;
        }))
        .catch(err => {
          throw err;
        });
  });
});


