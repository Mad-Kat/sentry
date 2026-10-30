import {createRequire} from 'node:module';

import {runOnFirstShard} from '../../../scripts/jestSingleShard.js';

const config = {
  testEnvironment: '<rootDir>/test/env/environment.mjs',
  setupFilesAfterEnv: ['<rootDir>/test/env/setup.ts'],
  testMatch: ['<rootDir>/src/**/*.spec.{ts,tsx}'],
  moduleNameMapper: {
    '^@sentry/scraps/(.*)$': '<rootDir>/src/$1',
    '^data:text/css': '<rootDir>/test/env/styleMock.cjs',
    '^@yak/react/context$': '<rootDir>/src/theme/yakContext.tsx',
  },
  transform: {
    '^.+\\.[jt]sx?$': [
      '@swc/jest',
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

export default runOnFirstShard(config);
