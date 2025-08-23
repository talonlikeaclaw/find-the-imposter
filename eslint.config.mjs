import globals from 'globals';
import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';

export default [
  // files to ignore entirely
  {
    ignores: [
      '**/node_modules/*',
      '**/dist/*',
      '**/build/*',
      '**/webpack.config.{js,cjs}',
      'eslint.config.mjs'
    ]
  },
  //use recommended rules as a base for all files and then override
  js.configs.recommended,
  //override rules for all files
  {
    plugins: {
      '@stylistic': stylistic
    },
    languageOptions: {
      globals: {
        ...globals.browser
      },
      sourceType: 'script'
    },
    rules: {
      ////////// Possible Errors //////////
      'no-console': ['warn', {allow: ['error']}],
      'one-var': ['warn', 'never'],
      'no-undef': 'warn',
      'prefer-const': 'warn',
      'no-extra-parens': 'warn',
      'block-scoped-var': 'warn',
      curly: ['warn', 'multi-line'],
      'no-await-in-loop': 'warn',
      'no-cond-assign': ['error', 'always'],
      'no-debugger': 'warn',
      'default-case': 'warn',
      eqeqeq: 'warn',
      'no-alert': 'warn',
      'no-eq-null': 'warn',
      'no-eval': 'warn',
      'no-implicit-coercion': 'warn',
      'no-lone-blocks': 'error',
      'no-loop-func': 'warn',
      'no-multi-str': 'warn',
      'no-self-compare': 'warn',
      strict: ['warn', 'global'],
      'no-lonely-if': 'warn',
      ////////// Style for Graded Submissions //////////
      camelcase: 'error',
      'no-inline-comments': 'error',
      // To fix style formatting, run
      // npx prettier --write .
      // and/or
      // npx eslint --fix .
      '@stylistic/array-bracket-spacing': ['error', 'never'],
      '@stylistic/array-bracket-newline': ['error', 'consistent'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/comma-spacing': ['error', {before: false, after: true}],
      '@stylistic/comma-style': ['error', 'last'],
      '@stylistic/brace-style': ['error'],
      '@stylistic/max-len': ['error', 100],
      '@stylistic/no-tabs': 'error',
      '@stylistic/quotes': [
        'error',
        'single',
        {allowTemplateLiterals: 'always'}
      ],
      '@stylistic/jsx-quotes': ['error', 'prefer-double'],
      '@stylistic/space-infix-ops': 'error',
      '@stylistic/space-unary-ops': 'error',
      '@stylistic/semi': 'error',
      '@stylistic/semi-spacing': 'error'
    }
  }
];
