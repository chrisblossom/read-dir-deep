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

const { configManager, pkg } = new Backtrack();

const packageId = '@backtrack/preset-node-module';

const babel = {
    presets: [
        [
            pkg.resolve(packageId, 'babel-preset-env'),
            {
                targets: {
                    node: '6.9.0',
                },
                useBuiltIns: true,
            },
        ],
        pkg.resolve(packageId, 'babel-preset-flow'),
    ],
    plugins: [
        pkg.resolve(packageId, 'babel-plugin-dynamic-import-node'),
        pkg.resolve(packageId, 'babel-plugin-transform-object-rest-spread'),
        [
            pkg.resolve(packageId, 'babel-plugin-transform-class-properties'),
            { spec: true },
        ],
    ],
};

module.exports = configManager({
    namespace: 'babel',
    config: babel,
});
