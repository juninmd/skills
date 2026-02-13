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
      text: Navegar no Catálogo
      link: "#explore-section"
    - theme: alt
      text: Instalação Rápida
      link: "#quick-install"
---

<style scoped>
.clone-hero {
  background: linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(124, 58, 255, 0.05) 100%);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(79, 172, 254, 0.2);
  border-radius: 16px;
  padding: 3rem 2rem;
  margin-bottom: 4rem;
  position: relative;
  overflow: hidden;
}

.clone-hero::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(79, 172, 254, 0.1) 0%, transparent 70%);
  pointer-events: none;
}

.clone-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--vp-c-brand);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  z-index: 1;
}

.clone-command {
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.1) 100%);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-size: 0.95rem;
  border-left: 3px solid var(--vp-c-brand);
  font-family: 'Courier New', monospace;
  color: var(--vp-c-text-1);
  word-break: break-all;
  overflow-x: auto;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
}

.clone-command:hover {
  border-left-color: var(--vp-c-brand);
  background: linear-gradient(90deg, rgba(79, 172, 254, 0.1) 0%, rgba(79, 172, 254, 0.05) 100%);
}

.quick-links-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

.quick-link-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 2rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.quick-link-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--vp-c-brand), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.quick-link-card:hover {
  border-color: var(--vp-c-brand);
  background: linear-gradient(135deg, rgba(79, 172, 254, 0.05) 0%, transparent 100%);
  transform: translateY(-2px);
}

.quick-link-card:hover::before {
  opacity: 1;
}

.quick-link-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-brand);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quick-link-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.quick-link-item {
  margin-bottom: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.quick-link-item:last-child {
  margin-bottom: 0;
}

.quick-link-item:hover {
  background: rgba(79, 172, 254, 0.08);
  padding-left: 1rem;
}

.quick-link-item a {
  color: var(--vp-c-brand);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
}

.quick-link-item a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .quick-links-grid {
    grid-template-columns: 1fr;
  }

  .clone-hero {
    padding: 2rem;
  }
}
</style>

<div class="clone-hero">
  <h3 class="clone-title">🚀 Clone o repositório para começar</h3>
  <code class="clone-command">git clone git@gitlab.luizalabs.com:luizalabs/padrao-labs-agents.git</code>
</div>

<div class="quick-links-grid">
  <div class="quick-link-card">
    <h4 class="quick-link-title">📚 Documentação</h4>
    <ul class="quick-link-list">
      <li class="quick-link-item"><a href="/docs/getting-started.html">→ Getting Started</a></li>
      <li class="quick-link-item"><a href="/docs/agentic-concepts.html">→ Conceitos Agentic</a></li>
      <li class="quick-link-item"><a href="/docs/agents/index.html">→ Catálogo de Agentes</a></li>
    </ul>
  </div>
  <div class="quick-link-card">
    <h4 class="quick-link-title">🛠️ Recursos</h4>
    <ul class="quick-link-list">
      <li class="quick-link-item"><a href="/docs/deploy.html">→ Deploy & CI/CD</a></li>
      <li class="quick-link-item"><a href="/docs/skills/index.html">→ Todas as Skills</a></li>
      <li class="quick-link-item"><a href="/docs/rules/index.html">→ Regras & Padrões</a></li>
    </ul>
  </div>
</div>

<div id="explore-section" class="container" style="margin-bottom: 4rem;">
  <h2 style="text-align: center; margin-bottom: 1rem; font-size: 2rem; font-weight: 700;">Explore o Catálogo</h2>
  <p style="text-align: center; color: var(--vp-c-text-2); margin-bottom: 3rem; font-size: 1.05rem;">Navegue por Agentes, Skills, Regras, Hooks e Workflows</p>
  <CategoryCards />
</div>

<style scoped>
.info-section-enhanced {
  margin-bottom: 4rem;
  animation: fadeInUp 0.6s ease;
}

.info-section-skill {
  border-left: 4px solid var(--vp-c-brand);
  background: linear-gradient(135deg, rgba(79, 172, 254, 0.03) 0%, transparent 100%);
}

.info-section-rule {
  border-left: 4px solid #FF6B6B;
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.03) 0%, transparent 100%);
}

.info-section-hook {
  border-left: 4px solid #4ECDC4;
  background: linear-gradient(135deg, rgba(78, 205, 196, 0.03) 0%, transparent 100%);
}

.info-section-subagent {
  border-left: 4px solid #95E1D3;
  background: linear-gradient(135deg, rgba(149, 225, 211, 0.03) 0%, transparent 100%);
}

