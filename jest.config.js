export default {
    testEnvironment: 'jsdom',
    roots: ['<rootDir>/resources/frontend'],
    testMatch: ['**/__tests__/**/*.test.{ts,tsx}', '**/*.test.{ts,tsx}'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/resources/frontend/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            tsconfig: {
                jsx: 'react-jsx',
                esModuleInterop: true,
            },
        }],
    },
    setupFilesAfterEnv: ['<rootDir>/resources/frontend/__tests__/setup.ts'],
    collectCoverageFrom: [
        'resources/frontend/**/*.{ts,tsx}',
        '!resources/frontend/**/*.d.ts',
        '!resources/frontend/**/*.stories.{ts,tsx}',
        '!resources/frontend/__tests__/**',
        '!resources/frontend/**/*.test.{ts,tsx}',
    ],
    coverageThreshold: {
        global: {
            branches: 30,
            functions: 30,
            lines: 30,
            statements: 30,
        },
    },
};

