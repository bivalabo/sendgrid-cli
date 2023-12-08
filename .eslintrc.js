module.exports = {
  extends: [
    'standard'
  ],
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
    camelcase: ['error', { allow: ['^UNSAFE_'], properties: 'never', ignoreGlobals: true, ignoreImports: true }],
    'no-undef': 'off',
    'no-unused-vars': 'off',
    'no-use-before-define': 'off',
    'padding-line-between-statements': [
      'warn',
      { blankLine: 'always', prev: '*', next: 'multiline-block-like' },
      { blankLine: 'always', prev: 'multiline-block-like', next: '*' }
    ],
    '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
    '@typescript-eslint/no-use-before-define': ['error', { functions: false, variables: false }],
    'import/no-anonymous-default-export': 'off'
  }
}
