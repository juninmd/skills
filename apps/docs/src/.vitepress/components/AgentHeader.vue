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
  position: relative;
  background: linear-gradient(
    135deg,
    rgba(var(--vp-c-brand-rgb), 0.08) 0%,
    rgba(var(--vp-c-brand-rgb), 0.03) 50%,
    transparent 100%
  );
  border: 2px solid var(--vp-c-divider);
  border-radius: 16px;
  padding: 1.2rem;
  margin-bottom: 1.2rem;
  box-shadow:
    0 2px 12px rgba(0, 0, 0, 0.03),
    0 0 0 1px rgba(var(--vp-c-brand-rgb), 0.05);
  overflow: hidden;
  animation: slideInDown 0.6s ease-out;
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.content-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: radial-gradient(
    circle at top right,
    rgba(var(--vp-c-brand-rgb), 0.1) 0%,
    transparent 70%
  );
  pointer-events: none;
}

.header-content {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 1;
  align-items: flex-start;
}

.title-section {
  flex: 1;
}

.content-title {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(
    120deg,
    var(--vp-c-brand) 0%,
    var(--vp-c-brand-light) 50%,
    var(--vp-c-brand) 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
  letter-spacing: -0.03em;
  animation: shimmer 3s linear infinite;
}

@keyframes shimmer {
  0% {
    background-position: 0% center;
  }
  100% {
    background-position: 200% center;
  }
}

.content-description {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  max-width: 90%;
}

.platforms-section {
  position: relative;
  padding-top: 0.8rem;
  flex-basis: 100%;
}

.platforms-section::before {
  display: none;
}

.platforms-label {
  margin: 0 0 0.4rem 0;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--vp-c-text-3);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.platforms-label::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 16px;
  background: linear-gradient(
    180deg,
    var(--vp-c-brand) 0%,
    var(--vp-c-brand-light) 100%
  );
  border-radius: 2px;
}

.platform-badges {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.platform-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 1rem;
  background: rgba(var(--vp-c-bg-rgb), 0.9);
  border: 2px solid var(--vp-c-divider);
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: default;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
}

.platform-badge::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.2) 50%,
    transparent 100%
  );
  transition: left 0.5s;
}

.platform-badge:hover::before {
  left: 100%;
}

.platform-badge:hover {
  border-color: var(--badge-color, var(--vp-c-brand));
  box-shadow:
    0 4px 16px rgba(var(--vp-c-brand-rgb), 0.2),
    0 0 0 4px rgba(var(--vp-c-brand-rgb), 0.05);
  transform: translateY(-3px);
}

.platform-copilot {
  --badge-color: #2ea44f;
}

.platform-antigravity {
  --badge-color: #4285f4;
}

.platform-gemini_cli {
  --badge-color: #8e44ad;
}

.platform-cursor {
  --badge-color: #f59e0b;
}

.platform-windsurf {
  --badge-color: #06b6d4;
}

.badge-icon {
  font-size: 1.3rem;
  line-height: 1;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.platform-badge:hover .badge-icon {
  animation: bounce 0.6s ease-in-out;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.badge-text {
  color: var(--vp-c-text-1);
  letter-spacing: 0.01em;
}

@media (max-width: 768px) {
  .content-header {
    padding: 1.25rem 1rem;
    margin-bottom: 1.5rem;
    border-radius: 16px;
  }

  .header-content {
    flex-direction: column;
    gap: 1rem;
  }

  .content-title {
    font-size: 1.5rem;
  }

  .content-description {
    font-size: 0.9rem;
    max-width: 100%;
  }

  .platforms-section {
    width: 100%;
  }

  .platform-badges {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .platform-badge {
    padding: 0.5rem 0.9rem;
    font-size: 0.8rem;
  }

  .badge-icon {
    font-size: 1rem;
  }
}
</style>
