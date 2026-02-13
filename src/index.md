---
layout: home

hero:
  name: "Catálogo Luizalabs"
  text: "Central de Agentes e Skills de IA"
  tagline: "O catálogo oficial de capacidades para Google Gemini, Antigravity e GitHub Copilot."
  image:
    src: /logo.png
    alt: Catálogo Luizalabs
  actions:
    - theme: brand
      text: Acessar Agents
      link: "/agents/"
    - theme: alt
      text: Acessar Skills
      link: "/skills/"
---

<div style="margin-bottom: 2.5rem;">
  <h3 style="margin-top: 0; margin-bottom: 1.5rem; font-size: 1.3rem; color: var(--vp-c-brand); font-weight: 600;">Clone o repositório para começar</h3>
  <div style="display: flex; align-items: center; gap: 0.75rem; background: linear-gradient(135deg, rgba(100, 200, 254, 0.08) 0%, rgba(100, 150, 254, 0.04) 100%); padding: 1.5rem; border-radius: 12px; border: 2px solid var(--vp-c-brand); position: relative;">
    <code class="clone-command" style="background: transparent; padding: 0; font-size: 1rem; font-weight: 500; color: var(--vp-c-text-1); flex: 1; font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace; user-select: all;">git clone git@gitlab.luizalabs.com:luizalabs/padrao-labs-agents.git</code>
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

<div class="container info-section fade-in" style="margin-bottom: 3rem; border-left: 4px solid var(--vp-c-brand); padding-left: 1.5rem;">
  <div class="info-grid">
    <div class="info-content">
      <h2>O que é uma Skill?</h2>
      <p>
        Uma <strong>Skill</strong> é um pacote modular de instruções, scripts e recursos prontos para IA que estendem as capacidades dos seus assistentes de IA.
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
          <p class="text-sm text-muted">Uma única fonte da verdade para todas as ferramentas.</p>
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
          <p class="text-sm text-muted">Acionado por @menções ou padrões de arquivo.</p>
        </div>
      </div>
      <div class="visual-item">
        <div class="visual-icon">📏</div>
        <div>
          <strong>Padrões Globais</strong>
          <p class="text-sm text-muted">Armazenados em GEMINI.md para uso entre workspaces.</p>
        </div>
      </div>
    </div>
    <div class="info-content">
      <h2>O que são Regras?</h2>
      <p>
        <strong>Regras</strong> são restrições ou diretrizes definidas manualmente que fornecem contexto persistente e reutilizável para o agente de IA no <strong>nível do prompt</strong>.
      </p>
      <p>
        Enquanto Skills são conhecimentos "puxados" sob demanda, Regras ditam como o agente deve pensar e se comportar em todas as interações — impondo estilos de código específicos, padrões de arquitetura ou fundamentos de segurança.
      </p>
    </div>
  </div>
</div>

