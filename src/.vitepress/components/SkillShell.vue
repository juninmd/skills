<template>
  <div class="skill-card" v-if="hasContent">
    <!-- Card Header -->
    <div class="card-header" v-if="installCmd || (repoUrl || editUrl || rawUrl)">
      <div class="header-left">
        <h3 class="card-title">🚀 Quick Start</h3>
      </div>
    </div>

    <!-- Installation Command -->
    <div class="card-installation" v-if="installCmd">
      <div class="install-label">Installation Command</div>
      <div class="install-container">
        <code class="install-code">{{ installCmd }}</code>
        <button class="copy-btn" @click="copyInstall" :title="copied ? 'Copied!' : 'Copy to clipboard'">
          <span v-if="copied">✓</span>
          <span v-else>Copy</span>
        </button>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="card-content">
      <!-- Files Section -->
      <div class="content-section files-section" v-if="files && files.length">
        <h4 class="section-title">📁 Folder Files</h4>
        <ul class="file-list">
          <li v-for="f in files.slice(0, 8)" :key="f" class="file-item">
            <a :href="getFileUrl(f)" target="_blank" class="file-link">
              <span class="file-icon">{{ getFileIcon(f) }}</span>
              <span class="file-name">{{ f }}</span>
            </a>
          </li>
          <li v-if="files.length > 8" class="file-item more-items">
            <span class="file-icon">+</span>
            <span class="file-name">{{ files.length - 8 }} more</span>
          </li>
        </ul>
      </div>

      <!-- Links Section -->
      <div class="content-section links-section" v-if="repoUrl || editUrl || rawUrl">
        <h4 class="section-title">🔗 Resources</h4>
        <div class="action-buttons">
          <a v-if="repoUrl" class="action-link" :href="repoUrl" target="_blank">
            <span class="link-icon">📂</span>
            <span class="link-text">View Code</span>
          </a>
          <a v-if="editUrl" class="action-link primary" :href="editUrl" target="_blank">
            <span class="link-icon">✏️</span>
            <span class="link-text">Edit</span>
          </a>
          <a v-if="rawUrl" class="action-link" :href="rawUrl" target="_blank">
            <span class="link-icon">📄</span>
            <span class="link-text">Raw</span>
          </a>
          <button class="action-link preview-btn" @click="openModal" :title="'View and copy content'">
            <span class="link-icon">👁️</span>
            <span class="link-text">Preview</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Footer with Optional Content -->
    <div class="card-footer" v-if="parameters && parameters.length > 0">
      <details class="footer-details">
        <summary class="footer-summary">
          <span class="summary-icon">▶</span>
          📋 Parameters ({{ parameters.length }})
        </summary>
        <div class="params-wrapper">
          <div v-for="p in parameters" :key="p.name" class="param-item">
            <span class="param-name">`{{ p.name }}`</span>
            <span v-if="p.required" class="param-badge">Required</span>
            <div class="param-info">{{ p.type }} - {{ p.description }}</div>
          </div>
        </div>
      </details>
    </div>
  </div>

  <!-- Preview Modal -->
  <div v-if="showModal" class="source-modal" @keydown.esc="closeModal">
    <div class="modal-backdrop" @click="closeModal"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h3>📋 {{ skillId }}</h3>
        <div class="modal-tabs">
          <button :class="{active: viewMode==='preview'}" @click="viewMode='preview'">Preview</button>
          <button :class="{active: viewMode==='markdown'}" @click="viewMode='markdown'">Markdown</button>
        </div>
        <button class="modal-close" @click="closeModal">✕</button>
      </div>
      <div class="modal-body">
        <div v-if="viewMode==='preview'" class="preview-content">
          <div v-html="renderedHtml" class="rendered-preview"></div>
          <div v-if="!renderedHtml" class="empty-state">Preview not available</div>
        </div>
        <div v-else class="markdown-content">
          <button class="copy-markdown-btn" @click="copyRaw">
            {{ rawCopied ? '✓ Copied' : '📋 Copy Markdown' }}
          </button>
          <pre class="raw-markdown"><code>{{ loadingRaw ? '⏳ Loading...' : rawMarkdown }}</code></pre>
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

function copyInstall() {
  navigator.clipboard.writeText(installCmd.value || '');
  copied.value = true;
  setTimeout(() => { copied.value = false; }, 2000);
}

function copy() {
  copyInstall();
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
/* Main Card Container */
.skill-card {
  width: 100%;
  margin: 2rem 0;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  transition: box-shadow 0.2s ease;
}

.skill-card:hover {
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
}

/* Card Header */
.card-header {
  background: linear-gradient(135deg, var(--vp-c-brand) 0%, rgba(var(--vp-c-brand-rgb), 0.8) 100%);
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: white;
}

/* Installation Section */
.card-installation {
  padding: 1.25rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.install-label {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.install-container {
  display: flex;
  gap: 0.5rem;
  background: var(--vp-c-bg);
  padding: 0.75rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  align-items: center;
}

.install-code {
  font-size: 0.8rem;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-1);
  overflow-x: auto;
  white-space: nowrap;
  flex: 1;
  min-width: 100px;
  user-select: all;
  padding: 0.25rem;
}

.copy-btn {
  padding: 0.4rem 0.75rem;
  background: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.75rem;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.copy-btn:hover {
  background: var(--vp-c-brand-dark);
  transform: translateY(-1px);
}

.copy-btn:active {
  transform: translateY(0);
}

/* Content Grid */
.card-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  padding: 0;
}

.content-section {
  padding: 1.25rem;
  border-right: 1px solid var(--vp-c-divider);
}

.content-section:last-child {
  border-right: none;
}

.section-title {
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-2);
}

/* File List */
.file-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 0.4rem 0;
  font-size: 0.85rem;
  color: var(--vp-c-text-1);
}

