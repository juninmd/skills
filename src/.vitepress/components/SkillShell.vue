<template>
  <aside class="skill-sidebar" v-if="hasContent">
    <div class="sidebar-block" v-if="installCmd">
      <h3>🚀 Installation</h3>
      <div class="install-container">
        <code class="install-code">{{ installCmd }}</code>
        <button class="copy-btn" @click="copy" :class="{ copied }">
          {{ copied ? '✅' : '📋' }}
        </button>
      </div>
    </div>

    <!-- Parameters Block -->
    <div class="sidebar-block" v-if="parameters && parameters.length">
      <h3>📋 Parameters</h3>
      <div class="params-list">
        <div v-for="p in parameters" :key="p.name" class="param-item">
          <div class="param-header">
            <span class="param-name">`{{ p.name }}`</span>
            <span v-if="p.required" class="param-badge required">Required</span>
          </div>
          <div class="param-type">{{ p.type }}</div>
          <div class="param-desc">{{ p.description }}</div>
        </div>
      </div>
    </div>

    <!-- Related Files (Siblings) -->
    <div class="sidebar-block" v-if="relatedFiles && relatedFiles.length">
      <h3>🔗 Related Files</h3>
      <ul class="file-list">
        <li v-for="f in relatedFiles" :key="f" class="file-item">
          <a :href="getRelatedFileUrl(f)" target="_blank" class="file-link">
            <span class="file-icon">📄</span> {{ f }}
          </a>
        </li>
      </ul>
    </div>

    <!-- Folder Files (Full Listing) -->
    <div class="sidebar-block" v-if="files && files.length">
      <h3>📁 Folder Files</h3>
      <ul class="file-list">
        <li v-for="f in files" :key="f" class="file-item">
          <a :href="getFileUrl(f)" target="_blank" class="file-link">
            <span class="file-icon">{{ getFileIcon(f) }}</span> {{ f }}
          </a>
        </li>
      </ul>
    </div>

    <div class="sidebar-block" v-if="repoUrl || editUrl || rawUrl">
      <div class="action-buttons">
        <a v-if="repoUrl" class="action-link secondary" :href="repoUrl" target="_blank">
          🔍 View Code
        </a>
        <a v-if="editUrl" class="action-link primary" :href="editUrl" target="_blank">
          📝 Edit in GitLab
        </a>
        <a v-if="rawUrl" class="action-link subtle" :href="rawUrl" target="_blank">
          📄 Raw Markdown
        </a>
        <button class="action-link subtle" @click="openModal">
          📑 Copy & Preview
        </button>
      </div>
    </div>
  </aside>

  <div v-if="showModal" class="source-modal" @keydown.esc="closeModal" tabindex="-1">
    <div class="modal-backdrop" @click="closeModal"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h3>Source: {{ skillId }}</h3>
        <div class="modal-actions">
          <button :class="{active: viewMode==='preview'}" @click="viewMode='preview'">Preview</button>
          <button :class="{active: viewMode==='markdown'}" @click="viewMode='markdown'">Markdown</button>
          <button @click="closeModal">Close</button>
        </div>
      </div>
      <div class="modal-body">
        <div v-if="viewMode==='preview'">
          <div v-html="renderedHtml" class="rendered-preview"></div>
          <div v-if="!renderedHtml" class="empty-note">Preview not available.</div>
        </div>
        <div v-else>
          <div class="markdown-actions">
            <button @click="copyRaw">{{ rawCopied ? 'Copied' : 'Copy Markdown' }}</button>
          </div>
          <pre class="raw-markdown"><code>{{ loadingRaw ? 'Loading...' : rawMarkdown }}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useData } from 'vitepress';

const props = defineProps({
  files: { type: Array, default: () => [] },
  relatedFiles: { type: Array, default: () => [] },
  parameters: { type: Array, default: () => [] },
  skillId: { type: String, default: '' },
  installCmd: { type: String, default: '' },
  sourcePath: { type: String, default: '' },
  genPath: { type: String, default: '' },
  repoUrl: { type: String, default: '' },
  editUrl: { type: String, default: '' },
  rawUrl: { type: String, default: '' },
  category: { type: String, default: 'skills' }
});

const route = useRoute();
const { frontmatter } = useData();

// Read data from frontmatter or props (props take precedence for backward compatibility)
const skillId = computed(() => props.skillId || frontmatter.value?.skillId || '');
const installCmd = computed(() => props.installCmd || frontmatter.value?.installCmd || '');
const repoUrl = computed(() => props.repoUrl || frontmatter.value?.repoUrl || '');
const editUrl = computed(() => props.editUrl || frontmatter.value?.editUrl || '');
const rawUrl = computed(() => props.rawUrl || frontmatter.value?.rawUrl || '');
const files = computed(() => props.files?.length ? props.files : (frontmatter.value?.files || []));
const relatedFiles = computed(() => props.relatedFiles?.length ? props.relatedFiles : (frontmatter.value?.relatedFiles || []));
const parameters = computed(() => props.parameters?.length ? props.parameters : (frontmatter.value?.parameters || []));
const category = computed(() => props.category || frontmatter.value?.category || 'skills');

const copied = ref(false);
const showModal = ref(false);
const viewMode = ref('preview'); // 'preview' or 'markdown'
const renderedHtml = ref('');
const rawMarkdown = ref('');
const loadingRaw = ref(false);
const rawCopied = ref(false);

// Only display sidebar if there is actual content to show
const hasContent = computed(() => {
  return (
    !!installCmd.value ||
    (parameters.value && parameters.value.length > 0) ||
    (relatedFiles.value && relatedFiles.value.length > 0) ||
    (files.value && files.value.length > 0) ||
    !!repoUrl.value ||
    !!editUrl.value ||
    !!rawUrl.value
  );
});

