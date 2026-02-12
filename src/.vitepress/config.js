import { defineConfig } from 'vitepress';
import { sidebar } from './sidebar.js';

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

  themeConfig: {
    logo: '/logo.png',
    siteTitle: 'Luizalabs Catalog',

    nav: [
      { text: 'Início', link: '/' },
      { text: 'Agentes', link: '/agents/' },
      { text: 'Skills', link: '/skills/' },
      { text: 'Regras', link: '/rules/' },
      { text: 'Hooks', link: '/hooks/' },
      { text: 'Workflows', link: '/workflows/' },
      { text: 'Instruções de Deploy', link: '/deploy/' },
      {
        text: 'Integração',
        items: [
          { text: 'GitHub Copilot', link: '/integration/copilot' },
          { text: 'Antigravity', link: '/integration/antigravity' },
          { text: 'Gemini CLI', link: '/integration/gemini' }
        ]
      }
    ],

    sidebar: sidebar,

    socialLinks: [
      { icon: 'github', link: 'https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents' },
      { icon: 'twitter', link: 'https://twitter.com/luizalabs' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-2025 Luizalabs · Magalu'
    }
  },

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    }
  }
});