.file-item.more-items {
  color: var(--vp-c-text-2);
  font-style: italic;
  cursor: default;
}

.file-icon {
  margin-right: 0.5rem;
  display: inline-block;
  width: 1.2rem;
  text-align: center;
}

.file-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--vp-c-brand);
  text-decoration: none;
  transition: color 0.2s ease;
  flex: 1;
}

.file-link:hover {
  color: var(--vp-c-brand-dark);
  text-decoration: underline;
}

.file-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.action-link {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.6rem;
  padding: 0.6rem 0.8rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 5px;
  color: var(--vp-c-text-1);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-link:hover {
  background: var(--vp-c-bg-mute);
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

.action-link.primary {
  background: var(--vp-c-brand);
  color: white;
  border-color: var(--vp-c-brand);
}

.action-link.primary:hover {
  background: var(--vp-c-brand-dark);
  border-color: var(--vp-c-brand-dark);
}

.link-icon {
  display: inline-block;
  width: 1rem;
  text-align: center;
}

.link-text {
  flex: 1;
}

/* Footer */
.card-footer {
  border-top: 1px solid var(--vp-c-divider);
  padding: 0;
}

.footer-details {
  cursor: pointer;
  width: 100%;
}

.footer-summary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.25rem;
  user-select: none;
  font-weight: 500;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  transition: background 0.2s ease;
}

.footer-summary:hover {
  background: var(--vp-c-bg-soft);
}

.summary-icon {
  display: inline-block;
  transition: transform 0.2s ease;
  font-size: 0.7rem;
}

.footer-details[open] .summary-icon {
  transform: rotate(90deg);
}

.params-wrapper {
  padding: 0 1.25rem 1.25rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.param-item {
  padding: 0.75rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 5px;
  font-size: 0.8rem;
}

.param-name {
  display: inline-block;
  font-family: var(--vp-font-family-mono);
  font-weight: 600;
  color: var(--vp-c-brand);
  margin-bottom: 0.25rem;
}

.param-badge {
  display: inline-block;
  margin-left: 0.5rem;
  padding: 0.2rem 0.5rem;
  background: var(--vp-c-danger-soft);
  color: var(--vp-c-danger);
  border-radius: 3px;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
}

.param-info {
  margin-top: 0.4rem;
  color: var(--vp-c-text-2);
  line-height: 1.4;
}

/* Modal */
.source-modal {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal-content {
  position: relative;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  max-width: 900px;
  width: 90vw;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  border-bottom: 1px solid var(--vp-c-divider);
  flex-shrink: 0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1rem;
  color: var(--vp-c-text-1);
}

.modal-tabs {
  display: flex;
  gap: 0.5rem;
}

.modal-tabs button {
  padding: 0.4rem 0.8rem;
  background: transparent;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  transition: all 0.2s;
}

.modal-tabs button.active {
  background: var(--vp-c-brand);
  color: white;
  border-color: var(--vp-c-brand);
}

.modal-close {
  background: transparent;
  border: none;
  color: var(--vp-c-text-2);
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  transition: color 0.2s;
}

.modal-close:hover {
  color: var(--vp-c-text-1);
}

.modal-body {
  overflow: auto;
  flex: 1;
  padding: 1.25rem;
}

.preview-content,
.markdown-content {
  min-height: 200px;
}

.empty-state {
  padding: 2rem;
  text-align: center;
  color: var(--vp-c-text-3);
}

.rendered-preview {
  background: var(--vp-c-bg-soft);
  border-radius: 6px;
  padding: 1rem;
  line-height: 1.6;
}

.raw-markdown {
  background: var(--vp-c-bg-muted);
  border-radius: 6px;
  padding: 1rem;
  overflow: auto;
  font-size: 0.8rem;
  line-height: 1.5;
  margin: 0;
}

.copy-markdown-btn {
  padding: 0.5rem 0.8rem;
  background: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  margin-bottom: 1rem;
  transition: all 0.2s;
}

.copy-markdown-btn:hover {
  background: var(--vp-c-brand-dark);
}

/* Responsive Design */
@media (max-width: 768px) {
  .card-content {
    grid-template-columns: 1fr;
  }

  .content-section {
    border-right: none;
    border-bottom: 1px solid var(--vp-c-divider);
  }

  .content-section:last-child {
    border-bottom: none;
  }

  .modal-content {
    width: 95vw;
    max-height: 90vh;
  }

  .params-wrapper {
    grid-template-columns: 1fr;
  }
}
</style>