function getRelatedFileUrl(f) {
  return `/.agents-${category.value}/${f}`;
}

const resourceFiles = computed(() => files.value.filter(f => f.startsWith('resources/')));
const coreFiles = computed(() => files.value.filter(f => !f.startsWith('resources/') && !f.startsWith('scripts/')));

function getFileUrl(f) {
  return category.value === 'skills'
    ? `/.agents-${category.value}/${skillId.value}/${f}`
    : `/.agents-${category.value}/${f}`;
}

function copy() {
  navigator.clipboard.writeText(installCmd.value || '');
  copied.value = true;
  setTimeout(() => { copied.value = false; }, 2000);
}

function openModal() {
  showModal.value = true;
  // Attempt to get rendered HTML from the page's rendered slot
  try {
    const el = document.querySelector(`.skill-content-area[data-skill="${skillId.value}"]`);
    if (el) {
      renderedHtml.value = el.innerHTML;
    }
  } catch (e) {}

  // Fetch raw cleaned markdown if genPath provided
  if (props.genPath) {
    loadingRaw.value = true;
    fetch(props.genPath).then(r => r.text()).then(t => { rawMarkdown.value = t; }).catch(() => { rawMarkdown.value = 'Unable to load source.'; }).finally(() => { loadingRaw.value = false; });
  }
}

function closeModal() { showModal.value = false; }

function getFileIcon(f) {
  if (f.startsWith('resources/')) return '📦';
  if (f.startsWith('scripts/')) return '📜';
  if (f.endsWith('.md')) return '📄';
  if (f.endsWith('.py') || f.endsWith('.sh') || f.endsWith('.js')) return '⚙️';
  return '📝';
}

function copyRaw() {
  navigator.clipboard.writeText(rawMarkdown.value || '');
  rawCopied.value = true;
  setTimeout(() => { rawCopied.value = false; }, 2000);
}
</script>

<style scoped>
.skill-sidebar {
  width: 100%;
  margin: 2rem 0;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.sidebar-block {
  margin-bottom: 0;
  padding: 1rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}

.sidebar-block:last-child {
  margin-bottom: 0;
}

.sidebar-block h3 {
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-2);
  border: none;
}

.install-container {
  display: flex;
  gap: 0.5rem;
  background: var(--vp-c-bg-soft);
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  align-items: center;
  flex-wrap: wrap;
}

.install-code {
  font-size: 0.8rem;
  font-family: var(--vp-font-family-mono);
  overflow-x: auto;
  white-space: nowrap;
  flex: 1;
  min-width: 150px;
}

.copy-btn {
  padding: 0.25rem 0.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
  cursor: pointer;
  transition: all 0.2s;
}

.copy-btn:hover {
  background: var(--vp-c-divider);
}

.file-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.file-item {
  margin-bottom: 0.5rem;
}

.file-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--vp-c-brand);
  text-decoration: none;
  transition: color 0.2s;
}

.file-link.resource {
  color: var(--vp-c-text-1);
  font-weight: 500;
}

.file-link:hover {
  color: var(--vp-c-brand-dark);
  text-decoration: underline;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.action-link {
  display: block;
  text-align: center;
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.85rem;
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;
  width: 100%;
  border: 1px solid transparent;
}

.action-link.primary {
  background: var(--vp-c-brand);
  color: white;
}
.action-link.primary:hover { background: var(--vp-c-brand-dark); }

.action-link.secondary {
  background: var(--vp-c-bg);
  border-color: var(--vp-c-divider);
  color: var(--vp-c-text-1);
}
.action-link.secondary:hover { border-color: var(--vp-c-brand); color: var(--vp-c-brand); }

.action-link.subtle {
  background: transparent;
  color: var(--vp-c-text-2);
  font-weight: 500;
}
.action-link.subtle:hover { color: var(--vp-c-brand); }

.params-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.param-item {
  padding: 0.75rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  font-size: 0.85rem;
}

.param-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.param-name {
  font-family: var(--vp-font-family-mono);
  font-weight: 600;
  color: var(--vp-c-brand);
}

.param-badge {
  font-size: 0.7rem;
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 700;
  text-transform: uppercase;
}

.param-badge.required {
  background: var(--vp-c-danger);
  color: white;
}

.param-type {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  margin-bottom: 0.5rem;
  font-style: italic;
}

.param-desc {
  line-height: 1.4;
  color: var(--vp-c-text-2);
}

/* Modal styles */
.source-modal { position: fixed; inset:0; display:flex; align-items:center; justify-content:center; z-index:9999; }
.source-modal .modal-backdrop { position:absolute; inset:0; background: rgba(2,6,23,0.6); }
.source-modal .modal-content { position:relative; background:var(--vp-c-bg); border:1px solid var(--vp-c-divider); border-radius:10px; max-width:1000px; width:92%; max-height:80vh; overflow:auto; padding:1rem; }
.modal-header { display:flex; justify-content:space-between; align-items:center; gap:1rem; }
.modal-actions button { margin-left:0.5rem; }
.modal-body { margin-top:1rem; }
.rendered-preview { padding: 1rem; background: var(--vp-c-bg-soft); border-radius:8px; }
.raw-markdown { white-space:pre-wrap; max-height:60vh; overflow:auto; background:var(--vp-c-bg-soft); padding:1rem; border-radius:8px; }
.markdown-actions { margin-bottom:0.5rem; }
.view-source-btn { width:100%; padding:0.6rem; border-radius:8px; border:1px solid var(--vp-c-divider); background:transparent; font-weight:700; cursor:pointer; }
</style>