/**
 * This file is managed by backtrack
 *
 * source: @backtrack/preset-node-module
 * namespace: babel
 *
 * DO NOT MODIFY
 */

'use strict';

const Backtrack = require('@backtrack/core');
const nodeVersion = require('@backtrack/preset-node-module/lib/utils/node-version');

const { pkg, configManager } = new Backtrack();

const packageId = '@backtrack/preset-node-module';

const babel = {
    presets: [
        [
            pkg.resolve(packageId, '@babel/preset-env'),
            {
                targets: {
                    node: nodeVersion,
                },
                useBuiltIns: 'entry',
            },
        ],
        pkg.resolve(packageId, '@babel/preset-flow'),
    ],
    plugins: [
        pkg.resolve(packageId, 'babel-plugin-dynamic-import-node'),
        pkg.resolve(packageId, '@babel/plugin-proposal-class-properties'),
        pkg.resolve(packageId, '@babel/plugin-transform-strict-mode'),
    ],
};

module.exports = configManager({
    namespace: 'babel',
    config: babel,
});
