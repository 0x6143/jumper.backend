// @ts-check
/* eslint-disable */
const eslint = require('@eslint/js')
const tseslint = require('typescript-eslint')
const prettierConfig = require('eslint-config-prettier')

module.exports = tseslint.config(eslint.configs.recommended, ...tseslint.configs.recommended, prettierConfig, {
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
  },
})
