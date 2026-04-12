import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/src/setupTests.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: { jsx: 'react-jsx' } }],
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/src/__mocks__/fileMock.js',
    '^components/(.*)$': '<rootDir>/src/components/$1',
    '^pages/(.*)$': '<rootDir>/src/pages/$1',
    '^hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^store/(.*)$': '<rootDir>/src/store/$1',
    '^utils/(.*)$': '<rootDir>/src/utils/$1',
    '^api/(.*)$': '<rootDir>/src/api/$1',
    '^types/(.*)$': '<rootDir>/src/types/$1',
    '^modules/(.*)$': '<rootDir>/src/modules/$1',
    '^hocs/(.*)$': '<rootDir>/src/hocs/$1',
    '^services/(.*)$': '<rootDir>/src/services/$1',
    '^intl/(.*)$': '<rootDir>/src/intl/$1',
    '^config$': '<rootDir>/src/config',
    '^constants$': '<rootDir>/src/constants',
    '^MuiThemeProvider$': '<rootDir>/src/MuiThemeProvider',
  },
  globals: {
    'import.meta': {
      env: {
        VITE_ENVIRONMENT: 'test',
        VITE_APP_VERSION: 'test',
        VITE_FIREBASE_API_KEY: 'test',
        VITE_FIREBASE_PROJECT_ID: 'test',
        VITE_FIREBASE_MESSAGING_SENDER_ID: 'test',
        VITE_FIREBASE_APP_ID: 'test',
        VITE_FIREBASE_MEASUREMENT_ID: 'test',
        VITE_API_GATEWAY: 'http://localhost',
      },
    },
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/api/**/*.{js,jsx,ts,tsx}',
    '!src/types/**/*.{js,jsx,ts,tsx}',
    '!src/intl/**/*.{js,jsx,ts,tsx}',
    '!src/App.tsx',
    '!src/Providers.tsx',
    '!src/Routing.tsx',
    '!src/index.tsx',
    '!src/reportWebVitals.ts',
    '!src/MuiThemeProvider.tsx',
  ],
  transformIgnorePatterns: ['node_modules/(?!axios)'],
}

export default config
