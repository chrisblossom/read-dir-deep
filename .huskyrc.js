/**
 * This file is managed by backtrack
 *
 * source: @backtrack/preset-git-hooks
 * namespace: husky
 *
 * DO NOT MODIFY
 */

'use strict';

const { Backtrack } = require('@backtrack/core');

const { configManager } = new Backtrack();

const husky = {
    hooks: {
        'pre-commit': 'npm run git-pre-commit',
        'pre-push': 'npm run git-pre-push',
    },
};

module.exports = configManager({
    namespace: 'husky',
    config: husky,
});
