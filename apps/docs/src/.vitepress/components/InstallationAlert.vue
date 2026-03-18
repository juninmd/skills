<template>
  <div class="installation-alert">
    <!-- Alert Banner -->
    <div class="alert-banner" :class="{ 'alert-banner--has-extra-info': showExtraInfo }">
      <div class="alert-content">
        <div class="alert-text">
          <div class="alert-title">
            <span class="alert-icon">{{ categoryIcons[category] || '🚀' }}</span>
            Executar no VS Code
          </div>
          <p class="alert-description">
            {{ alertDescription }}
          </p>
        </div>
        <button class="execute-btn" @click="executeInVsCode" :disabled="isExecuting" :title="`Abrir ${categoryLabel} no VS Code Copilot`">
          <span v-if="!isExecuting">▶</span>
          <span v-else>✓</span>
          <span>{{ isExecuting ? 'Abrindo...' : 'Executar' }}</span>
        </button>
      </div>
    </div>

    <!-- Installation Section -->
    <div class="installation-section">
      <div class="section-header">
        <h3 class="installation-title">
          <span class="section-icon">📥</span>
          Comando para instalação
        </h3>
      </div>
      
      <div class="command-container">
        <code class="install-command" :ref="el => commandRef = el">{{ installCommand }}</code>
        <button 
          class="copy-btn" 
          @click="copyCommand" 
          :class="{ copied: isCopied }"
          :title="`Copiar comando para ${isCopied ? 'transferência' : 'área de transferência'}`"
        >
          <span class="copy-icon">{{ isCopied ? '✅' : '📋' }}</span>
          <span class="copy-text">{{ isCopied ? 'Copiado!' : 'Copiar' }}</span>
        </button>
      </div>

      <!-- Extra Info -->
      <div v-if="showExtraInfo" class="extra-info">
        <p>
          <strong>Requisito:</strong> Você precisa ter o <strong>Node.js</strong> (versão 18 ou superior) instalado.
          <a href="https://nodejs.org" target="_blank" rel="noopener">Baixe aqui</a>.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  category: {
    type: String,
    required: true
  },
  itemId: {
    type: String,
    default: ''
  },
  showExtraInfo: {
    type: Boolean,
    default: false
  }
});

const isCopied = ref(false);
const isExecuting = ref(false);
const commandRef = ref(null);

const categoryIcons = {
  skills: '⚙️',
  agents: '🤖',
  rules: '📋',
  workflows: '🔄'
};

const categoryLabels = {
  skills: 'Skill',
  agents: 'Agente',
  rules: 'Regra',
  workflows: 'Workflow'
};

const categoryLabel = computed(() => categoryLabels[props.category] || props.category);

const alertDescriptions = {
  skills: 'Abra esta skill no GitHub Copilot Chat do VS Code. O conteúdo será copiado automaticamente para sua área de transferência.',
  agents: 'Abra este agente no GitHub Copilot Chat do VS Code. O conteúdo será copiado automaticamente para sua área de transferência.',
  rules: 'Configure esta regra no VS Code para personalizar o comportamento do Copilot.',
  workflows: 'Execute este workflow para automatizar seu processo de desenvolvimento.'
};

const alertDescription = computed(() => {
  return alertDescriptions[props.category] || 'Abra no VS Code. O conteúdo será copiado automaticamente para sua área de transferência.';
});

const installCommand = computed(() => {
  const baseCmdCategory = props.category.slice(0, -1); // Remove 's' do final
  
  if (props.itemId) {
    return `padrao-labs-agents install --${baseCmdCategory} ${props.itemId}`;
  }
  
  return `padrao-labs-agents install`;
});

const executeInVsCode = async () => {
  isExecuting.value = true;
  
  try {
    // Copiar comando para clipboard como fallback
    await navigator.clipboard.writeText(installCommand.value);
    
    // Tentar abrir VS Code (funciona melhor em desktop)
    if (navigator.userAgent.includes('Windows') || 
        navigator.userAgent.includes('Macintosh') || 
        navigator.userAgent.includes('Linux')) {
      // Usar protocolo custom do VS Code se disponível
      const encodedCmd = encodeURIComponent(`Install ${categoryLabel.value}: ${props.itemId}`);
      window.location.href = `vscode://command/workbench.action.quickOpen?%5B%22${encodedCmd}%22%5D`;
    }
    
    setTimeout(() => {
      isExecuting.value = false;
    }, 800);
  } catch (err) {
    console.error('Erro ao executar:', err);
    isExecuting.value = false;
  }
};

const copyCommand = async () => {
  try {
    const cmd = commandRef.value?.textContent || installCommand.value;
    await navigator.clipboard.writeText(cmd);
    
    isCopied.value = true;
    
    // Adicionar feedback visual
    const btn = event?.target;
    if (btn) {
      btn.style.transform = 'scale(1.05)';
      setTimeout(() => {
        btn.style.transform = 'scale(1)';
      }, 100);
    }
    
    setTimeout(() => {
      isCopied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Erro ao copiar:', err);
  }
};
</script>

<style scoped>
:root {
  --alert-primary: rgb(59, 130, 246);
  --alert-primary-rgb: 59, 130, 246;
  --alert-secondary: rgb(139, 92, 246);
  --alert-success: rgb(16, 185, 129);
}

.installation-alert {
  margin-bottom: 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  animation: fadeInUp 0.5s ease-out;
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

/* Alert Banner */
.alert-banner {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%);
  border: 2px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  padding: 0.75rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.alert-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--vp-c-brand, #3b82f6) 0%, var(--vp-c-brand-light, #60a5fa) 100%);
}

.alert-banner:hover {
  border-color: rgba(59, 130, 246, 0.4);
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%);
}

.alert-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
}

