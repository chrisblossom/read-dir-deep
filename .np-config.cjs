/**
 * This file is managed by backtrack
 *
 * source: @backtrack/preset-node
 * namespace: np
 *
 * DO NOT MODIFY
 */

'use strict';

const { Backtrack } = require('@backtrack/core');

const { configManager } = new Backtrack();

const np = {
	yarn: false,
};

module.exports = configManager({
	namespace: 'np',
	config: np,
});
