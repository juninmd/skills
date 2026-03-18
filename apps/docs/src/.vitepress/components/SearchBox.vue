<template>
  <div class="search-container">
    <div class="search-header">
      <div class="search-input-wrapper">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search skills, rules, workflows..."
          class="search-input"
          @input="performSearch"
        />
      </div>

      <div class="filters">
        <button
          v-for="cat in categories"
          :key="cat"
          :class="['filter-btn', { active: selectedCategory === cat }]"
          @click="selectedCategory = selectedCategory === cat ? '' : cat"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <div class="results">
      <div v-if="results.length === 0" class="no-results">
        <p v-if="searchQuery">No results found for "{{ searchQuery }}"</p>
        <p v-else>Start typing to search across all skills, rules, and more...</p>
      </div>

      <div v-else>
        <p class="results-count">{{ results.length }} result{{ results.length !== 1 ? 's' : '' }} found</p>

        <div class="results-list">
          <a
            v-for="result in results"
            :key="result.id"
            :href="result.url"
            class="result-item"
          >
            <div class="result-header">
              <h3>{{ result.title }}</h3>
              <span class="result-category">{{ result.category }}</span>
            </div>
            <p class="result-description">{{ result.description }}</p>
            <div v-if="result.tags.length > 0" class="result-tags">
              <span v-for="tag in result.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import MiniSearch from 'minisearch';

const searchQuery = ref('');
const selectedCategory = ref('');
const results = ref([]);
const allItems = ref([]);
const categories = ref(['agents', 'skills', 'rules', 'workflows']);
let miniSearch = null;

onMounted(async () => {
  try {
    const res = await fetch('/catalog.json');
    const catalog = await res.json();

    // Flattena todos os itens com suas categorias
    for (const [category, items] of Object.entries(catalog)) {
      allItems.value.push(
        ...items.map(item => ({
          ...item,
          category
        }))
      );
    }

    // Configura MiniSearch para busca full-text
    miniSearch = new MiniSearch({
      fields: ['title', 'description', 'tags'],
      storeFields: ['title', 'description', 'tags', 'category', 'url', 'id'],
      searchOptions: {
        boost: { title: 2, tags: 1.5 },
        fuzzy: 0.2
      }
    });

    miniSearch.addAll(allItems.value);
  } catch (error) {
    console.error('Erro ao carregar catálogo:', error);
  }
});

// Reage a mudanças no filtro de categoria
watch(selectedCategory, () => {
  performSearch();
});

function performSearch() {
  if (!miniSearch) return;

  let searchResults = [];

  if (searchQuery.value.trim()) {
    searchResults = miniSearch.search(searchQuery.value);
  } else {
    searchResults = allItems.value;
  }

  // Filtra por categoria se selecionada
  if (selectedCategory.value) {
    searchResults = searchResults.filter(item => item.category === selectedCategory.value);
  }

  results.value = searchResults;
}
</script>

<style scoped>
.search-container {
  max-width: 1200px;
  margin: 1.2rem auto;
  padding: 0 1rem;
}

.search-header {
  margin-bottom: 1.2rem;
}

.search-input-wrapper {
  position: relative;
  margin-bottom: 1rem;
}

.search-icon {
  position: absolute;
  left: 0.9rem;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: var(--vp-c-divider);
}

.search-input {
  width: 100%;
  padding: 0.65rem 0.9rem 0.65rem 2.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  font-size: 0.9rem;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  transition: all 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.filters {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.4rem 0.85rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.3s;
  text-transform: capitalize;
  font-size: 0.8rem;
  font-weight: 500;
}

.filter-btn:hover {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

.filter-btn.active {
  background: var(--vp-c-brand);
  border-color: var(--vp-c-brand);
  color: white;
}

.no-results {
  text-align: center;
  padding: 2rem 1rem;
  color: var(--vp-c-text-3);
}

.results-count {
  margin-bottom: 0.6rem;
  color: var(--vp-c-text-2);
  font-size: 0.8rem;
  font-weight: 500;
}

.results-list {
  display: grid;
  gap: 0.75rem;
}

.result-item {
  display: block;
  padding: 0.95rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  transition: all 0.3s;
  text-decoration: none;
  color: inherit;
}

.result-item:hover {
  border-color: var(--vp-c-brand);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.08);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.4rem;
}

.result-header h3 {
  margin: 0;
  font-size: 1rem;
  color: var(--vp-c-brand);
}

.result-category {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  background: var(--vp-c-bg-soft);
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}

.result-description {
  margin: 0.3rem 0 0.5rem;
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
  line-height: 1.4;
}

.result-tags {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.tag {
  display: inline-block;
  padding: 0.2rem 0.4rem;
  background: var(--vp-c-bg-soft);
  border-radius: 3px;
  font-size: 0.7rem;
  color: var(--vp-c-text-3);
}

@media (max-width: 640px) {
  .search-header {
    margin-bottom: 1rem;
  }

  .result-header {
    flex-direction: column;
    gap: 0.35rem;
  }

  .filter-btn {
    font-size: 0.75rem;
    padding: 0.3rem 0.7rem;
  }
}
</style>
