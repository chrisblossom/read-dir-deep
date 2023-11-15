/**
 * This file is managed by backtrack
 *
 * source: @backtrack/preset-style
 * namespace: eslint
 *
 * DO NOT MODIFY
 */

'use strict';

const { Backtrack } = require('@backtrack/core');

const { configManager, pkg } = new Backtrack();

const packageId = '@backtrack/preset-style';

const eslint = {
	extends: [pkg.resolve(packageId, '@chrisblossom/eslint-config')],
};

module.exports = configManager({
	namespace: 'eslint',
	config: eslint,
});
