<template>
  <div class="category-layout">
    <h1>{{ title }}</h1>
    <p class="subtitle">{{ subtitle }}</p>

    <div v-if="loading" class="loading">Carregando catálogo...</div>
    <CategoryGrid v-else :items="items" :category="category" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  category: {
    type: String,
    required: true
  }
});

const items = ref([]);
const loading = ref(true);

const categoryLabels = {
  agents: 'Agentes',
  skills: 'Skills (Capacidades)',
  rules: 'Regras',
  workflows: 'Workflows (Fluxos)'
};

const title = computed(() => {
  return categoryLabels[props.category] || props.category.charAt(0).toUpperCase() + props.category.slice(1);
});

const subtitle = computed(() => {
  return `Veja todos os ${title.value.toLowerCase()} com descrição simples e instruções de uso.`;
});

onMounted(async () => {
  try {
    const res = await fetch('/catalog.json');
    const catalog = await res.json();
    items.value = catalog[props.category] || [];
  } catch (e) {
    console.error('Failed to load catalog', e);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.subtitle {
  margin-bottom: 1rem;
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
}
.loading {
  padding: 1.5rem;
  text-align: center;
  color: var(--vp-c-text-3);
  font-size: 0.9rem;
}
</style>
