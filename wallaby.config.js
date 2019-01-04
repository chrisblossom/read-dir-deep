/**
 * This file is managed by backtrack
 *
 * source: @backtrack/preset-jest
 * namespace: wallaby
 *
 * DO NOT MODIFY
 */

'use strict';

const Backtrack = require('@backtrack/core');

const { configManager } = new Backtrack();

const wallaby = (wallabyConfig) => {
    /**
     * Needed for monorepo
     */
    process.env.NODE_PATH = require('path').join(
        wallabyConfig.localProjectDir,
        '../../node_modules'
    );

    return configManager({
        namespace: 'wallaby',
        config: {
            files: [
                { pattern: '**/__sandbox__/**/*', instrument: false },
                { pattern: '**/__sandbox__/**/.*', instrument: false },
                { pattern: '.babelrc+(.js|)', instrument: false },
                'src/**/*.js',
                'jest.config.js',
                '.env',
                'src/**/*.snap',
                '!src/**/*.test.js',
            ],

            tests: ['src/**/*.test.js'],

            compilers: {
                '**/*.js': wallabyConfig.compilers.babel(),
            },

            hints: {
                ignoreCoverage: /ignore coverage/,
            },

            env: {
                type: 'node',
                runner: 'node',
            },

            testFramework: 'jest',

            setup: (setupConfig) => {
                /**
                 * link node_modules inside wallaby's temp dir
                 *
                 * https://github.com/wallabyjs/public/issues/1663#issuecomment-389717074
                 */
                const fs = require('fs');
                const path = require('path');
                const realModules = path.join(
                    setupConfig.localProjectDir,
                    'node_modules'
                );
                const linkedModules = path.join(
                    setupConfig.projectCacheDir,
                    'node_modules'
                );

                try {
                    fs.symlinkSync(realModules, linkedModules, 'dir');
                } catch (error) {
                    if (error.code !== 'EEXIST') {
                        throw error;
                    }
                }

                /**
                 * Set to project local path so backtrack can correctly resolve modules
                 * https://github.com/wallabyjs/public/issues/1552#issuecomment-372002860
                 */
                process.chdir(setupConfig.localProjectDir);

                require('@babel/polyfill');
                process.env.NODE_ENV = 'test';
                const jestConfig = require('./jest.config');
                jestConfig.transform = {
                    '__sandbox__.+\\.jsx?$': 'babel-jest',
                };
                setupConfig.testFramework.configure(jestConfig);

                /**
                 * https://github.com/wallabyjs/public/issues/1268#issuecomment-323237993
                 *
                 * reset to expected wallaby process.cwd
                 */
                process.chdir(setupConfig.projectCacheDir);
            },
        },
    });
};

module.exports = wallaby;
