/* @flow */

/* eslint-disable flowtype/require-exact-type,flowtype/no-mutable-array */

import globby from 'globby';
import pathSort from 'path-sort2';

type Options = { patterns?: string[] };

const defaultPatterns = ['.'];
const defaultOptions = {
    deep: true,
    dot: true,
    markDirectories: true,
};

async function readDirDeep(startPath: string, options?: Options = {}) {
    const { patterns = defaultPatterns, ...globbyOptions } = options;

    const fileList = await globby(patterns, {
        cwd: startPath,
        ...defaultOptions,
        ...globbyOptions,
    });

    const fileListSorted = pathSort(fileList, '/');

    return fileListSorted;
}

function readDirDeepSync(startPath: string, options?: Options = {}) {
    const { patterns = defaultPatterns, ...globbyOptions } = options;

    const fileList = globby.sync(patterns, {
        cwd: startPath,
        ...defaultOptions,
        ...globbyOptions,
    });

    const fileListSorted = pathSort(fileList, '/');

    return fileListSorted;
}

readDirDeep.sync = readDirDeepSync;
module.exports = readDirDeep;
