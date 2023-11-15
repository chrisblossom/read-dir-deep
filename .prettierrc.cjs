/**
 * This file is managed by backtrack
 *
 * source: @backtrack/preset-style
 * namespace: prettier
 *
 * DO NOT MODIFY
 */

'use strict';

const { Backtrack } = require('@backtrack/core');

const { configManager, pkg } = new Backtrack();

const packageId = '@backtrack/preset-style';

/** @type {import("prettier").Config} */
const prettier = {
	plugins: [
		pkg.resolve(packageId, 'prettier-plugin-multiline-arrays'),
		pkg.resolve(packageId, 'prettier-plugin-sh'),
	],
	multilineArraysWrapThreshold: 1,
	semi: true,
	tabWidth: 4,
	useTabs: true,
	singleQuote: true,
	trailingComma: 'all',
	arrowParens: 'always',
};

module.exports = configManager({
	namespace: 'prettier',
	config: prettier,
});
