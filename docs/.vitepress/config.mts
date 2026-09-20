import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Agent Plugins',
  description: 'Skills and agents for AI coding assistants',
  cleanUrls: true,
  lastUpdated: true,

  head: [
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
  ],

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/getting-started' },
      {
        text: 'Reference',
        items: [
          { text: 'Agents', link: '/agents/' },
          { text: 'Skills', link: '/skills/' },
        ],
      },
      { text: 'GitHub', link: 'https://github.com/juninmd/skills' },
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'What is this?', link: '/' },
          { text: 'Getting Started', link: '/getting-started' },
        ],
      },
      {
        text: 'Agents',
        collapsed: false,
        items: [
          { text: 'Overview', link: '/agents/' },
          { text: 'Code Reviewer', link: '/agents/code-reviewer' },
          { text: 'Principal Engineer', link: '/agents/principal-engineer' },
          { text: 'DevOps Engineer', link: '/agents/devops-engineer' },
          { text: 'Plan Specialist', link: '/agents/plan-specialist' },
        ],
      },
      {
        text: 'Skills',
        collapsed: false,
        items: [
          { text: 'Overview', link: '/skills/' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/juninmd/skills' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025 Antonio Junior',
    },

    search: {
      provider: 'local',
    },

    editLink: {
      pattern: 'https://github.com/juninmd/skills/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },
  },
})
