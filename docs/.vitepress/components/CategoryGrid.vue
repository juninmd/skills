<template>
  <div class="category-grid">
    <div class="grid-header">
      <div class="grid-search">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input
          v-model="localSearch"
          type="text"
          :placeholder="`Search ${category}...`"
          class="grid-search-input"
        />
      </div>
    </div>

    <div class="grid">
      <a
        v-for="item in filteredItems"
        :key="item.id"
        :href="item.url"
        class="grid-card"
      >
        <div class="card-icon">
          {{ getCategoryIcon(category) }}
        </div>
        <div class="card-content">
          <h3>{{ item.title }}</h3>
          <p class="description">{{ item.description || 'No description available' }}</p>
          <div v-if="item.tags && item.tags.length > 0" class="tags">
            <span v-for="tag in item.tags.slice(0, 3)" :key="tag" class="tag">
              {{ tag }}
            </span>
            <span v-if="item.tags.length > 3" class="tag-more">+{{ item.tags.length - 3 }}</span>
          </div>
        </div>
      </a>
    </div>

    <div v-if="filteredItems.length === 0" class="empty-state">
      <p>No items found in {{ category }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  category: {
    type: String,
    required: true
  }
});

const localSearch = ref('');

const filteredItems = computed(() => {
  return props.items.filter(item => {
    const query = localSearch.value.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.tags?.some(tag => tag.toLowerCase().includes(query))
    );
  });
});

function getCategoryIcon(category) {
  const icons = {
    skills: '⚙️',
    agents: '🤖',
    rules: '📋',
    hooks: '🪝',
    workflows: '🔄'
  };
  return icons[category] || '📦';
}
</script>

<style scoped>
.category-grid {
  padding: 2rem 0;
}

.grid-header {
  margin-bottom: 2rem;
}

.grid-search {
  position: relative;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: var(--vp-c-divider);
}

.grid-search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  font-size: 0.95rem;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  transition: all 0.3s;
}

.grid-search-input:focus {
  outline: none;
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(280px, 1fr));
  gap: 1.5rem;
}

.grid-card {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.grid-card:hover {
  border-color: var(--vp-c-brand);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  transform: translateY(-2px);
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.card-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: var(--vp-c-brand);
  font-weight: 600;
}

.description {
  margin: 0 0 1rem 0;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  line-height: 1.5;
  flex-grow: 1;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  display: inline-block;
  padding: 0.25rem 0.6rem;
  background: var(--vp-c-bg-soft);
  border-radius: 3px;
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  font-weight: 500;
}

.tag-more {
  padding: 0.25rem 0.6rem;
  color: var(--vp-c-text-3);
  font-size: 0.75rem;
  font-weight: 500;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--vp-c-text-3);
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }

  .grid-card {
    padding: 1.25rem;
  }

  .card-icon {
    font-size: 2rem;
    margin-bottom: 0.75rem;
  }
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
