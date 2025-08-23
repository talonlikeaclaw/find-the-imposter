import globals from 'globals';
import js from '@eslint/js';

export default [
  // files to ignore entirely
  {
    ignores: [
      '**/node_modules/*', 
      '**/dist/*', 
      '**/build/*', 
      '**/webpack.config.{js,cjs}',
      'eslint.config.mjs',
    ],
  },
  //use recommended rules as a base for all files and then override
  js.configs.recommended,
  //override rules for all files
  {
    languageOptions: {
      globals: {
        ...globals.browser
      },
      sourceType: 'script',
    },
    rules: {
    ////////// Possible Errors //////////
      'no-console': ['warn', { 'allow': ['error'] }],
      'one-var': ['warn', 'never'],
      'no-undef': 'warn',
      'prefer-const': 'warn',
      'no-extra-parens': 'warn',
      'block-scoped-var': 'warn',
      'curly': ['warn', 'multi-line'],
      'no-await-in-loop': 'warn',
      'no-cond-assign': ['error', 'always'],
      'no-debugger': 'warn',
      'default-case': 'warn',
      'dot-location': ['warn', 'object'],
      'eqeqeq': 'warn',
      'no-alert': 'warn',
      'no-eq-null': 'warn',
      'no-eval': 'warn',
      'no-implicit-coercion': 'warn',
      'no-lone-blocks': 'error',
      'no-loop-func': 'warn',
      'no-multi-str': 'warn',
      'no-self-compare': 'warn',
      'strict': ['warn', 'global'],
      'no-lonely-if': 'warn',
      ////////// Style for Graded Submissions //////////
      'camelcase': 'error',
      'no-inline-comments': 'error',
      // other style expectations are handled by Prettier
      // 'array-bracket-spacing': ['error', 'never'], // deprecated, handled by Prettier
      // 'array-bracket-newline': ['error', 'consistent'], // deprecated, handled by Prettier
      // 'indent': ['error', 2], // deprecated, handled by Prettier
      // 'comma-spacing': ['error', { 'before': false, 'after': true }], // deprecated, handled by Prettier
      // 'comma-style': ['error', 'last'], // deprecated, handled by Prettier
      // 'brace-style': ['error'], // deprecated, handled by Prettier
      // 'max-len': ['error', 100], // deprecated, handled by Prettier
      // 'no-tabs': 'error', // deprecated, handled by Prettier
      // 'quotes': ['error', 'single', {'allowTemplateLiterals': true}], // deprecated, handled by Prettier
      // 'jsx-quotes': ['error', 'prefer-double'], // deprecated, handled by Prettier
      // 'space-infix-ops': 'error', // deprecated, handled by Prettier
      // 'space-unary-ops': 'error', // deprecated, handled by Prettier
      // 'semi': 'error', // deprecated, handled by Prettier
      // 'semi-spacing': 'error' // deprecated, handled by Prettier
    }
  },
];