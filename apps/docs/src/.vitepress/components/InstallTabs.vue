<template>
  <div class="install-tabs">
    <div class="tabs-header">
      <button
        v-for="platform in availablePlatforms"
        :key="platform.id"
        @click="activeTab = platform.id"
        :class="['tab-btn', { active: activeTab === platform.id }]"
      >
        <span class="icon">{{ platform.icon }}</span> {{ platform.name }}
      </button>
    </div>
    <div class="tabs-content">
      <div class="code-container">
        <div class="code-wrapper">
          <slot v-if="activeTab === 'gemini'" name="gemini">
            <pre class="code-text"><code>{{ props.gemini }}</code></pre>
          </slot>
          <slot v-else-if="activeTab === 'copilot'" name="copilot">
            <pre class="code-text"><code>{{ props.copilot }}</code></pre>
          </slot>
          <slot v-else-if="activeTab === 'antigravity'" name="antigravity">
            <pre class="code-text"><code>{{ props.antigravity }}</code></pre>
          </slot>
        </div>
        <button class="copy-btn" :class="{ copied }" @click="copyCommand" :title="copied ? 'Copiado!' : 'Copiar'">
          {{ copied ? '✓ Copiado' : '📋 Copiar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, useSlots } from 'vue';

const props = defineProps({
  gemini: { type: String, default: '' },
  copilot: { type: String, default: '' },
  antigravity: { type: String, default: '' }
});

const slots = useSlots();
const activeTab = ref('gemini');
const copied = ref(false);

const platforms = [
  { id: 'gemini', name: 'Gemini CLI', icon: '✨' },
  { id: 'copilot', name: 'GitHub Copilot', icon: '🤖' },
  { id: 'antigravity', name: 'Google Antigravity', icon: '⚙️' }
];

const availablePlatforms = computed(() => {
  return platforms.filter(p => !!props[p.id] || !!slots[p.id]);
});

const currentCommand = computed(() => {
  // Try to extract text from slot or fallback to prop
  if (slots[activeTab.value]) {
    const slotContent = slots[activeTab.value]();
    // Extract text from VNode
    return extractTextFromVNode(slotContent);
  }
  return props[activeTab.value] || 'Nenhum comando disponível';
});

function extractTextFromVNode(vnodes) {
  if (!vnodes) return '';
  return vnodes.map(vnode => {
    if (typeof vnode.children === 'string') return vnode.children;
    if (Array.isArray(vnode.children)) return extractTextFromVNode(vnode.children);
    return vnode.children?.default?.() || '';
  }).join('\n').trim();
}

function copyCommand() {
  navigator.clipboard.writeText(currentCommand.value);
  copied.value = true;
  setTimeout(() => { copied.value = false; }, 2000);
}
</script>

<style scoped>
.install-tabs {
  margin: 1.2rem 0;
  border: 2px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    rgba(var(--vp-c-bg-rgb), 0.95) 0%,
    rgba(var(--vp-c-bg-rgb), 1) 100%
  );
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tabs-header {
  display: flex;
  background: linear-gradient(
    180deg,
    var(--vp-c-bg-muted) 0%,
    var(--vp-c-bg-soft) 100%
  );
  border-bottom: 2px solid var(--vp-c-divider);
  overflow-x: auto;
  scrollbar-width: thin;
  position: relative;
}

.tabs-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(
    90deg,
    var(--vp-c-brand) 0%,
    var(--vp-c-brand-light) 100%
  );
  width: var(--tab-width, 33.33%);
  transform: translateX(var(--tab-offset, 0));
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.tab-btn {
  flex: 1;
  padding: 0.8rem 1rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
}

.tab-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(var(--vp-c-brand-rgb), 0.05) 100%
  );
  opacity: 0;
  transition: opacity 0.3s;
}

.tab-btn:hover::before {
  opacity: 1;
}

.tab-btn:hover {
  color: var(--vp-c-text-1);
  background: rgba(var(--vp-c-bg-rgb), 0.5);
}

.tab-btn.active {
  color: var(--vp-c-brand);
  background: rgba(var(--vp-c-brand-rgb), 0.08);
  position: relative;
}

.tab-btn.active .icon {
  animation: bounceIcon 0.6s ease-out;
}

@keyframes bounceIcon {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.icon {
  font-size: 1rem;
  line-height: 1;
  filter: grayscale(0.3);
  transition: all 0.3s;
}

.tab-btn:hover .icon,
.tab-btn.active .icon {
  filter: grayscale(0);
}

.tabs-content {
  padding: 1rem;
  animation: fadeIn 0.4s ease-out;
}
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.code-container {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  background: var(--vp-c-bg);
  padding: 0.95rem 1rem;
  border-radius: 10px;
  border: 2px solid var(--vp-c-divider);
  position: relative;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.02);
}

.code-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(
    90deg,
    var(--vp-c-brand) 0%,
    var(--vp-c-brand-light) 100%
  );
}

.code-wrapper {
  flex: 1;
  overflow-x: auto;
}

.code-wrapper pre {
  margin: 0;
  padding: 0;
}

.code-text {
  flex: 1;
  margin: 0;
  padding: 0;
  font-family: var(--vp-font-family-mono);
  font-size: 0.8rem;
  line-height: 1.5;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
}

.code-text code {
  background: transparent;
  padding: 0;
  color: var(--vp-c-text-1);
  font-weight: 500;
}

.copy-btn {
  background: linear-gradient(
    135deg,
    var(--vp-c-brand) 0%,
    var(--vp-c-brand-light) 100%
  );
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 0.95rem;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  margin-top: 1px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(var(--vp-c-brand-rgb), 0.2);
}

.copy-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 100%
  );
  transform: translateX(-100%);
  transition: transform 0.6s;
}

.copy-btn:hover::before {
  transform: translateX(100%);
}

.copy-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(var(--vp-c-brand-rgb), 0.4);
}

.copy-btn:active {
  transform: translateY(0);
}

.copy-btn.copied {
  background: linear-gradient(
    135deg,
    var(--vp-c-success) 0%,
    #059669 100%
  );
  animation: successPulse 0.4s ease-out;
}

@keyframes successPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .tabs-header {
    overflow-x: auto;
  }

  .tab-btn {
    padding: 0.875rem 1.25rem;
    font-size: 0.875rem;
  }

  .tabs-content {
    padding: 1.25rem;
  }

  .code-container {
    flex-direction: column;
    padding: 1rem;
  }

  .copy-btn {
    width: 100%;
  }
}
</style>
