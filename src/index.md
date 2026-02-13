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

<div class="container" style="margin-bottom: 2rem;">
  <div style="background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); border-radius: 12px; padding: 1.5rem; text-align: center;">
    <h3 style="margin-top: 0; margin-bottom: 1rem; font-size: 1.1rem; color: var(--vp-c-brand);">Clone o repositório para começar</h3>
    <code style="background: var(--vp-c-bg); padding: 0.75rem 1.5rem; border-radius: 8px; font-size: 1rem; border: 1px solid var(--vp-c-divider); display: inline-block; word-break: break-all;">
      git clone git@gitlab.luizalabs.com:luizalabs/padrao-labs-agents.git
    </code>
  </div>
</div>

<div id="explore-section" class="container">
  <CategoryCards />
</div>

<div class="container info-section fade-in">
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

<div class="container info-section fade-in">
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

<div class="container info-section fade-in">
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

<div class="container info-section fade-in">
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

<div class="container info-section fade-in">
  <div class="info-grid reverse">
    <div class="info-visual">
      <div class="visual-item">
        <div class="visual-icon">👤</div>
        <div>
          <strong>Fluxos de Trabalho</strong>
          <p class="text-sm text-muted">Automatize sequências complexas de tarefas.</p>
        </div>
      </div>
      <div class="visual-item">
        <div class="visual-icon">⚙️</div>
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

<div class="container">
  <InstallGuide />
</div>
