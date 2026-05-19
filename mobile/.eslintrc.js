module.exports = {
  root: true,
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      extends: [
        'prettier',
        'plugin:prettier/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'eslint:recommended',
        '@react-native',
        'plugin:@typescript-eslint/recommended',
      ],
      parserOptions: {
        ecmaVersion: 2020,
        project: 'tsconfig.json',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      plugins: ['@typescript-eslint', 'prettier', 'import', 'deprecation', 'react', 'react-native'],
      rules: {
        // TypeScript specific rules
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': ['error'],
        '@typescript-eslint/prefer-optional-chain': 'error',
        '@typescript-eslint/no-redundant-type-constituents': 'error',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unused-vars': ['warn', { ignoreRestSiblings: true }],
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/unbound-method': 'off',

        // Import rules (disabled until path mapping is configured)
        'import/no-unresolved': 'off',

        // General rules
        radix: ['warn', 'as-needed'],
        'no-console': 'error',
        'no-unneeded-ternary': ['error', { defaultAssignment: false }],
        'no-unused-expressions': ['error', { enforceForJSX: true }],
        'no-unsafe-optional-chaining': 'error',

        // React rules
        'react/jsx-boolean-value': ['warn', 'never'],
        'react/prop-types': 'off',
        'react/display-name': 'off',
        'react/no-unstable-nested-components': ['error'],
        'react/jsx-handler-names': 'warn',
        'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
        'react/jsx-no-constructed-context-values': 'error',
        'react/no-array-index-key': 'warn',

        // React Native rules
        'react-native/no-inline-styles': 'off',

        // Deprecation warnings
        'deprecation/deprecation': 'warn',
      },
      settings: {
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        react: {
          version: 'detect',
        },
      },
    },
    {
      files: ['*.js', '*.jsx'],
      extends: [
        'prettier',
        'plugin:prettier/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'eslint:recommended',
        '@react-native',
      ],
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      plugins: ['prettier', 'react', 'react-native'],
      rules: {
        // React rules
        'react/jsx-boolean-value': ['warn', 'never'],
        'react/prop-types': 'off',
        'react/display-name': 'off',
        'react/no-unstable-nested-components': ['error'],
        'react/jsx-handler-names': 'warn',
        'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
        'react/jsx-no-constructed-context-values': 'error',
        'react/no-array-index-key': 'warn',

        // React Native rules
        'react-native/no-inline-styles': 'off',

        // General rules
        'no-console': 'error',
        'no-unneeded-ternary': ['error', { defaultAssignment: false }],
        'no-unused-expressions': ['error', { enforceForJSX: true }],
        'no-unsafe-optional-chaining': 'error',
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
    },
    {
      files: ['*.story.ts*'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
};
