# Getting Started

Welcome to the Luizalabs Agents & Skills Catalog! This guide will help you get up and running quickly.

## 🎯 What You Can Do

### 1. Browse Skills & Resources

Visit [Browse Skills](/skills/index.md) to explore all available skills.

### 2. Integrate with Your AI Tool

- [GitHub Copilot](/integration/copilot.md.md) - VS Code / Visual Studio
- [Antigravity](/integration/antigravity.md.md) - Google's AI agent
- [Gemini CLI](/integration/gemini.md.md) - Command-line assistant

### 3. Use in Your Project

Copy the standards to your repository and start using them immediately.

### 4. Search Everything

Use the [Search](/search.md.md) page to find specific skills, patterns, or rules.

## ⚡ 5-Minute Setup

<InstallTabs
  copilot="# 1. Go to your project directory
cd your-project

# 2. Create .github folder if it doesn't exist

mkdir -p .github

# 3. Download standards

curl -L <https://raw.githubusercontent.com/luizalabs/padrao-labs-agents/main/agents/index.md> -o agents.md
curl -L <https://raw.githubusercontent.com/luizalabs/padrao-labs-agents/main/agents/index.md> -o .github/copilot-instructions.md

# 4. Commit

git add agents.md .github/copilot-instructions.md
git commit -m 'docs: add luizalabs development standards'

# 5. Restart VS Code"

  antigravity="# 1. Go to your project directory
cd your-project

# 2. Download standards as AGENTS.md

curl -L <https://raw.githubusercontent.com/luizalabs/padrao-labs-agents/main/agents/index.md> -o AGENTS.md

# 3. Commit

git add AGENTS.md
git commit -m 'docs: add luizalabs development standards'

# 4. Done!"

  gemini="# 1. Go to your project directory
cd your-project

# 2. Download agents.md

curl -L <https://raw.githubusercontent.com/luizalabs/padrao-labs-agents/main/agents/index.md> -o agents.md

# 3. Create .gemini.json

cat > .gemini.json << 'EOF'
{
  &quot;projectId&quot;: &quot;your-gcp-project&quot;,
  &quot;context&quot;: {
    &quot;files&quot;: [&quot;agents.md&quot;],
    &quot;systemPrompt&quot;: &quot;Follow the patterns defined in agents.md&quot;
  },
  &quot;generation&quot;: {
    &quot;model&quot;: &quot;gemini-2.0-flash&quot;,
    &quot;temperature&quot;: 0.7
  }
}
EOF

# 4. Commit

git add agents.md .gemini.json
git commit -m 'docs: add luizalabs development standards'

# 5. Start using!"

/>

## 📚 What's in the Catalog

### Skills (70+)

Reusable development capabilities:

- Docker & Kubernetes automation
- Database patterns
- Testing frameworks
- CI/CD pipelines
- Security scanning
- And much more...

### Agents

Pre-configured AI agent instructions for:

- GitHub Copilot (VS Code, Visual Studio)
- Google Antigravity
- Cursor IDE
- Windsurf IDE
- Claude AI
- Gemini CLI

### Rules

Development standards:

- Security best practices
- Code quality guidelines
- Performance optimization
- Testing strategies

### Hooks & Workflows

Automation patterns:

- Pre-commit hooks
- Git workflows
- CI/CD pipelines
- Deployment procedures

## 🔗 Key Resources

- **[Home Page](/){target="_blank"}** - Overview
- **[Browse Skills](/skills/){target="_blank"}** - All 70+ skills
- **[View Agents](/agents/index.md){target="_blank"}** - Agent configurations
- **[Search](/search.md.md){target="_blank"}** - Find anything quickly
- **[GitHub Copilot Guide](/integration/copilot.md){target="_blank"}** - Step-by-step setup
- **[Antigravity Guide](/integration/antigravity.md){target="_blank"}** - Google AI setup
- **[Gemini CLI Guide](/integration/gemini.md){target="_blank"}** - CLI integration

## 💡 Common Tasks

### Find a Pattern for Docker

→ [Search](/search.md.md) for "Docker"

### Set Up Pre-Commit Hooks

→ Browse [Hooks](/hooks/index.md) or search "pre-commit"

### Integrate with Copilot

→ Follow [GitHub Copilot Setup](/integration/copilot.md)

### Get CI/CD Patterns

→ Check [Workflows](/workflows/index.md/index.md)

### Security Best Practices

→ Browse [Rules](/rules/index.md) or search "security"

## 🆘 Troubleshooting

### My AI tool isn't using the standards

- Ensure file is in the correct location
- Restart your IDE
- Check file permissions
- For CLI tools: reload context with specific flags

### I want to update the standards

→ Check [the agents.md file](/agents/index.md) in your project and pull latest

### I want to contribute new standards

→ Contact Luizalabs team or submit via GitHub

## 📞 Support

- **Documentation**: All guides are in `/integration/` folder
- **Search**: Use [Search](/search.md.md) for any topic
- **GitHub Issues**: Report bugs or suggest improvements
- **Discussions**: Ask questions in GitHub Discussions

---

**Next Steps:**

1. Choose your integration ([Copilot](/integration/copilot.md), [Antigravity](/integration/antigravity.md.md), [Gemini](/integration/gemini.md))
2. Follow the 5-minute setup
3. Start exploring [Skills](/skills/)
4. Use [Search](/search.md.md) to find specific patterns

**Happy coding! 🚀**
