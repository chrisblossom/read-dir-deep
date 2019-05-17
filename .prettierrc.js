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

const { configManager } = new Backtrack();

const prettier = {
    semi: true,
    tabWidth: 4,
    singleQuote: true,
    trailingComma: 'all',
    arrowParens: 'always',
};

module.exports = configManager({
    namespace: 'prettier',
    config: prettier,
});