.info-section-workflow {
  border-left: 4px solid #FFD93D;
  background: linear-gradient(135deg, rgba(255, 217, 61, 0.03) 0%, transparent 100%);
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

.info-grid.reverse {
  grid-template-columns: 1fr 1fr;
}

.info-grid.reverse > :first-child {
  order: 2;
}

.info-grid.reverse > :last-child {
  order: 1;
}

.info-content h2 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.info-content p {
  font-size: 1.05rem;
  line-height: 1.7;
  color: var(--vp-c-text-2);
  margin-bottom: 1rem;
}

.info-visual {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.visual-item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1.25rem;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  transition: all 0.3s ease;
}

.visual-item:hover {
  border-color: var(--vp-c-brand);
  background: linear-gradient(135deg, rgba(79, 172, 254, 0.05) 0%, transparent 100%);
  transform: translateX(4px);
}

.visual-icon {
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.visual-item strong {
  font-size: 1.1rem;
  color: var(--vp-c-text-1);
}

.text-sm {
  font-size: 0.95rem;
}

.text-muted {
  color: var(--vp-c-text-3);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .info-grid,
  .info-grid.reverse {
    grid-template-columns: 1fr;
  }

  .info-grid.reverse > :first-child,
  .info-grid.reverse > :last-child {
    order: inherit;
  }
}
</style>

<div class="info-section-enhanced info-section-skill">
  <div class="info-grid">
    <div class="info-content">
      <h2>🛠️ O que é uma Skill?</h2>
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

<div class="info-section-enhanced info-section-rule">
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
      <h2>📋 O que são Regras?</h2>
      <p>
        <strong>Regras</strong> são restrições ou diretrizes definidas manualmente que fornecem contexto persistente e reutilizável para o agente de IA no <strong>nível do prompt</strong>.
      </p>
      <p>
        Enquanto Skills são conhecimentos "puxados" sob demanda, Regras ditam como o agente deve pensar e se comportar em todas as interações — impondo estilos de código específicos, padrões de arquitetura ou fundamentos de segurança.
      </p>
    </div>
  </div>
</div>

<div class="info-section-enhanced info-section-hook">
  <div class="info-grid">
    <div class="info-content">
      <h2>⚓ O que são Hooks?</h2>
      <p>
        <strong>Hooks</strong> são eventos de ciclo de vida síncronos que permitem interceptar, colocar ou aumentar o comportamento do agente durante seu loop de execução.
      </p>
      <p>
        Usando Hooks, você pode injetar scanners de segredos, impor políticas de segurança antes de uma ferramenta rodar, ou adicionar automaticamente contexto do repositório a cada requisição do modelo. Eles garantem que as ações da IA permaneçam seguras e em conformidade.
      </p>
    </div>
    <div class="info-visual">
      <div class="visual-item">
        <div class="visual-icon">🔄</div>
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
        <div class="visual-icon">🔗</div>
        <div>
          <strong>Interface JSON</strong>
          <p class="text-sm text-muted">Compatibilidade universal via stdin/stdout.</p>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="info-section-enhanced info-section-subagent">
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
        <div class="visual-icon">💾</div>
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
      <h2>🤖 O que são Subagentes?</h2>
      <p>
        <strong>Subagentes</strong> são instâncias especializadas de IA que o agente principal pode "contratar" para realizar tarefas específicas e focadas com seu próprio conjunto de ferramentas e instruções.
      </p>
      <p>
        Ao delegar trabalho para um subagente, o agente principal pode lidar com problemas complexos de múltiplos estágios (como uma migração completa de código) sem sobrecarregar a janela de contexto da conversa principal.
      </p>
    </div>
  </div>
</div>

<div class="info-section-enhanced info-section-workflow">
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
      <h2>🔄 O que são Workflows?</h2>
      <p>
        <strong>Workflows</strong> são sequências automatizadas de tarefas que combinam múltiplas skills, regras e agentes para resolver problemas complexos de forma coordenada.
      </p>
      <p>
        Diferentemente de uma skill individual, um workflow orquestra uma série de passos interdependentes, como analisar código, executar testes, fazer deploy e monitorar resultados - tudo em uma sequência lógica e automatizada.
      </p>
    </div>
  </div>
</div>

<style scoped>
.hierarchy-section {
  margin-bottom: 6rem;
}

.hierarchy-title {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.5rem;
}

.hierarchy-subtitle {
  text-align: center;
  color: var(--vp-c-text-2);
  font-size: 1.05rem;
  margin-bottom: 3rem;
}

.diagram-container {
  background: linear-gradient(135deg, rgba(79, 172, 254, 0.05) 0%, rgba(124, 58, 255, 0.02) 100%);
  border: 1px solid rgba(79, 172, 254, 0.1);
  border-radius: 16px;
  padding: 3rem;
  backdrop-filter: blur(8px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: auto;
}

.diagram-container::-webkit-scrollbar {
  height: 6px;
}

.diagram-container::-webkit-scrollbar-track {
  background: transparent;
}

.diagram-container::-webkit-scrollbar-thumb {
  background: var(--vp-c-divider);
  border-radius: 3px;
}

.diagram-container::-webkit-scrollbar-thumb:hover {
  background: var(--vp-c-brand);
}
</style>

<div class="hierarchy-section">
  <h2 class="hierarchy-title">🏗️ Estrutura Hierárquica</h2>
  <p class="hierarchy-subtitle">Como Workflows, Agents, Skills, Rules e Hooks se relacionam em perfeita orquestração</p>

  <div class="diagram-container">

```mermaid
flowchart TD
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

<style scoped>
.install-guide-section {
  margin-top: 4rem;
  padding-top: 3rem;
  border-top: 1px solid var(--vp-c-divider);
}
</style>

<div class="install-guide-section">
  <InstallGuide />
</div>
