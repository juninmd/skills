import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Agent Plugins',
  description: 'Skills, agents, prompts and rules for AI coding assistants',
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
          { text: 'Prompts', link: '/prompts/' },
          { text: 'Rules', link: '/rules/' },
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
          { text: 'Backend', link: '/skills/backend' },
          { text: 'Frontend', link: '/skills/frontend' },
          { text: 'Mobile', link: '/skills/mobile' },
          { text: 'Infrastructure', link: '/skills/infrastructure' },
          { text: 'Code Quality', link: '/skills/code-quality' },
          { text: 'Architecture', link: '/skills/architecture' },
          { text: 'Build & Testing', link: '/skills/build-testing' },
          { text: 'Database', link: '/skills/database' },
          { text: 'Git & Workflow', link: '/skills/git-workflow' },
          { text: 'Research', link: '/skills/research' },
          { text: 'Specialized', link: '/skills/specialized' },
        ],
      },
      {
        text: 'Prompts',
        collapsed: false,
        items: [
          { text: 'Overview', link: '/prompts/' },
        ],
      },
      {
        text: 'Rules',
        collapsed: false,
        items: [
          { text: 'Overview', link: '/rules/' },
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
