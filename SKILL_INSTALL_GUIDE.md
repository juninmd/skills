# 🎯 Skill Install Command

## Overview
O comando `skill install` permite instalar skills personalizadas direto do repositório GitLab de forma rápida e eficiente usando symlinks.

## Uso

```bash
# Instalar uma skill
padrao-labs-agents skill install <skill-name>

# Ver ajuda
padrao-labs-agents skill help
```

## Exemplos

```bash
# Instalar applying-yagni
padrao-labs-agents skill install applying-yagni

# Instalar applying-dry
padrao-labs-agents skill install applying-dry

# Instalar applying-solid
padrao-labs-agents skill install applying-solid
```

## Localização das Skills Instaladas

As skills são instaladas em: `~/.agents/skills/<skill-name>/`

```bash
# Listar skills instaladas
ls -la ~/.agents/skills/

# Ver conteúdo de uma skill instalada
cat ~/.agents/skills/applying-yagni/SKILL.md

# Remover uma skill
rm -rf ~/.agents/skills/applying-yagni
```

## Estrutura de Diretórios

```
~/.padrao-labs/
└── padrao-labs-agents/                (2-3 MB)
    └── Clone único do repositório GitLab
        ├── .agents/
        │   ├── agents/
        │   ├── skills/
        │   │   ├── applying-clean-code/
        │   │   ├── applying-dry/
        │   │   ├── applying-kiss/
        │   │   ├── applying-solid/
        │   │   ├── applying-yagni/
        │   │   └── ... (todas as skills)
        │   ├── rules/
        │   ├── hooks/
        │   └── workflows/
        ├── cli/
        └── ... (estrutura completa do repo)

~/.agents/                             (Symlinks para tudo)
├── skills/                            (< 50 KB - symlinks de skills)
│   ├── applying-clean-code/
│   │   └── SKILL.md → symlink para ../padrao-labs/padrao-labs-agents/.agents/skills/...
│   ├── applying-dry/
│   └── ... (todas as skills instaladas)
├── agents/                            ← Criado pelo setup (futuro)
├── rules/                             ← Criado pelo setup (futuro)
├── hooks/                             ← Criado pelo setup (futuro)
├── workflows/                         ← Criado pelo setup (futuro)
└── ... (outros symlinks do setup)
```

## Como Funciona

1. **Clone Única Vez**: Primeiro `skill install` clona o repo completo em `~/.padrao-labs/padrao-labs-agents/`
2. **Reutilização**: Próximas instalações (e o comando `setup` do CLI) reutilizam o clone
3. **Symlinks**: Cada skill instalada tem symlinks para seus arquivos
4. **Leve**: Skills ocupam apenas kilobytes (apenas symlinks)

## Integração com Setup

O comando `setup` (quando implementado) usará o mesmo repositório e fará symlinks em `~/.agents/`:

```bash
# Setup instala tudo em ~/.agents
padrao-labs-agents setup
→ Clona em ~/.padrao-labs/padrao-labs-agents/ (se não existir)
→ Faz symlinks de praticamente tudo em ~/.agents/

# Skill install instala apenas uma skill em ~/.agents/skills/
padrao-labs-agents skill install applying-yagni
→ Reutiliza clone em ~/.padrao-labs/padrao-labs-agents/
→ Faz symlink apenas dessa skill em ~/.agents/skills/
```

**Resultado:** Todos os symlinks convergem para `~/.agents/`, único clone compartilhado!

## Vantagens

✅ **Eficiente**: Clone único (~3 MB), reutilizado por todas as skills  
✅ **Rápido**: Primeira instalação clona repo, próximas são instantâneas  
✅ **Leve**: Skills instaladas gastam < 50 KB (symlinks)  
✅ **Seguro**: Valida nome e existência da skill  
✅ **Privado**: Funciona com repositórios privados via SSH/HTTPS  
✅ **Simples**: Um comando, sem opções extras  

## Implementação

### Arquivos Criados

- `cli/src/commands/skill.ts` - Comando principal
- `cli/src/installers/skill-installer.ts` - Lógica de instalação com symlinks

### Arquivos Modificados

- `cli/src/index.ts` - Registrou o novo comando no CLI

### Tecnologias Usadas

- **Git Clone**: Clone completo do repositório (depth 1, filter=blob:none)
- **Node.js fs**: Criação de symlinks
- **execSync**: Execução de comandos git

## Estatísticas

```
1 repo clone:    2.9 MB
1 skill:         ~4 KB (symlink)
2 skills:        ~8 KB (symlinks)
10 skills:      ~40 KB (symlinks)
```

**Comparação com cópias:**
- Com symlinks: 3.0 MB para 10 skills
- Com cópias: ~30+ MB para 10 skills 🚀

## Segurança

- ✅ Validação de nome de skill
- ✅ Verifica se skill já está instalada
- ✅ Valida se pasta existe no repositório
- ✅ Reutiliza credenciais Git existentes
- ✅ Symlinks não quebram quando repo é atualizado  
