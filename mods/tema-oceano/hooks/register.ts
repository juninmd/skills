import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// Cool slate-blue grays with a teal accent; dark is the deep sea, light is sea foam.
const { theme, problems } = makeColors({
  label: 'Oceano',
  roles: { accent: '#1f9e9a', danger: '#c8483f', success: '#4a9a5c', warning: '#c9922a', pro: '#7a68c4' },
  light: {
    gray: {
      anchors: {
        'surface-0': '#e3ebef',
        'surface-1': '#eaf1f4',
        'surface-2': '#f4f8fa',
        'text-primary': '#14232c',
        'text-secondary': '#34505e',
        'text-muted': '#4d6674',
      },
    },
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0d1a22',
        'surface-1': '#13232d',
        'surface-2': '#192c38',
        'surface-3': '#1f3441',
        'text-primary': '#e4eef2',
        'text-secondary': '#b8cbd4',
        'text-muted': '#8fa7b3',
      },
    },
  },
})

const LOOK: ThemeSetArgs = { colors: theme }

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }
    const set = await $.theme.set(LOOK)

    if (!set.isDrawn) {
      $.ui.status(set.reason)
    }

    return next(e)
  })
}
