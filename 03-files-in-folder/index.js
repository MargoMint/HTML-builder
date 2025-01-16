const fs = require('fs/promises');
const path = require('path');

async function allFiles() {
  const folderPath = path.join(__dirname, 'secret-folder');
  const files = await fs.readdir(folderPath, { withFileTypes: true });

  for (let file of files) {
    if (file.isFile()) {
      const filePath = path.join(folderPath, file.name);
      const stats = await fs.stat(filePath);

      const fileName = path.basename(file.name, path.extname(file.name));
      const fileExt = path.extname(file.name).slice(1);
      const fileSize = (stats.size / 1024).toFixed(2);

      console.log(`${fileName} - ${fileExt} - ${fileSize}kb`);
    }
  }
}

allFiles();