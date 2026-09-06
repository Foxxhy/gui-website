import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const customJestConfig = {
    displayName: 'gui-website',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^server-only$': '<rootDir>/test/mocks/server-only.ts',
        '^marked$': '<rootDir>/test/mocks/marked.ts',
        '^sanitize-html$': '<rootDir>/test/mocks/sanitize-html.ts',
    },
    testMatch: ['<rootDir>/src/**/*.spec.ts', '<rootDir>/src/**/*.spec.tsx'],
}

export default createJestConfig(customJestConfig)
