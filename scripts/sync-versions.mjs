import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_FOLDER = path.join(__dirname, "..");

// 1. Pega a versão fonte da verdade (package.json raiz)
const rootPackageJsonPath = path.join(ROOT_FOLDER, "package.json");
const rootPackage = JSON.parse(fs.readFileSync(rootPackageJsonPath, "utf8"));
const currentVersion = rootPackage.version;

console.log(`\n🔄 Sincronizando versão ${currentVersion} para todos os pacotes e plugins...\n`);

function updateJsonFile(filePath, key = 'version') {
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    if (data[key] !== currentVersion) {
      data[key] = currentVersion;
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', "utf8");
      console.log(`✅ Atualizado: ${path.relative(ROOT_FOLDER, filePath)}`);
    } else {
      console.log(`➖ Já atualizado: ${path.relative(ROOT_FOLDER, filePath)}`);
    }
  } else {
    console.warn(`⚠️ Não encontrado: ${path.relative(ROOT_FOLDER, filePath)}`);
  }
}

// 2. Atualiza Workspaces (CLI, Docs)
const workspaces = [
  path.join(ROOT_FOLDER, "cli", "package.json"),
  path.join(ROOT_FOLDER, "apps", "docs", "package.json"),
];

workspaces.forEach(ws => updateJsonFile(ws));

// 3. Atualiza Plugins
const pluginsDir = path.join(ROOT_FOLDER, "plugins");
if (fs.existsSync(pluginsDir)) {
  const pluginFolders = fs.readdirSync(pluginsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  pluginFolders.forEach(folder => {
    const pluginJsonPath = path.join(pluginsDir, folder, ".github/plugin/plugin.json");
    updateJsonFile(pluginJsonPath);
  });
}

// 4. Atualiza o próprio Marketplace (se existir)
const marketplacePath = path.join(ROOT_FOLDER, ".github/plugin/marketplace.json");
if (fs.existsSync(marketplacePath)) {
  const data = JSON.parse(fs.readFileSync(marketplacePath, "utf8"));
  if (data.metadata && data.metadata.version !== currentVersion) {
    data.metadata.version = currentVersion;
    
    // Atualiza também a versão in-line dos plugins que apontam para diretórios locais
    if (Array.isArray(data.plugins)) {
       data.plugins.forEach(p => {
         if (p.source && p.source.startsWith('./plugins')) {
           p.version = currentVersion;
         }
       });
    }

    fs.writeFileSync(marketplacePath, JSON.stringify(data, null, 2) + '\n', "utf8");
    console.log(`✅ Atualizado: ${path.relative(ROOT_FOLDER, marketplacePath)}`);
  } else {
    console.log(`➖ Já atualizado: ${path.relative(ROOT_FOLDER, marketplacePath)}`);
  }
}

console.log(`\n🎉 Sincronização de versão concluída com sucesso!\n`);
