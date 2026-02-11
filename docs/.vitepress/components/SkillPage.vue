<template>
  <div class="skill-page-wrapper">
    <div v-if="loading" class="loading">Loading skill details...</div>

    <template v-else-if="skill">
      <!-- Metadados da Skill -->

      <!-- Conteúdo Markdown Renderizado pelo VitePress -->
      <div class="skill-content-area" :data-skill="skillId">
        <slot></slot>
      </div>
    </template>

    <div v-else class="error">
      Failed to load skill metadata.
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import SkillShell from './SkillShell.vue';

const props = defineProps({
  skillId: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'skills'
  },
  sourcePath: {
    type: String,
    default: ''
  },
  genPath: {
    type: String,
    default: ''
  }
});

const skill = ref(null);
const loading = ref(true);

const installCmd = computed(() => skill.value?.installCmd || `uv install ${props.skillId}`);

onMounted(async () => {
  try {
    const res = await fetch('/catalog.json');
    const catalog = await res.json();
    const skills = catalog[props.category] || [];
    skill.value = skills.find(s => s.id === props.skillId);
  } catch (e) {
    console.error('Failed to load catalog', e);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.skill-page-wrapper::after {
  content: "";
  display: table;
  clear: both;
}
.loading, .error {
  padding: 2rem;
  text-align: center;
  color: var(--vp-c-text-3);
  font-size: 0.9rem;
}
.skill-content-area {
  margin-top: 2rem;
}
</style>
