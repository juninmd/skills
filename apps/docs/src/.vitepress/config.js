import { defineConfig } from 'vitepress';
import { sidebar } from './sidebar.js';
import { vitepressMermaidPreview } from 'vitepress-mermaid-preview';

export default defineConfig({
  title: 'Luizalabs Catalog',
  description: 'Catalog of Agents, Skills & Workflows for Copilot',
  cleanUrls: true,
  ignoreDeadLinks: true,

  head: [
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    ['meta', { property: 'og:title', content: 'Luizalabs Catalog' }],
    ['meta', { property: 'og:description', content: 'Catalog of Agents, Skills & Workflows for Copilot' }],
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
          { text: 'Workflows', link: '/workflows/' }
        ]
      },
      { text: 'Deploy', link: '/deploy/' }
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
