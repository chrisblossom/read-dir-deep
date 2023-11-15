/**
 * This file is managed by backtrack
 *
 * source: @backtrack/preset-node
 * namespace: babel
 *
 * DO NOT MODIFY
 */

'use strict';

const { Backtrack } = require('@backtrack/core');
const nodeVersion = require('@backtrack/preset-node/lib/utils/node-version');

const { pkg, configManager } = new Backtrack();

const backtrackId = '@backtrack/preset-node';

const babel = {
	presets: [
		[
			pkg.resolve(backtrackId, '@babel/preset-env'),
			{
				targets: {
					node: nodeVersion,
				},
			},
		],
	],
	plugins: [
		pkg.resolve(backtrackId, 'babel-plugin-dynamic-import-node'),
		pkg.resolve(backtrackId, '@babel/plugin-transform-strict-mode'),
	],
};

module.exports = configManager({
	namespace: 'babel',
	config: babel,
});
