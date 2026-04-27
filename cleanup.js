import fs from 'fs';
import path from 'path';

const dirsToSearch = [
  'xmcl-keystone-ui/locales',
  'xmcl-electron-app/main/locales',
  'xmcl-electron-app/main/utils',
  'xmcl-electron-app/build.ts',
  'xmcl-keystone-ui/package.json'
];

function replaceInFile(filePath) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('X Minecraft Launcher')) {
      content = content.replace(/X Minecraft Launcher/g, 'Modula Launcher');
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated: ' + filePath);
    }
  }
}

function traverseAndReplace(dir) {
  if (fs.existsSync(dir)) {
    const isFile = fs.statSync(dir).isFile();
    if (isFile) {
      replaceInFile(dir);
    } else {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
          traverseAndReplace(fullPath);
        } else {
          if (fullPath.endsWith('.yaml') || fullPath.endsWith('.ts') || fullPath.endsWith('.json')) {
            replaceInFile(fullPath);
          }
        }
      }
    }
  }
}

dirsToSearch.forEach(traverseAndReplace);
console.log('Done!');
