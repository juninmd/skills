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
    const query = localSearch.value.toLowerCase().trim();
    if (!query) return true;
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
    workflows: '🔄'
  };
  return icons[category] || '📦';
}
</script>

<style scoped>
.category-grid {
  padding: 1.2rem 0;
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.grid-header {
  margin-bottom: 1.2rem;
}

.grid-search {
  position: relative;
  max-width: 500px;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: var(--vp-c-text-3);
  transition: color 0.3s;
  pointer-events: none;
}

.grid-search-input {
  width: 100%;
  padding: 0.7rem 1rem 0.7rem 2.8rem;
  border: 2px solid var(--vp-c-divider);
  border-radius: 10px;
  font-size: 0.9rem;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.grid-search-input::placeholder {
  color: var(--vp-c-text-3);
}

.grid-search-input:focus {
  outline: none;
  border-color: var(--vp-c-brand);
  box-shadow: 0 4px 20px rgba(var(--vp-c-brand-rgb), 0.15);
  transform: translateY(-1px);
}

.grid-search-input:focus + .search-icon {
  color: var(--vp-c-brand);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.2rem;
}

.grid-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 1.4rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: linear-gradient(
    135deg,
    rgba(var(--vp-c-bg-rgb), 0.95) 0%,
    rgba(var(--vp-c-bg-rgb), 1) 100%
  );
  backdrop-filter: blur(10px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.02);
}

.grid-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(
    90deg,
    var(--vp-c-brand) 0%,
    var(--vp-c-brand-light) 100%
  );
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.grid-card:hover::before {
  transform: scaleX(1);
}

.grid-card:hover {
  border-color: transparent;
  box-shadow:
    0 8px 20px rgba(var(--vp-c-brand-rgb), 0.12),
    0 1px 4px rgba(0, 0, 0, 0.04);
  transform: translateY(-5px);
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 0.9rem;
  filter: grayscale(0.3);
  transition: all 0.3s;
}

.grid-card:hover .card-icon {
  filter: grayscale(0);
  transform: scale(1.08) rotate(3deg);
}

.card-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  background: linear-gradient(
    120deg,
    var(--vp-c-brand) 0%,
    var(--vp-c-brand-light) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  letter-spacing: -0.01em;
  transition: all 0.3s;
}

.grid-card:hover .card-content h3 {
  letter-spacing: 0;
}

.description {
  margin: 0 0 0.7rem 0;
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
  line-height: 1.5;
  flex-grow: 1;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.75rem;
  background: linear-gradient(
    135deg,
    var(--vp-c-bg-soft) 0%,
    var(--vp-c-bg-muted) 100%
  );
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  font-weight: 600;
  transition: all 0.3s;
}

.grid-card:hover .tag {
  border-color: rgba(var(--vp-c-brand-rgb), 0.3);
  background: linear-gradient(
    135deg,
    rgba(var(--vp-c-brand-rgb), 0.08) 0%,
    rgba(var(--vp-c-brand-rgb), 0.12) 100%
  );
  color: var(--vp-c-brand);
  transform: translateY(-2px);
}

.tag-more {
  padding: 0.35rem 0.75rem;
  color: var(--vp-c-text-3);
  font-size: 0.75rem;
  font-weight: 600;
}

.empty-state {
  text-align: center;
  padding: 4rem 1rem;
  color: var(--vp-c-text-3);
  font-size: 1.1rem;
}

.empty-state::before {
  content: '🔍';
  display: block;
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

@media (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.25rem;
  }

  .grid-card {
    padding: 1.5rem;
  }

  .card-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  .card-content h3 {
    font-size: 1.1rem;
  }

  .description {
    font-size: 0.9rem;
  }
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .grid-search {
    max-width: 100%;
  }
}
</style>
