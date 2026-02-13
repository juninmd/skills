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
        <button class="copy-btn" @click="copyCommand" :title="copied ? 'Copiado!' : 'Copiar'">
          {{ copied ? '✓' : 'Copiar' }}
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
  margin: 1.5rem 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
}

.tabs-header {
  display: flex;
  background: var(--vp-c-bg-mute);
  border-bottom: 1px solid var(--vp-c-divider);
  overflow-x: auto;
}

.tab-btn {
  padding: 0.6rem 1.2rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-right: 1px solid var(--vp-c-divider);
  white-space: nowrap;
}

.tab-btn:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
}

.tab-btn.active {
  color: var(--vp-c-brand);
  background: var(--vp-c-bg-soft);
  box-shadow: inset 0 -2px 0 var(--vp-c-brand);
}

.tabs-content {
  padding: 1rem;
}

.code-container {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background: var(--vp-c-bg);
  padding: 0.75rem 1rem;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
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
  font-size: 0.85rem;
  line-height: 1.5;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
}

.code-text code {
  background: transparent;
  padding: 0;
  color: var(--vp-c-text-1);
}

.copy-btn {
  background: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.4rem 0.8rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  flex-shrink: 0;
  margin-top: 2px;
}

.copy-btn:hover {
  opacity: 0.9;
}
</style>
