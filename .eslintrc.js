module.exports = {
  extends: [
    'expo',
    'prettier',
    'plugin:tailwindcss/recommended',
    'plugin:drizzle/all',
  ],
  plugins: [
    'unicorn',
    'unused-imports',
    'tailwindcss',
    'drizzle',
    '@tanstack/query',
    'simple-import-sort',
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'unicorn/filename-case': [
      'error',
      {
        case: 'kebabCase',
        ignore: ['/android', '/ios'],
      },
    ],
    'unicorn/throw-new-error': 'error',
    'unicorn/prefer-ternary': ['error', 'only-single-line'],
    'unicorn/explicit-length-check': 'error',
    'unicorn/no-for-loop': 'error', // there is no reason to use traditional for loop anymore in this modern world
    'unicorn/no-await-in-promise-methods': 'error',
    'unicorn/prefer-date-now': 'error',
    'max-params': ['error', 3], // Limit the number of parameters in a function to use object instead
    'max-lines-per-function': ['error', 150], // Don't be rude to write unreadable long function
    'react/display-name': 'off',
    'react/no-inline-styles': 'off',
    'react/destructuring-assignment': 'off', // Vscode doesn't support automatically destructuring, it's a pain to add a new variable
    'react/require-default-props': 'off', // Allow non-defined react props as undefined
    'import/prefer-default-export': 'off', // Named export is easier to refactor automatically
    'import/no-cycle': ['error', { maxDepth: '∞' }],
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    'tailwindcss/no-custom-classname': 'off',
    'tailwindcss/classnames-order': 'error',
    'tailwindcss/enforces-shorthand': 'error',
    '@tanstack/query/exhaustive-deps': 'warn',
    '@tanstack/query/no-rest-destructuring': 'error',
    '@tanstack/query/stable-query-client': 'error',
    'simple-import-sort/imports': 'error', // Import configuration for `eslint-plugin-simple-import-sort`
    'simple-import-sort/exports': 'error', // Export configuration for `eslint-plugin-simple-import-sort`
  },
  overrides: [
    {
      // Configuration for testing files
      files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
      extends: ['plugin:testing-library/react'],
    },
  ],
};