.alert-text {
  flex: 1;
  min-width: 260px;
}

.alert-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  letter-spacing: -0.01em;
}

.alert-icon {
  font-size: 1.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 8px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.alert-description {
  margin: 0;
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  line-height: 1.4;
}

.execute-btn {
  background: linear-gradient(135deg, var(--vp-c-brand) 0%, #7c3aed 100%);
  color: white;
  border: none;
  padding: 0.4rem 0.85rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.75rem;
  white-space: nowrap;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.25);
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-shrink: 0;
}

.execute-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
  gap: 0.75rem;
}

.execute-btn:active:not(:disabled) {
  transform: translateY(-1px);
}

.execute-btn:disabled {
  opacity: 0.8;
  cursor: not-allowed;
}

/* Installation Section */
.installation-section {
  background: linear-gradient(135deg, rgba(100, 200, 254, 0.06) 0%, rgba(100, 150, 254, 0.02) 100%);
  padding: 0.5rem 0.65rem;
  border-radius: 10px;
  border: 1px solid rgba(59, 130, 246, 0.1);
  transition: all 0.3s ease;
}

.installation-section:hover {
  border-color: rgba(59, 130, 246, 0.2);
  background: linear-gradient(135deg, rgba(100, 200, 254, 0.08) 0%, rgba(100, 150, 254, 0.04) 100%);
}

.section-header {
  margin-bottom: 0.25rem;
}

.installation-title {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.section-icon {
  font-size: 0.9rem;
  display: inline-block;
}

kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem 0.4rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.75em;
  font-weight: 500;
  color: var(--vp-c-text-1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.command-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%);
  padding: 0.4rem 0.75rem;
  border-radius: 10px;
  border: 2px solid var(--vp-c-brand);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.command-container:hover {
  border-color: var(--vp-c-brand-light);
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.15);
}

.command-container::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, var(--vp-c-brand) 0%, rgba(59, 130, 246, 0.5) 100%);
}

.install-command {
  background: transparent;
  padding: 0;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
  flex: 1;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Courier New', monospace;
  user-select: all;
  word-break: break-all;
  border: none;
  margin-left: 0.5rem;
  letter-spacing: 0.02em;
}

.copy-btn {
  background: var(--vp-c-brand);
  color: white;
  border: none;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.7rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
}

.copy-btn:hover {
  background: var(--vp-c-brand-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
}

.copy-btn:active {
  transform: translateY(0);
}

.copy-btn.copied {
  background: var(--alert-success);
}

.copy-icon {
  font-size: 0.85rem;
  display: inline-block;
  transition: all 0.2s ease;
}

.copy-text {
  display: none;
}

/* Extra Info */
.extra-info {
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(59, 130, 246, 0.05);
  border-radius: 8px;
  border-left: 3px solid var(--vp-c-brand);
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.extra-info p {
  margin: 0;
  line-height: 1.6;
}

.extra-info a {
  color: var(--vp-c-brand);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
}

.extra-info a:hover {
  text-decoration: underline;
  opacity: 0.8;
}

/* Responsive */
@media (max-width: 768px) {
  .alert-content {
    flex-direction: column;
    align-items: stretch;
  }

  .alert-banner {
    padding: 1.25rem;
  }

  .alert-title {
    font-size: 1rem;
  }

  .execute-btn {
    width: 100%;
    justify-content: center;
    padding: 0.875rem 1.5rem;
  }

  .installation-section {
    padding: 1.5rem;
  }

  .installation-title {
    font-size: 1rem;
  }

  .install-subtitle {
    font-size: 0.9rem;
  }

  .command-container {
    flex-direction: column;
    align-items: stretch;
    padding: 1rem;
  }

  .install-command {
    margin-left: 0;
    font-size: 0.85rem;
  }

  .copy-btn {
    width: 100%;
    justify-content: center;
    padding: 0.75rem 1rem;
    margin-top: 0.5rem;
  }
}

@media (max-width: 480px) {
  .alert-banner {
    padding: 1rem;
  }

  .alert-title {
    font-size: 0.95rem;
  }

  .alert-icon {
    width: 28px;
    height: 28px;
    font-size: 1.25rem;
  }

  .execute-btn {
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
  }

  .installation-section {
    padding: 1.25rem;
  }

  .command-container {
    border-radius: 8px;
    padding: 0.75rem;
  }

  .install-command {
    font-size: 0.8rem;
  }

  .copy-btn {
    padding: 0.65rem 0.85rem;
    font-size: 0.8rem;
  }

  .copy-text {
    display: none;
  }

  .copy-icon {
    font-size: 1rem;
  }
}
</style>

