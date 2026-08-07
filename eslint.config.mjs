import prettier from 'eslint-config-prettier';

export default [
  // 1. Node-side files: build script (ESM since project is "type": "module")
  {
    files: ['build.js', 'tests/**/*.js', '*.test.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        require: 'readonly',
        Buffer: 'readonly',
      },
    },
    rules: {
      'no-undef': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-redeclare': 'error',
      'no-duplicate-case': 'error',
      'no-empty': 'error',
      'no-constant-condition': 'warn',
      'no-console': 'off',
    },
  },

  // 2. Browser-side JS files
  {
    files: ['js/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: {
        // Browser globals used by the codebase
        document: 'readonly',
        window: 'readonly',
        console: 'readonly',
        fetch: 'readonly',
        URLSearchParams: 'readonly',
        FormData: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        sessionStorage: 'readonly',
        localStorage: 'readonly',
        // Generated mirror — declared in js/packages-data.js, used elsewhere
        SAMYATI_PACKAGES: 'readonly',
        module: 'readonly',
        exports: 'readonly',
      },
    },
    rules: {
      'no-undef': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-redeclare': 'error',
      'no-empty': 'error',
      'no-console': 'off',
    },
  },

  // 2a. js/packages-data.js is auto-generated and re-declares SAMYATI_PACKAGES.
  // Don't enforce no-redeclare there.
  {
    files: ['js/packages-data.js'],
    rules: {
      'no-redeclare': 'off',
    },
  },

  // 3. Prettier integration — must come last to disable conflicting format rules
  prettier,
];