import {createRequire} from 'node:module';

const config = {
  testEnvironment: '<rootDir>/test/env/environment.mjs',
  setupFilesAfterEnv: ['<rootDir>/test/env/setup.ts'],
  testMatch: ['<rootDir>/src/**/*.spec.tsx'],
  moduleNameMapper: {
    '^@sentry/scraps$': '<rootDir>/src/index.ts',
    '^@sentry/scraps/(.*)$': '<rootDir>/src/$1',
    '^@yak/react/context$': '<rootDir>/src/theme/yakContext.tsx',
  },
  transform: {
    '^.+\\.[jt]sx?$': [
      '<rootDir>/../../../tests/js/jestYakTransform.mjs',
      {
        jsc: {
          target: 'es2022',
          parser: {syntax: 'typescript', tsx: true},
          transform: {
            react: {runtime: 'automatic', importSource: '@emotion/react'},
          },
          experimental: {
            plugins: [
              [
                createRequire(import.meta.resolve('@yak/react')).resolve('@yak/swc'),
                {
                  basePath: import.meta.dirname,
                  importMode: {value: 'data:text/css;base64,', encoding: 'Base64'},
                },
              ],
            ],
          },
        },
      },
    ],
  },
  // @yak/react ships ES modules.
  transformIgnorePatterns: ['/node_modules/.pnpm/(?!@yak\\+react)'],
  clearMocks: true,
};

export default config;
