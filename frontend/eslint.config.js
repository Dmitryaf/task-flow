import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**', '*.d.ts', 'vite.config.ts'],
  },

  ...tseslint.configs.recommended,

  ...pluginVue.configs['flat/recommended'],

  prettierConfig,
  prettierPlugin,

  {
    files: ['**/*.{ts,vue}'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      // ===== ОСНОВНЫЕ =====
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-unused-vars': 'off',
      'prefer-const': 'error',
      'no-var': 'error',

      // ===== TYPESCRIPT =====
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // ===== VUE =====
      'vue/multi-word-component-names': 'off', // Разрешаем однословные имена (Home, Profile)
      'vue/no-v-html': 'warn',
      'vue/require-default-prop': 'off', // Не требуем default для необязательных пропсов
      'vue/html-self-closing': [
        'error',
        {
          html: { void: 'always', normal: 'always' },
          svg: 'always',
          math: 'always',
        },
      ],
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/block-order': [
        'error',
        {
          order: ['script', 'template', 'style'],
        },
      ],
      'vue/no-unused-refs': 'error',
      'vue/no-ref-object-reactivity-loss': 'error',

      // ===== PRETTIER (правило напоминает форматировать) =====
      'prettier/prettier': ['warn', {}, { usePrettierrc: true }],
    },
  },

  {
    files: ['**/*.test.{ts,js}', '**/*.spec.{ts,js}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
    },
  },
);
