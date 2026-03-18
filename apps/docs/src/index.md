---
layout: home

hero:
  name: "Catálogo Luizalabs"
  text: "Central de Agentes e Skills de IA"
  tagline: "O catálogo oficial de capacidades para o Visual Studio Code com GitHub Copilot."
  image:
    src: /logo.png
    alt: Catálogo Luizalabs
  actions:
    - theme: brand
      text: Primeiros Passos
      link: "/getting-started"
    - theme: brand
      text: Acessar Agents
      link: "/agents/"
    - theme: alt
      text: Acessar Skills
      link: "/skills/"
---

<div style="margin-bottom: 1.5rem; background: linear-gradient(135deg, rgba(255, 200, 50, 0.12) 0%, rgba(255, 150, 50, 0.06) 100%); padding: 1.25rem 1.5rem; border-radius: 12px; border: 1px solid rgba(255, 180, 50, 0.3);">
  <p style="margin: 0; font-size: 0.95rem; color: var(--vp-c-text-1);">
    <strong>Requisito:</strong> Voce precisa ter o <strong>Node.js</strong> (versao 18 ou superior) instalado no seu computador.
  </p>
  <p style="margin: 0.75rem 0 0 0; font-size: 0.9rem;">
    <strong>Como instalar o Node.js:</strong> Acesse <a href="https://nodejs.org" target="_blank" rel="noopener">nodejs.org</a>, baixe a versao <strong>LTS</strong> (recomendada) e siga o instalador. Apos a instalacao, abra o terminal e digite <code>node --version</code> para confirmar.
  </p>
</div>

<div style="margin-bottom: 2.5rem;">
  <h3 style="margin-top: 0; margin-bottom: 1.5rem; font-size: 1.3rem; color: var(--vp-c-brand); font-weight: 600;">Instale via CLI para comecar</h3>
  <p style="margin-bottom: 1rem; font-size: 0.95rem; color: var(--vp-c-text-2);">
    Cole o comando abaixo no seu terminal (Prompt de Comando, PowerShell ou Terminal do Mac/Linux) e pressione Enter:
  </p>
  <div style="display: flex; align-items: center; gap: 0.75rem; background: linear-gradient(135deg, rgba(100, 200, 254, 0.08) 0%, rgba(100, 150, 254, 0.04) 100%); padding: 1.5rem; border-radius: 12px; border: 2px solid var(--vp-c-brand); position: relative;">
    <code class="clone-command" style="background: transparent; padding: 0; font-size: 1rem; font-weight: 500; color: var(--vp-c-text-1); flex: 1; font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace; user-select: all;">git clone git@gitlab.luizalabs.com:luizalabs/padrao-labs-agents.git && cd padrao-labs-agents && npm i && npm link .</code>
    <button class="copy-clone-btn" style="background: var(--vp-c-brand); color: white; border: none; padding: 0.75rem 1.25rem; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.95rem; transition: all 0.3s ease; white-space: nowrap; display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0;">
      <span class="copy-icon">📋</span>
      <span class="copy-text">Copiar</span>
    </button>
  </div>
</div>

<script type="module">
// Only run on client-side (not during SSR)
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  function initCopyButton() {
    const copyBtn = document.querySelector('.copy-clone-btn');
    const cloneCmd = document.querySelector('.clone-command');

    if (!copyBtn || !cloneCmd) {
      console.warn('Elementos de cópia não encontrados');
      return;
    }

    copyBtn.addEventListener('mouseover', function() {
      this.style.background = 'var(--vp-c-brand-dark)';
      this.style.transform = 'translateY(-2px)';
      this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    });

    copyBtn.addEventListener('mouseout', function() {
      this.style.background = 'var(--vp-c-brand)';
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = 'none';
    });

    copyBtn.addEventListener('click', async function(e) {
      e.preventDefault();
      const cmd = cloneCmd.textContent.trim();
      const icon = this.querySelector('.copy-icon');
      const text = this.querySelector('.copy-text');

      try {
        await navigator.clipboard.writeText(cmd);
        icon.textContent = '✅';
        text.textContent = 'Copiado!';
        this.style.background = '#10b981';

        setTimeout(() => {
          icon.textContent = '📋';
          text.textContent = 'Copiar';
          this.style.background = 'var(--vp-c-brand)';
        }, 2000);
      } catch (err) {
        console.error('Erro ao copiar:', err);
        icon.textContent = '❌';
        text.textContent = 'Erro';
        setTimeout(() => {
          icon.textContent = '📋';
          text.textContent = 'Copiar';
        }, 2000);
      }
    });
  }

  // Tentar inicializar imediatamente
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCopyButton);
  } else {
    initCopyButton();
  }

  // Também tenta após um pequeno delay para componentes lazy-loaded
  setTimeout(initCopyButton, 100);
}
</script>

