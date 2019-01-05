# read-dir-deep

[![npm](https://img.shields.io/npm/v/read-dir-deep.svg?label=npm%20version)](https://www.npmjs.com/package/read-dir-deep)
[![Linux Build Status](https://img.shields.io/circleci/project/github/chrisblossom/read-dir-deep/master.svg?label=linux%20build)](https://circleci.com/gh/chrisblossom/read-dir-deep/tree/master)
[![Windows Build Status](https://img.shields.io/appveyor/ci/chrisblossom/read-dir-deep/master.svg?label=windows%20build)](https://ci.appveyor.com/project/chrisblossom/read-dir-deep/branch/master)
[![Code Coverage](https://img.shields.io/codecov/c/github/chrisblossom/read-dir-deep/master.svg)](https://codecov.io/gh/chrisblossom/read-dir-deep/branch/master)

## About

Returns a recursive list of all files inside a directory.

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

// files = [
//    'a.js',
//    'b.js',
//    'nested/a.js',
//    'nested-other/b/c.js',
// ];
```

## Options

```js
const files = await readDirDeep(dir, {
    /**
     * Return full file paths
     */
    relative: false,
});
```
