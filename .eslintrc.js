const path = require('path');

module.exports = {
  extends: ['expo', 'prettier', 'plugin:tailwindcss/recommended'],
  plugins: ['unicorn', 'unused-imports', 'simple-import-sort'],
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
    'max-lines-per-function': ['error', 70], // Don't be rude to write unreadable long function
    'react/display-name': 'off',
    'react/no-inline-styles': 'off',
    'react/destructuring-assignment': 'off', // Vscode doesn't support automatically destructuring, it's a pain to add a new variable
    'react/require-default-props': 'off', // Allow non-defined react props as undefined
    'import/prefer-default-export': 'off', // Named export is easier to refactor automatically
    'import/no-cycle': ['error', { maxDepth: '∞' }],
    'simple-import-sort/imports': 'error', // Import configuration for `eslint-plugin-simple-import-sort`
    'simple-import-sort/exports': 'error', // Export configuration for `eslint-plugin-simple-import-sort`
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
  },
  overrides: [
    // Configuration for  translations files (i18next)
    {
      files: ['src/translations/*.json'],
      extends: ['plugin:i18n-json/recommended'],
      rules: {
        'i18n-json/valid-message-syntax': [
          2,
          {
            syntax: path.resolve('./scripts/i18next-syntax-validation.js'),
          },
        ],
        'i18n-json/valid-json': 2,
        'i18n-json/sorted-keys': [
          2,
          {
            order: 'asc',
            indentSpaces: 2,
          },
        ],
        'i18n-json/identical-keys': [
          2,
          {
            filePath: path.resolve('./src/translations/en-us.json'),
          },
        ],
        'prettier/prettier': [
          0,
          {
            singleQuote: true,
            endOfLine: 'auto',
          },
        ],
      },
    },
  ],
};