<CategoryCards />

<div class="container info-section fade-in" style="margin-bottom: 3rem; border-left: 4px solid #6366f1; padding-left: 1.5rem;">
  <div class="info-grid">
    <div class="info-content">
      <h2>Instalacao Global via CLI</h2>
      <p>
        Instale todas as skills, agents, rules e workflows globalmente no Visual Studio Code com GitHub Copilot usando um unico comando.
      </p>
      <div style="background: var(--vp-c-bg-soft); padding: 1rem; border-radius: 8px; margin-top: 1rem;">
        <code style="font-size: 0.95rem;">padrao-labs-agents install</code>
      </div>
      <p style="margin-top: 1rem; font-size: 0.9rem; color: var(--vp-c-text-2);">
        Outros comandos: <code>init</code> (padroniza repo), <code>cron</code> (auto-update diario), <code>update</code> (atualiza para latest).
        Veja o guia completo em <a href="/getting-started">Primeiros Passos</a>.
      </p>
    </div>
    <div class="info-visual">
      <div class="visual-item">
        <div class="visual-icon">📦</div>
        <div>
          <strong>VS Code & Copilot</strong>
          <p class="text-sm text-muted">Apoio total às extensões de IA no ambiente VS Code.</p>
        </div>
      </div>
      <div class="visual-item">
        <div class="visual-icon">🔄</div>
        <div>
          <strong>Auto-Update</strong>
          <p class="text-sm text-muted">Cron diario mantém tudo na versao mais recente.</p>
        </div>
      </div>
      <div class="visual-item">
        <div class="visual-icon">🚀</div>
        <div>
          <strong>Init de Repositorio</strong>
          <p class="text-sm text-muted">Gera arquivos de configuração essenciais para o seu projeto.</p>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="container info-section fade-in" style="margin-bottom: 3rem; border-left: 4px solid var(--vp-c-brand); padding-left: 1.5rem;">
  <div class="info-grid">
    <div class="info-content">
      <h2>O que é uma Skill?</h2>
      <p>
        Uma <strong>Skill</strong> é um pacote modular de instruções, scripts e recursos prontos para IA que estendem as capacidades do seu GitHub Copilot.
      </p>
      <p>
        Pense nela como um "plugin" para suas interações com LLMs, fornecendo conhecimento específico de domínio, padrões de uso de ferramentas e fluxos de trabalho automatizados que garantem o seguimento dos padrões de engenharia da Luizalabs.
      </p>
    </div>
    <div class="info-visual">
      <div class="visual-item">
        <div class="visual-icon">📦</div>
        <div>
          <strong>Estrutura Padronizada</strong>
          <p class="text-sm text-muted">Uma única fonte da verdade para o seu editor.</p>
        </div>
      </div>
      <div class="visual-item">
        <div class="visual-icon">🛠️</div>
        <div>
          <strong>Recursos Prontos para Uso</strong>
          <p class="text-sm text-muted">Scripts e arquivos de configuração integrados.</p>
        </div>
      </div>
      <div class="visual-item">
        <div class="visual-icon">✅</div>
        <div>
          <strong>Melhores Práticas</strong>
          <p class="text-sm text-muted">Validado pelo time de Engenharia Core.</p>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="container info-section fade-in" style="margin-bottom: 3rem; border-left: 4px solid #FF6B6B; padding-left: 1.5rem;">
  <div class="info-grid reverse">
    <div class="info-visual">
      <div class="visual-item">
        <div class="visual-icon">🛡️</div>
        <div>
          <strong>Contexto Persistente</strong>
          <p class="text-sm text-muted">Diretrizes sempre ativas para o modelo.</p>
        </div>
      </div>
      <div class="visual-item">
        <div class="visual-icon">🎯</div>
        <div>
          <strong>Ativação Seletiva</strong>
          <p class="text-sm text-muted">Acionado por @menções no Copilot Chat.</p>
        </div>
      </div>
    </div>
    <div class="info-content">
      <h2>O que são Regras?</h2>
      <p>
        <strong>Regras</strong> são restrições ou diretrizes definidas manualmente que fornecem contexto persistente e reutilizável para o Copilot no <strong>nível do prompt</strong>.
      </p>
      <p>
        Enquanto Skills são conhecimentos "puxados" sob demanda, Regras ditam como o agente deve pensar e se comportar em todas as interações — impondo estilos de código específicos, padrões de arquitetura ou fundamentos de segurança.
      </p>
    </div>
  </div>
