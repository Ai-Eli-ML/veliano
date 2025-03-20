module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    // Global rules that apply to all files
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    'react/no-unescaped-entities': 'error',
    '@next/next/no-img-element': 'warn',
  },
  overrides: [
    {
      // Phase 2 files - Supabase integration
      files: [
        'lib/supabase/**/*',
        'app/api/auth/**/*',
        'components/auth/**/*',
        'types/supabase.ts',
      ],
      rules: {
        '@typescript-eslint/no-unused-vars': 'warn', // Downgrade to warning
        '@typescript-eslint/no-explicit-any': 'warn', // Downgrade to warning
      },
    },
    {
      // Phase 1 files - Current functionality
      files: [
        'app/**/*',
        'components/**/*',
        'lib/**/*',
      ],
      excludedFiles: [
        'app/api/auth/**/*',
        'components/auth/**/*',
        'lib/supabase/**/*',
      ],
      rules: {
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
        'react/no-unescaped-entities': 'error',
        '@next/next/no-img-element': 'warn',
      },
    },
  ],
  ignorePatterns: [
    'node_modules/',
    '.next/',
    'out/',
    'public/',
    '*.config.js',
  ],
} 