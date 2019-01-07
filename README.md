# read-dir-deep

[![npm](https://img.shields.io/npm/v/read-dir-deep.svg?label=npm%20version)](https://www.npmjs.com/package/read-dir-deep)
[![Linux Build Status](https://img.shields.io/circleci/project/github/chrisblossom/read-dir-deep/master.svg?label=linux%20build)](https://circleci.com/gh/chrisblossom/read-dir-deep/tree/master)
[![Windows Build Status](https://img.shields.io/appveyor/ci/chrisblossom/read-dir-deep/master.svg?label=windows%20build)](https://ci.appveyor.com/project/chrisblossom/read-dir-deep/branch/master)
[![Code Coverage](https://img.shields.io/codecov/c/github/chrisblossom/read-dir-deep/master.svg)](https://codecov.io/gh/chrisblossom/read-dir-deep/branch/master)

## About

Returns a sorted recursive list of all files inside a directory.

## Installation

`npm install --save read-dir-deep`

## Usage

```js
const readDirDeep = require('read-dir-deep');

const dir = './fake/dir';

// async
const files = await readDirDeep(dir);

// sync
const files = readDirDeep.sync(dir);

console.log(files);
// [
//     'a/b/c.js',
//     'a.js',
//     'b/a.js',
//     'b.js',
// ]
```

## Options

```js
const files = await readDirDeep(dir, {
    /**
     * Return full file paths
     */
    absolute: true,

    /**
     * Custom file matching
     *
     * See [globby#patterns](https://github.com/sindresorhus/globby#patterns)
     *
     * default: ['.']
     */
    patterns: ['.', '!**/*.test.js'],

    /**
     * Exclude files/folders
     *
     * default: []
     */
    ignore: [
        '**/.DS_Store',
        '**/node_modules/**',
        '**/.git/**',
        '**/.vscode/**',
        '**/.idea/**',
    ],

    /**
     * See [Globby Options](https://github.com/sindresorhus/globby#options)
     * for additional options
     */
});
```
