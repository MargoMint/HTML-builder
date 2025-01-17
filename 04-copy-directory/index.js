const fs = require('fs/promises');
const path = require('path');

async function copyDir(src, dest) {
  await clearFolder(dest);
  await createFolder(dest);

  const items = await readFolder(src);

  for (let item of items) {
    const srcPath = path.join(src, item.name);
    const destPath = path.join(dest, item.name);

    if (item.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else if (item.isFile()) {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function createFolder(folderPath) {
  await fs.mkdir(folderPath, { recursive: true });
}

async function readFolder(folderPath) {
  return await fs.readdir(folderPath, { withFileTypes: true });
}

async function clearFolder(folderPath) {
  await fs.rm(folderPath, { recursive: true, force: true });
}

(async () => {
  const srcFolder = path.join(__dirname, 'files');
  const destFolder = path.join(__dirname, 'files-copy');

  const srcExists = await fs.stat(srcFolder).catch(() => false);
  if (!srcExists) {
    return;
  }
  await copyDir(srcFolder, destFolder);
})();