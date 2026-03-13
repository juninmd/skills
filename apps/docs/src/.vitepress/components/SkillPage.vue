<template>
  <div class="skill-page-wrapper">
    <div v-if="loading" class="loading">Loading skill details...</div>

    <template v-else-if="skill">
      <!-- Content Header (metadados visuais) para todos os tipos -->
      <AgentHeader v-if="hasMetadata" />

      <!-- Alerts Container -->
      <div class="alerts-container">
        <!-- VSCode Link for Agents -->
        <div v-if="category === 'agents'" class="vscode-section">
          <div class="vscode-card">
            <div class="vscode-header">
              <svg class="vscode-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0-.001 1.479l1.65 1.531a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 15.078V3.498a1.5 1.5 0 0 0-.85-1.91zM9.576 7.664l-4.12 3.128 2.702 2.51 4.12-3.128-2.702-2.51zm2.846 2.887l9.46-8.63-.634-.622-9.46 8.63.634.622zm-.001 4.57l-.634.622 9.46 8.63.634-.62-9.46-8.63z"/>
              </svg>
              <h3>Executar no VS Code</h3>
            </div>
            <p class="vscode-description">
              Abra este agente no GitHub Copilot Chat do VS Code. O conteúdo markdown será copiado automaticamente para sua área de transferência.
            </p>
            <a :href="vscodeLink" class="vscode-button" @click="handleVSCodeClick">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              </svg>
              Executar Agente
            </a>
          </div>
        </div>

        <!-- Installation Alert for Skills, Rules, Hooks, Workflows -->
        <InstallationAlert 
          v-else
          :category="category" 
          :itemId="skillId"
        />
      </div>

      <!-- Conteúdo Markdown Renderizado pelo VitePress -->
      <div class="skill-content-area" :data-skill="skillId">
        <slot></slot>
      </div>
    </template>

    <div v-else class="error">
      Failed to load skill metadata.
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useData } from 'vitepress';
import AgentHeader from './AgentHeader.vue';
import InstallationAlert from './InstallationAlert.vue';

const props = defineProps({
  skillId: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: ''
  },
  sourcePath: {
    type: String,
    default: ''
  },
  genPath: {
    type: String,
    default: ''
  }
});

const { frontmatter } = useData();

// Prefer explicit props, otherwise fall back to frontmatter values
const skillId = computed(() => props.skillId || frontmatter.value?.skillId || '');
const category = computed(() => props.category || frontmatter.value?.category || 'skills');
const sourcePath = computed(() => props.sourcePath || frontmatter.value?.sourcePath || '');
const genPath = computed(() => props.genPath || frontmatter.value?.genPath || '');

const hasMetadata = computed(() => {
  return !!(frontmatter.value?.metadata && frontmatter.value.metadata.works_on);
});

const skill = ref(null);
const loading = ref(true);
const markdownContent = ref('');

const installCmd = computed(() => skill.value?.installCmd || `uv install ${skillId.value}`);

const vscodeAgentName = computed(() => (skillId.value || '').replace(/_/g, '-'));

const vscodeLink = computed(() => {
  const baseUrl = `vscode://GitHub.Copilot-Chat/chat?agent=${vscodeAgentName.value}`;
  if (markdownContent.value) {
    const encodedContent = encodeURIComponent(markdownContent.value);
    return `${baseUrl}&prompt=${encodedContent}`;
  }
  return `${baseUrl}&prompt=`;
});

const handleVSCodeClick = async (event) => {
  event.preventDefault();

  // Tentar copiar para clipboard primeiro
  if (markdownContent.value) {
    try {
      await navigator.clipboard.writeText(markdownContent.value);
      console.log('Markdown copiado para clipboard:', markdownContent.value.substring(0, 100) + '...');
    } catch (err) {
      console.error('Falha ao copiar para clipboard:', err);
    }
  }

  // Abrir VSCode com o conteúdo no prompt
  console.log('Abrindo VSCode com link:', vscodeLink.value);
  window.open(vscodeLink.value, '_blank');
};

onMounted(async () => {
  try {
    const res = await fetch('/catalog.json');
    const catalog = await res.json();
    const skills = catalog[category.value] || [];
    skill.value = skills.find(s => s.id === skillId.value);

    // Buscar o conteúdo markdown do arquivo fonte
    if (skill.value?.sourceFile) {
      try {
        const contentRes = await fetch(skill.value.sourceFile);
        if (contentRes.ok) {
          markdownContent.value = await contentRes.text();
          console.log('Markdown carregado, tamanho:', markdownContent.value.length);
          console.log('Primeiras 200 chars:', markdownContent.value.substring(0, 200));
        } else {
          console.warn('Falha ao buscar markdown, status:', contentRes.status);
        }
      } catch (e) {
        console.warn('Erro ao carregar markdown:', e);
      }
    } else {
      console.warn('sourceFile não encontrado:', skill.value);
    }
  } catch (e) {
    console.error('Failed to load catalog', e);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.skill-page-wrapper::after {
  content: "";
  display: table;
  clear: both;
}

.loading, .error {
  padding: 1.5rem;
  text-align: center;
  color: var(--vp-c-text-3);
  font-size: 0.85rem;
}

.skill-content-area {
  margin-top: 0.75rem;
}

/* Alerts Container */
.alerts-container {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.9rem;
}

/* VSCode Section Styles */
.vscode-section {
  margin-bottom: 0;
}

.vscode-card {
  background: linear-gradient(135deg, var(--vp-c-bg-soft) 0%, var(--vp-c-bg) 100%);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
}

.vscode-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
}

.vscode-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.vscode-icon {
  width: 24px;
  height: 24px;
  color: #007acc;
  flex-shrink: 0;
}

.vscode-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.vscode-description {
  margin: 0 0 0.4rem 0;
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
  line-height: 1.4;
}

.vscode-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #007acc 0%, #0056b3 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.85rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 122, 204, 0.2);
}

.vscode-button:hover {
  background: linear-gradient(135deg, #0056b3 0%, #004085 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 122, 204, 0.3);
}

.vscode-button:active {
  transform: translateY(0);
}

.vscode-button svg {
  width: 16px;
  height: 16px;
  transition: transform 0.2s ease;
}

.vscode-button:hover svg {
  transform: translateX(2px);
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  .vscode-card {
    background: linear-gradient(135deg, var(--vp-c-bg-soft) 0%, var(--vp-c-bg) 100%);
  }

  .vscode-button {
    background: linear-gradient(135deg, #0098ff 0%, #007acc 100%);
  }

  .vscode-button:hover {
    background: linear-gradient(135deg, #007acc 0%, #0056b3 100%);
  }
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .vscode-card {
    padding: 1.25rem;
  }

  .vscode-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .vscode-button {
    width: 100%;
    justify-content: center;
  }
}
</style>