</div>

<div class="container info-section fade-in" style="margin-bottom: 3rem; border-left: 4px solid #FFD93D; padding-left: 1.5rem;">
  <div class="info-grid reverse">
    <div class="info-visual">
      <div class="visual-item">
        <div class="visual-icon">⚙️</div>
        <div>
          <strong>Fluxos de Trabalho</strong>
          <p class="text-sm text-muted">Automatize sequências complexas de tarefas.</p>
        </div>
      </div>
      <div class="visual-item">
        <div class="visual-icon">🔀</div>
        <div>
          <strong>Orquestração</strong>
          <p class="text-sm text-muted">Coordene tarefas pelo Copilot.</p>
        </div>
      </div>
    </div>
    <div class="info-content">
      <h2>O que são Workflows?</h2>
      <p>
        <strong>Workflows</strong> são sequências automatizadas de tarefas que combinam múltiplas skills, regras e o Copilot para resolver problemas complexos de forma coordenada.
      </p>
      <p>
        Diferentemente de uma skill individual, um workflow orquestra uma série de passos interdependentes, como analisar código, executar testes, fazer deploy e monitorar resultados - tudo em uma sequência lógica e automatizada.
      </p>
    </div>
  </div>
</div>

<div class="container" style="margin-bottom: 4rem;">
  <h2 style="text-align: center; margin-bottom: 1rem; font-size: 1.8rem;">Estrutura Hierárquica</h2>
  <p style="text-align: center; color: var(--vp-c-text-2); margin-bottom: 2rem;">Como Workflows, Agents, Skills, e Rules se relacionam</p>
  <div style="background: var(--vp-c-bg-soft); padding: 2.5rem; border-radius: 12px; border: 1px solid var(--vp-c-divider);">

```mermaid
flowchart LR
  %% Nodes with icons and emojis
  Workflow["⚙️ Workflow"]
  Agent["👤 Copilot Agent"]
  Skill["🛠️ Skill"]
  Rule["📏 Rule"]

  %% Edges with descriptive labels
  Workflow -->|Orquestra tarefas| Agent
  Agent -->|Usa e ativa| Skill
  Agent -->|Segue diretrizes| Rule

  %% Enhanced styling with better contrast and padding
  classDef workflow fill:#FFD700,stroke:#B8860B,stroke-width:3px,color:#000,font-size:14px,font-weight:bold,padding:15px;
  classDef agent fill:#87CEEB,stroke:#4169E1,stroke-width:3px,color:#000,font-size:14px,font-weight:bold,padding:15px;
  classDef skill fill:#90EE90,stroke:#228B22,stroke-width:3px,color:#000,font-size:14px,font-weight:bold,padding:15px;
  classDef rule fill:#FFB6C1,stroke:#C71585,stroke-width:3px,color:#000,font-size:14px,font-weight:bold,padding:15px;

  class Workflow workflow
  class Agent agent
  class Skill skill
  class Rule rule

  %% Enhanced link styles
  linkStyle 0 stroke:#4169E1,stroke-width:2.5px;
  linkStyle 1 stroke:#228B22,stroke-width:2.5px;
  linkStyle 2 stroke:#C71585,stroke-width:2.5px;
```

  </div>
</div>