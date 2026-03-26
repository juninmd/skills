import fs from 'fs';
import path from 'path';

/**
 * Linter para validar a estrutura e caminhos dos Agent Plugins
 * Garante que:
 * 1. Todos os plugins têm um plugin.json
 * 2. Todos os caminhos de 'skills' e 'agents' no JSON existem no disco
 * 3. A estrutura de diretórios do plugin está correta (.github/plugin/plugin.json)
 */

const pluginsDir = path.join(process.cwd(), 'plugins');

let hasErrors = false;

console.log('🔍 Iniciando linting dos Agent Plugins...\n');

// Função auxiliar para encontrar arquivos plugin.json recursivamente
function findPluginFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const name = path.join(dir, file);
        if (fs.statSync(name).isDirectory()) {
            findPluginFiles(name, fileList);
        } else if (file === 'plugin.json') {
            fileList.push(name);
        }
    }
    return fileList;
}

// 1. Verificar se cada pasta em plugins/ tem um plugin.json
const pluginFolders = fs.readdirSync(pluginsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

for (const folder of pluginFolders) {
    const jsonPath = path.join(pluginsDir, folder, '.github/plugin/plugin.json');
    const folderPath = path.join(pluginsDir, folder);

    if (!fs.existsSync(jsonPath)) {
        // Verificar se a pasta tem conteúdo relevante
        const folderContents = fs.readdirSync(folderPath, { withFileTypes: true });
        const hasContent = folderContents.some(item => item.name !== '.github' && item.name !== 'README.md');

        if (hasContent) {
            console.error(`❌ [${folder}] Faltando arquivo de manifesto`);
            console.error(`   📁 Caminho: ${jsonPath}`);
            console.error(`   💡 Dica: Crie o arquivo plugin.json neste diretório com referências às skills e agents`);
        } else {
            console.warn(`⚠️  [${folder}] Pasta vazia ou sem conteúdo relevante`);
            console.warn(`   📁 Caminho: ${folderPath}`);
            console.warn(`   💡 Dica: Adicione skills/agents ou remova a pasta se não for usada`);
        }
        hasErrors = true;
    }
}

// 2. Validar caminhos dentro de cada plugin.json
const pluginFiles = findPluginFiles(pluginsDir);

for (const jsonPath of pluginFiles) {
    // Pegar o nome do plugin do caminho (plugins/<nome-do-plugin>/...)
    const relativePath = path.relative(pluginsDir, jsonPath);
    const pluginName = relativePath.split(path.sep)[0];

    let content;
    try {
        content = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    } catch (err) {
        console.error(`❌ [${pluginName}] Erro ao ler JSON em ${jsonPath}: ${err.message}`);
        hasErrors = true;
        continue;
    }

    const baseDir = path.dirname(jsonPath);

    console.log(`📦 Validando plugin: ${pluginName}`);

    // Validar Skills
    if (content.skills && Array.isArray(content.skills)) {
        for (const skillPath of content.skills) {
            const fullPath = path.resolve(baseDir, skillPath);
            if (!fs.existsSync(fullPath)) {
                console.error(`   ❌ Skill não encontrada: ${skillPath} (Resolvido para: ${fullPath})`);
                hasErrors = true;
            } else {
                console.log(`   ✅ Skill OK: ${skillPath}`);
            }
        }
    }

    // Validar Agents
    if (content.agents && Array.isArray(content.agents)) {
        for (const agentPath of content.agents) {
            const fullPath = path.resolve(baseDir, agentPath);
            if (!fs.existsSync(fullPath)) {
                console.error(`   ❌ Agent não encontrado: ${agentPath} (Resolvido para: ${fullPath})`);
                hasErrors = true;
            } else {
                console.log(`   ✅ Agent OK: ${agentPath}`);
            }
        }
    }
    console.log('');
}

if (hasErrors) {
    console.error('🚨 Erros encontrados nos Agent Plugins. Verifique os caminhos acima.');
    process.exit(1);
} else {
    console.log('🎉 Todos os caminhos dos Agent Plugins foram validados com sucesso!');
}
