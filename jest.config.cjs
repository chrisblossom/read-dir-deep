/**
 * This file is managed by backtrack
 *
 * source: @backtrack/preset-jest
 * namespace: jest
 *
 * DO NOT MODIFY
 */

'use strict';

const fs = require('fs');
const { Backtrack } = require('@backtrack/core');

const { configManager, pkg } = new Backtrack();

const packageId = '@backtrack/preset-jest';

/**
 * https://jestjs.io/docs/en/configuration
 */
const jest = {
	testEnvironment: 'node',
	collectCoverage: false,
	coveragePathIgnorePatterns: [
		'<rootDir>/(.*/?)__sandbox__',
		'<rootDir>/jest.*.(js|ts|mjs)',
	],
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
	 *
	 * https://jestjs.io/docs/en/configuration#resetmocks-boolean
	 */
	resetMocks: true,

	/**
	 *  The module registry for every test file will be reset before running each individual test.
	 *  This is useful to isolate modules for every test so that local module state doesn't conflict between tests.
	 *
	 *  https://jestjs.io/docs/en/configuration#resetmodules-boolean
	 */
	resetModules: true,

	/**
	 * Equivalent to calling jest.restoreAllMocks() between each test.
	 *
	 * Resets jest.spyOn mocks only
	 *
	 * https://jestjs.io/docs/en/configuration#restoremocks-boolean
	 */
	restoreMocks: true,
};

function getFile(file) {
	const jsFile = `${file}.js`;
	const jsFileExists = fs.existsSync(jsFile);

	if (jsFileExists) {
		return jsFile;
	}

	const tsFile = `${file}.ts`;
	const tsFileExists = fs.existsSync(tsFile);

	if (tsFileExists) {
		return tsFile;
	}

	return null;
}

/**
 * globalSetup: ran once before all tests
 *
 * https://jestjs.io/docs/en/configuration#globalsetup-string
 */
const globalSetup = getFile('jest.global-setup');
if (globalSetup !== null) {
	jest.globalSetup = `<rootDir>/${globalSetup}`;
}

/**
 * setupFiles: ran once per test file before all tests
 *
 * https://jestjs.io/docs/en/configuration#setupfiles-array
 */
const setupFiles = getFile('jest.setup-test-file');
if (setupFiles !== null) {
	jest.setupFiles = [`<rootDir>/${setupFiles}`];
}

/**
 * setupFilesAfterEnv: ran before each test
 *
 * https://jestjs.io/docs/en/configuration#setupfilesafterenv-array
 */
const setupFilesAfterEnv = getFile('jest.setup-test');
if (setupFilesAfterEnv !== null) {
	jest.setupFilesAfterEnv = [`<rootDir>/${setupFilesAfterEnv}`];
}

/**
 * globalTeardown: ran once after all tests
 *
 * https://jestjs.io/docs/en/configuration#globalteardown-string
 */
const globalTeardown = getFile('jest.global-teardown');
if (globalTeardown !== null) {
	jest.globalTeardown = `<rootDir>/${globalTeardown}`;
}

module.exports = configManager({
	namespace: 'jest',
	config: jest,
});
