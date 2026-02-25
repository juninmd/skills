import { defineConfig } from 'vitepress';
import { sidebar } from './sidebar.js';
import { vitepressMermaidPreview } from 'vitepress-mermaid-preview';

export default defineConfig({
  title: 'Luizalabs Catalog',
  description: 'Catalog of Agents, Skills & Workflows for Gemini, Antigravity & Copilot',
  cleanUrls: true,
  ignoreDeadLinks: true,

  head: [
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    ['meta', { property: 'og:title', content: 'Luizalabs Catalog' }],
    ['meta', { property: 'og:description', content: 'Catalog of Agents, Skills & Workflows for Gemini, Antigravity & Copilot' }],
    ['link', { rel: 'icon', href: '/favicon.svg' }]
  ],

  // Vite build optimizations
  vite: {
    build: {
      chunkSizeWarningLimit: 1000,
    },
    optimizeDeps: {
      include: ['vue', 'minisearch'],
    },
  },

  themeConfig: {
    logo: '/logo.png',
    siteTitle: 'Luizalabs Catalog',

    nav: [
      { text: 'Inicio', link: '/' },
      { text: 'Primeiros Passos', link: '/getting-started' },
      {
        text: 'Catalogo',
        items: [
          { text: 'Agentes', link: '/agents/' },
          { text: 'Skills', link: '/skills/' },
          { text: 'Regras', link: '/rules/' },
          { text: 'Hooks', link: '/hooks/' },
          { text: 'Workflows', link: '/workflows/' }
        ]
      },
      { text: 'Deploy', link: '/deploy/' },
      {
        text: 'Guias',
        items: [
          { text: 'Conceitos Basicos', link: '/agentic-concepts' },
          { text: 'Arquitetura Agentica', link: '/agentic-architecture' },
          { text: 'GitHub Copilot', link: '/integration/copilot' },
          { text: 'Antigravity', link: '/integration/antigravity' },
          { text: 'Gemini CLI', link: '/integration/gemini' }
        ]
      }
    ],

    sidebar: sidebar,

    socialLinks: [
      { icon: 'gitlab', link: 'https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents' },
    ],
  },

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    config: (md) => {
      vitepressMermaidPreview(md, {
        showToolbar: true,
      });
    },
  },

});
