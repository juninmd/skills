<template>
  <div id="quick-install" class="install-container">
    <h2 class="section-title">Compatível com</h2>

    <div class="platform-badges">
      <div v-for="platform in platforms" :key="platform.id" class="badge">
        <span class="icon">{{ platform.icon }}</span>
        <span class="name">{{ platform.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const platforms = [
  {
    id: 'gemini',
    name: 'Gemini CLI',
    icon: '✨'
  },
  {
    id: 'antigravity',
    name: 'Google Antigravity',
    icon: '🛸'
  },
  {
    id: 'copilot',
    name: 'VS Code Copilot',
    icon: '👩‍💻'
  }
];
</script>

<style scoped>
.install-container {
  margin-top: 4rem;
  text-align: center;
  padding: 2rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
}

.section-title {
  margin-bottom: 2rem;
  font-size: 1.5rem;
  font-weight: 700;
  border: none;
}

.platform-badges {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--vp-c-text-1);
  transition: transform 0.2s;
}

.badge:hover {
  transform: translateY(-2px);
  border-color: var(--vp-c-brand);
}

.icon {
  font-size: 1.5rem;
}
</style>
