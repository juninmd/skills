<template>
  <div v-if="hasContent" class="content-header">
    <div class="header-content">
      <div class="title-section">
        <h1 class="content-title">{{ displayTitle }}</h1>
        <p class="content-description">{{ displayDescription }}</p>
      </div>

      <div v-if="worksOn && worksOn.length > 0" class="platforms-section">
        <h4 class="platforms-label">Suporte de Plataformas</h4>
        <div class="platform-badges">
          <span
            v-for="platform in worksOn"
            :key="platform"
            :class="['platform-badge', `platform-${platform}`]"
          >
            <span class="badge-icon">{{ getPlatformIcon(platform) }}</span>
            <span class="badge-text">{{ getPlatformName(platform) }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useData } from 'vitepress';

const { frontmatter } = useData();

const metadata = computed(() => {
  const fm = frontmatter.value;
  if (!fm?.metadata) return null;

  return {
    name: fm.metadata.name || fm.title || '',
    description: fm.metadata.description || fm.description || '',
    works_on: fm.metadata.works_on || []
  };
});

const hasContent = computed(() => {
  const fm = frontmatter.value;
  return !!( fm?.metadata && (fm.metadata.name || fm.metadata.description || fm.metadata.works_on));
});

const displayTitle = computed(() => metadata.value?.name || frontmatter.value?.title || '');
const displayDescription = computed(() => metadata.value?.description || frontmatter.value?.description || '');

const worksOn = computed(() => {
  const platforms = metadata.value?.works_on || [];
  return Array.isArray(platforms) ? platforms : [];
});

function getPlatformIcon(platform) {
  const icons = {
    'copilot': '🤖',
    'antigravity': '🚀',
    'gemini_cli': '✨',
    'cursor': '⚡',
    'windsurf': '🌊'
  };
  return icons[platform] || '💻';
}

function getPlatformName(platform) {
  const names = {
    'copilot': 'GitHub Copilot',
    'antigravity': 'Antigravity',
    'gemini_cli': 'Gemini CLI',
    'cursor': 'Cursor IDE',
    'windsurf': 'Windsurf'
  };
  return names[platform] || platform;
}
</script>

<style scoped>
.content-header {
  background: linear-gradient(
    135deg,
    rgba(var(--vp-c-brand-rgb), 0.05) 0%,
    rgba(var(--vp-c-brand-rgb), 0.02) 100%
  );
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.title-section {
  flex: 1;
}

.content-title {
  margin: 0 0 0.75rem 0;
  font-size: 2rem;
  font-weight: 700;
  color: var(--vp-c-brand);
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.content-description {
  margin: 0;
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.platforms-section {
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 1.5rem;
}

.platforms-label {
  margin: 0 0 1rem 0;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-3);
}

.platform-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.platform-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: default;
}

.platform-badge:hover {
  border-color: var(--vp-c-brand);
  box-shadow: 0 2px 8px rgba(var(--vp-c-brand-rgb), 0.15);
  transform: translateY(-1px);
}

.platform-vscode {
  --badge-color: #007acc;
}

.platform-antigravity {
  --badge-color: #4285f4;
}

.platform-gemini_cli {
  --badge-color: #8e44ad;
}

.platform-copilot {
  --badge-color: #2ea44f;
}

.platform-cursor {
  --badge-color: #f59e0b;
}

.platform-windsurf {
  --badge-color: #06b6d4;
}

.platform-badge:hover {
  border-color: var(--badge-color);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.badge-icon {
  font-size: 1.1rem;
  line-height: 1;
}

.badge-text {
  color: var(--vp-c-text-1);
}

@media (max-width: 768px) {
  .content-header {
    padding: 1.5rem;
  }

  .content-title {
    font-size: 1.5rem;
  }

  .content-description {
    font-size: 1rem;
  }

  .platform-badges {
    gap: 0.5rem;
  }

  .platform-badge {
    padding: 0.4rem 0.75rem;
    font-size: 0.85rem;
  }
}
</style>
