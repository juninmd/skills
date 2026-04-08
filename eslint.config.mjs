import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

const tsFilePatterns = ['cli/src/**/*.ts', 'apps/docs/src/**/*.ts'];

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      'apps/docs/docs/.vitepress/cache/**',
      'apps/docs/docs/.vitepress/dist/**',
      '.github/plugin/**',
    ],
  },
  {
    files: ['scripts/**/*.mjs', 'apps/docs/server.js', 'apps/docs/src/**/*.{js,mjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-console': 'off',
      'no-unused-vars': 'off',
      'no-empty': 'off',
    },
  },
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: tsFilePatterns,
    languageOptions: {
      ...config.languageOptions,
      globals: {
        ...(config.languageOptions?.globals ?? {}),
        ...globals.node,
      },
    },
    rules: {
      ...(config.rules ?? {}),
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  })),
];
