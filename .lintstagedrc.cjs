/**
 * This file is managed by backtrack
 *
 * source: @backtrack/preset-style
 * namespace: lintStaged
 *
 * DO NOT MODIFY
 */

'use strict';

const { Backtrack } = require('@backtrack/core');

const { configManager } = new Backtrack();

const lintStaged = {
	'*': ['prettier --ignore-unknown --write'],
};

module.exports = configManager({
	namespace: 'lintStaged',
	config: lintStaged,
});
