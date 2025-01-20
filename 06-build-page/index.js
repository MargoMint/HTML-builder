const fs = require('fs');
const promises = require('fs/promises');
const path = require('path');

const destFolder = path.join(__dirname, 'project-dist');

async function buildPage() {
  await promises.mkdir(destFolder, { recursive: true });

  await createHTML();
  await mergeStyles();
  await copyAssets();
}

async function createHTML() {
  const templatePath = path.join(__dirname, 'template.html');
  let template = await promises.readFile(templatePath, 'utf-8');

  const componentsFolder = path.join(__dirname, 'components');
  const regex = /{{(.*?)}}/g;
  let match;

  while ((match = regex.exec(template)) !== null) {
    const tagName = match[1].trim();
    const componentPath = path.join(componentsFolder, `${tagName}.html`);
    try {
      const componentContent = await promises.readFile(componentPath, 'utf-8');
      template = template.replace(match[0], componentContent);
    } catch {
      template = template.replace(match[0], '');
    }
  }

  const destHTMLPath = path.join(destFolder, 'index.html');
  await promises.writeFile(destHTMLPath, template);
}

async function mergeStyles() {
  const stylesFolder = path.join(__dirname, 'styles');
  const destCSSPath = path.join(destFolder, 'style.css');

  const files = await promises.readdir(stylesFolder, { withFileTypes: true });
  const cssContent = [];

  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const filePath = path.join(stylesFolder, file.name);
      const fileContent = await promises.readFile(filePath, 'utf-8');
      cssContent.push(fileContent);
    }
  }
  
  await promises.writeFile(destCSSPath, cssContent.join('\n'));
}

async function copyAssets() {
  const assetsSrc = path.join(__dirname, 'assets');
  const assetsDest = path.join(destFolder, 'assets');

  async function copyDir(src, dest) {
    await promises.mkdir(dest, { recursive: true });
    const entries = await promises.readdir(src, { withFileTypes: true });
  
    for (let entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        await copyDir(srcPath, destPath);
      } else {
        await promises.copyFile(srcPath, destPath);
      }
    }
  }
  await copyDir(assetsSrc, assetsDest);
}

buildPage().catch((err) => console.log('Error:', err));
