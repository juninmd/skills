<template>
  <div id="quick-install" class="install-container">
    <h2 class="section-title">Escolha sua Plataforma</h2>

    <div class="platform-tabs">
      <button
        v-for="platform in platforms"
        :key="platform.id"
        @click="activeTab = platform.id"
        :class="['tab-btn', { active: activeTab === platform.id }]"
      >
        <span class="icon">{{ platform.icon }}</span> {{ platform.name }}
      </button>
    </div>

    <div class="install-content">
      <div v-for="platform in platforms" :key="platform.id">
        <div v-if="activeTab === platform.id" class="install-panel">
          <h3>Configuração para {{ platform.name }}</h3>
          <p>{{ platform.description }}</p>

          <div v-for="(step, index) in platform.steps" :key="index" class="step">
            <span class="step-num">{{ index + 1 }}</span>
            <div class="step-content">
              <h4>{{ step.title }}</h4>
              <p v-if="step.desc" v-html="step.desc"></p>
              <div v-if="step.code" class="code-block">
                <pre><code>{{ step.code }}</code></pre>
              </div>
            </div>
          </div>

          <a :href="platform.link" class="learn-more">Ver Guia Completo →</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const activeTab = ref('gemini');

const platforms = [
  {
    id: 'antigravity',
    name: 'Google Antigravity',
    icon: '🛸',
    description: 'Empodere seu Assistente de IA com os Padrões da Luizalabs.',
    link: '/integration/antigravity',
    steps: [
      {
        title: 'Passo 1: Baixar o Padrão',
        desc: 'Coloque o arquivo de agentes unificado na raiz do seu projeto como <code>AGENTS.md</code>.',
        code: 'curl -L https://raw.githubusercontent.com/luizalabs/padrao-labs-agents/main/agents.md -o AGENTS.md'
      },
      {
        title: 'Passo 2: Detecção Automática',
        desc: 'O Antigravity irá indexar automaticamente seu <code>AGENTS.md</code> e usá-lo como contexto persistente.'
      }
    ]
  },
  {
    id: 'copilot',
    name: 'VS Code Copilot',
    icon: '👩‍💻',
    description: 'Inteligência consciente do contexto para sua IDE.',
    link: '/integration/copilot',
    steps: [
      {
        title: 'Passo 1: Criar Instruções',
        desc: 'Os padrões da Luizalabs devem ir para a pasta especial <code>.github</code>.',
        code: `mkdir -p .github
curl -L https://raw.githubusercontent.com/luizalabs/padrao-labs-agents/main/agents.md -o .github/copilot-instructions.md`
      },
      {
        title: 'Passo 2: Começar a Codar',
        desc: 'O Copilot agora respeitará todas as regras e skills definidas no arquivo.'
      }
    ]
  },
  {
    id: 'gemini',
    name: 'Gemini CLI',
    icon: '✨',
    description: 'Automação avançada via linha de comando.',
    link: '/integration/gemini',
    steps: [
      {
        title: 'Passo 1: Instalar Expertise do Catálogo',
        desc: 'Você pode instalar skills específicas diretamente no seu ambiente Gemini usando a URL do repositório.',
        code: 'gemini skills install git@gitlab.luizalabs.com:luizalabs/padrao-labs-agents.git --path .agents/skills/git-skill'
      },
      {
        title: 'Passo 2: Instalar Versão Local (Dev)',
        desc: 'Para contribuir ou usar uma versão local do catálogo, aponte para o diretório local. Use <code>--scope workspace</code> para limitar ao projeto atual.',
        code: 'gemini skills install /path/to/padrao-labs-agents --scope workspace'
      },
      {
        title: 'Passo 3: Verificar Instalação',
        desc: 'Liste todas as skills descobertas para verificar se foram instaladas corretamente.',
        code: 'gemini skills list'
      }
    ]
  }
];
</script>

<style scoped>
.install-container {
  margin-top: 4rem;
}

.section-title {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 700;
  border: none;
}

.platform-tabs {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--vp-c-text-1);
}

.tab-btn:hover {
  border-color: var(--vp-c-brand);
  transform: translateY(-2px);
}

.tab-btn.active {
  background: var(--vp-c-brand);
  color: white;
  border-color: var(--vp-c-brand);
}

.install-panel {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  animation: fadeIn 0.3s ease-in-out;
}

.install-panel h3 {
  margin-top: 0;
  color: var(--vp-c-brand);
}

.step {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: flex-start;
}

.step-num {
  background: var(--vp-c-brand);
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
  margin-top: 4px;
}

.step-content {
  flex: 1;
}

.step-content h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.code-block {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 1rem;
  position: relative;
  overflow-x: auto;
  margin-top: 0.5rem;
}

.code-block pre {
  margin: 0;
  padding: 0;
}

.learn-more {
  display: inline-block;
  margin-top: 1rem;
  font-weight: 600;
  color: var(--vp-c-brand);
  text-decoration: none;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
