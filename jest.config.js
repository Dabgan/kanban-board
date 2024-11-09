const nextJest = require('next/jest');

const createJestConfig = nextJest({
    dir: './',
});

/** @type {import('jest').Config} */
const config = {
    clearMocks: true,
    coverageProvider: 'v8',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    testMatch: ['**/__tests__/**/*.test.[jt]sx', '**/?(*.)+(spec|test).[jt]sx'],
};

module.exports = createJestConfig(config);
