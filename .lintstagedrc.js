/**
 * This file is managed by backtrack
 *
 * source: @backtrack/preset-style
 * namespace: lintStaged
 *
 * DO NOT MODIFY
 */

'use strict';

const Backtrack = require('@backtrack/core');

const { configManager } = new Backtrack();

const lintStaged = {
    '*.{js,mjs,jsx,ts,tsx,json,scss,less,css,md,yml,yaml}': [
        'prettier --write',
        'git add',
    ],
};

module.exports = configManager({
    namespace: 'lintStaged',
    config: lintStaged,
});
