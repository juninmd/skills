<template>
  <div class="category-layout">
    <h1>{{ title }}</h1>
    <p class="subtitle">Browse all {{ category }} and their documentation.</p>
    
    <div v-if="loading" class="loading">Loading catalog...</div>
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

const title = computed(() => {
  return props.category.charAt(0).toUpperCase() + props.category.slice(1);
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
  margin-bottom: 2rem;
  color: var(--vp-c-text-2);
  font-size: 1.1rem;
}
.loading {
  padding: 2rem;
  text-align: center;
  color: var(--vp-c-text-3);
}
</style>