<div class="container info-section fade-in" style="margin-bottom: 3rem; border-left: 4px solid #4ECDC4; padding-left: 1.5rem;">
  <div class="info-grid">
    <div class="info-content">
      <h2>O que são Hooks?</h2>
      <p>
        <strong>Hooks</strong> são eventos de ciclo de vida síncronos que permitem interceptar, colocar ou aumentar o comportamento do agente durante seu loop de execução.
      </p>
      <p>
        Usando Hooks, você pode injetar scanners de segredos, impor políticas de segurança antes de uma ferramenta rodar, ou adicionar automaticamente contexto do repositório a cada requisição do modelo. Eles garantem que as ações da IA permaneçam seguras e em conformidade.
      </p>
    </div>
    <div class="info-visual">
      <div class="visual-item">
        <div class="visual-icon">⚓</div>
        <div>
          <strong>Eventos de Ciclo de Vida</strong>
          <p class="text-sm text-muted">Interceptam BeforeTool, AfterModel e mais.</p>
        </div>
      </div>
      <div class="visual-item">
        <div class="visual-icon">🔒</div>
        <div>
          <strong>Aplicação de Políticas</strong>
          <p class="text-sm text-muted">Bloqueiam ações perigosas programaticamente.</p>
        </div>
      </div>
      <div class="visual-item">
        <div class="visual-icon">🔄</div>
        <div>
          <strong>Interface JSON</strong>
          <p class="text-sm text-muted">Compatibilidade universal via stdin/stdout.</p>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="container info-section fade-in" style="margin-bottom: 3rem; border-left: 4px solid #95E1D3; padding-left: 1.5rem;">
  <div class="info-grid reverse">
    <div class="info-visual">
      <div class="visual-item">
        <div class="visual-icon">👤</div>
        <div>
          <strong>Persona Isolada</strong>
          <p class="text-sm text-muted">Prompts de sistema dedicados para cada agente.</p>
        </div>
      </div>
      <div class="visual-item">
        <div class="visual-icon">📦</div>
        <div>
          <strong>Eficiência de Tokens</strong>
          <p class="text-sm text-muted">Loops de contexto independentes economizam tokens principais.</p>
        </div>
      </div>
      <div class="visual-item">
        <div class="visual-icon">🤝</div>
        <div>
          <strong>Delegação de Tarefas</strong>
          <p class="text-sm text-muted">Contrate "especialistas" para sub-tarefas complexas.</p>
        </div>
      </div>
    </div>
    <div class="info-content">
      <h2>O que são Subagentes?</h2>
      <p>
        <strong>Subagentes</strong> são instâncias especializadas de IA que o agente principal pode "contratar" para realizar tarefas específicas e focadas com seu próprio conjunto de ferramentas e instruções.
      </p>
      <p>
        Ao delegar trabalho para um subagente, o agente principal pode lidar com problemas complexos de múltiplos estágios (como uma migração completa de código) sem sobrecarregar a janela de contexto da conversa principal.
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
          <p class="text-sm text-muted">Coordene múltiplas ferramentas e agentes.</p>
        </div>
      </div>
    </div>
    <div class="info-content">
      <h2>O que são Workflows?</h2>
      <p>
        <strong>Workflows</strong> são sequências automatizadas de tarefas que combinam múltiplas skills, regras e agentes para resolver problemas complexos de forma coordenada.
      </p>
      <p>
        Diferentemente de uma skill individual, um workflow orquestra uma série de passos interdependentes, como analisar código, executar testes, fazer deploy e monitorar resultados - tudo em uma sequência lógica e automatizada.
      </p>
    </div>
  </div>
</div>

<div class="container" style="margin-bottom: 4rem;">
  <h2 style="text-align: center; margin-bottom: 1rem; font-size: 1.8rem;">Estrutura Hierárquica</h2>
  <p style="text-align: center; color: var(--vp-c-text-2); margin-bottom: 2rem;">Como Workflows, Agents, Skills, Rules e Hooks se relacionam</p>
  <div style="background: var(--vp-c-bg-soft); padding: 2.5rem; border-radius: 12px; border: 1px solid var(--vp-c-divider);">

```mermaid
flowchart LR
  %% Nodes with icons and emojis
  Workflow["⚙️<br/>Workflow"]
  Agent["👤<br/>Agent"]
  Skill["🛠️<br/>Skill"]
  Rule["📏<br/>Rule"]
  Hook["⚓<br/>Hook"]

  %% Edges with descriptive labels
  Workflow -->|Orquestra<br/>tarefas| Agent
  Agent -->|Usa &<br/>ativa| Skill
  Agent -->|Segue<br/>diretrizes| Rule
  Skill -->|Interceptado por<br/>eventos| Hook

  %% Enhanced styling with better contrast and padding
  classDef workflow fill:#FFD700,stroke:#B8860B,stroke-width:3px,color:#000,font-size:14px,font-weight:bold,padding:15px;
  classDef agent fill:#87CEEB,stroke:#4169E1,stroke-width:3px,color:#000,font-size:14px,font-weight:bold,padding:15px;
  classDef skill fill:#90EE90,stroke:#228B22,stroke-width:3px,color:#000,font-size:14px,font-weight:bold,padding:15px;
  classDef rule fill:#FFB6C1,stroke:#C71585,stroke-width:3px,color:#000,font-size:14px,font-weight:bold,padding:15px;
  classDef hook fill:#FFB347,stroke:#FF6347,stroke-width:3px,color:#000,font-size:14px,font-weight:bold,padding:15px;

  class Workflow workflow
  class Agent agent
  class Skill skill
  class Rule rule
  class Hook hook

  %% Enhanced link styles
  linkStyle 0 stroke:#4169E1,stroke-width:2.5px;
  linkStyle 1 stroke:#228B22,stroke-width:2.5px;
  linkStyle 2 stroke:#C71585,stroke-width:2.5px;
  linkStyle 3 stroke:#FF6347,stroke-width:2.5px,stroke-dasharray:6;
```

  </div>
</div>
