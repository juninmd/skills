<template>
  <div class="category-section">
    <h2 class="text-center">Explore o Catálogo</h2>
    
    <div class="grid grid-cols-3 gap-lg">
      <a v-for="cat in categories" :key="cat.title" :href="cat.link" class="card p-lg text-decoration-none">
        <div class="card-icon">{{ cat.icon }}</div>
        <h3>{{ cat.title }}</h3>
        <p class="text-muted">{{ cat.description }}</p>
      </a>
    </div>
  </div>
</template>

<script setup>
const categories = [
  {
    title: 'Agentes',
    link: '/agents/',
    icon: '🤖',
    description: 'Personas especializadas como Engenheiro de Qualidade, SecOps e mais.'
  },
  {
    title: 'Skills',
    link: '/skills/',
    icon: '⚙️',
    description: 'Capacidades modulares para Docker, K8s, Python, Node e mais de 70 outras.'
  },
  {
    title: 'Regras',
    link: '/rules/',
    icon: '📋',
    description: 'Padrões obrigatórios para segurança, qualidade de código e performance.'
  },
  {
    title: 'Hooks',
    link: '/hooks/',
    icon: '🪝',
    description: 'Git hooks para automação de pré-commit e pré-push.'
  },
  {
    title: 'Fluxos de Trabalho',
    link: '/workflows/',
    icon: '🔄',
    description: 'Pipelines de CI/CD e GitHub Actions reutilizáveis.'
  }
];
</script>

<style scoped>
.category-section {
  margin-top: 4rem;
  margin-bottom: 4rem;
}

.text-center {
  text-align: center;
  margin-bottom: 2rem;
  border: none;
}

.grid {
  display: grid;
  gap: 1.5rem;
}

.grid-cols-3 {
  grid-template-columns: repeat(3, 1fr);
}

.card {
  transition: all 0.3s;
  display: block;
  height: 100%;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  text-decoration: none !important;
  color: inherit;
}

.card:hover {
  transform: translateY(-4px);
  border-color: var(--vp-c-brand);
  box-shadow: var(--vp-shadow-2);
}

.search-card {
  background: var(--vp-c-bg-soft);
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.card h3 {
  margin: 0 0 0.5rem 0;
  color: var(--vp-c-text-1);
}

.text-muted {
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
  margin: 0;
}

@media (max-width: 960px) {
  .grid-cols-3 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .grid-cols-3 {
    grid-template-columns: 1fr;
  }
}
</style>
