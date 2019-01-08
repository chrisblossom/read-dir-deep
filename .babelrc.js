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
const getPackageId = require('@backtrack/preset-node-module/lib/utils/get-package-id');

const { pkg, configManager } = new Backtrack();

const packageId = getPackageId();
const backtrackId = '@backtrack/preset-node-module';

const babel = {
    presets: [
        [
            pkg.resolve(backtrackId, '@babel/preset-env'),
            {
                targets: {
                    node: nodeVersion,
                },
                useBuiltIns: 'entry',
            },
        ],
    ],
    plugins: [
        pkg.resolve(backtrackId, 'babel-plugin-dynamic-import-node'),
        pkg.resolve(backtrackId, '@babel/plugin-proposal-class-properties'),
        pkg.resolve(backtrackId, '@babel/plugin-transform-strict-mode'),
    ],
    overrides: [
        {
            test: [`./src/${packageId}.js`, `./src/${packageId}.ts`],
            plugins: [
                pkg.resolve(backtrackId, 'babel-plugin-add-module-exports'),
            ],
        },
    ],
};

module.exports = configManager({
    namespace: 'babel',
    config: babel,
});
