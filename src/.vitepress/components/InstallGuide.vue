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
          <div class="code-block">
            <pre><code>{{ platform.command }}</code></pre>
          </div>
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
    id: 'gemini',
    name: 'Gemini CLI',
    icon: '✨',
    command: 'npm install -g @google/gemini-cli'
  },
  {
    id: 'antigravity',
    name: 'Google Antigravity',
    icon: '🛸',
    command: 'curl -L https://raw.githubusercontent.com/luizalabs/padrao-labs-agents/main/agents.md -o AGENTS.md'
  },
  {
    id: 'copilot',
    name: 'VS Code Copilot',
    icon: '👩‍💻',
    command: 'mkdir -p .github && curl -L https://raw.githubusercontent.com/luizalabs/padrao-labs-agents/main/agents.md -o .github/copilot-instructions.md'
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
  padding: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
  animation: fadeIn 0.3s ease-in-out;
}

.code-block {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 1.25rem;
  position: relative;
  overflow-x: auto;
}

.code-block pre {
  margin: 0;
  padding: 0;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
