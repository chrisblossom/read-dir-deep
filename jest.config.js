/**
 * This file is managed by backtrack
 *
 * source: @backtrack/preset-jest
 * namespace: jest
 *
 * DO NOT MODIFY
 */

'use strict';

const Backtrack = require('@backtrack/core');

const { configManager, pkg } = new Backtrack();

const packageId = '@backtrack/preset-jest';

/**
 * https://facebook.github.io/jest/docs/configuration.html#options
 */
const jest = {
    moduleDirectories: ['node_modules'],
    testEnvironment: 'node',
    collectCoverage: false,
    coveragePathIgnorePatterns: ['<rootDir>/(.*/?)__sandbox__'],
    testPathIgnorePatterns: ['<rootDir>/(.*/?)__sandbox__'],
    snapshotSerializers: [
        pkg.resolve(packageId, 'jest-serializer-path'),
        pkg.resolve(packageId, 'jest-snapshot-serializer-function-name'),
    ],

    /**
     * Automatically reset mock state between every test.
     * Equivalent to calling jest.resetAllMocks() between each test.
     *
     * Sane default with resetModules: true because mocks need to be inside beforeEach
     * for them to work correctly
     */
    resetMocks: true,

    /**
     *  The module registry for every test file will be reset before running each individual test.
     *  This is useful to isolate modules for every test so that local module state doesn't conflict between tests.
     */
    resetModules: true,

    /**
     * Equivalent to calling jest.restoreAllMocks() between each test.
     *
     * Resets jest.spyOn mocks only
     */
    restoreMocks: true,
};

module.exports = configManager({
    namespace: 'jest',
    config: jest,
});
