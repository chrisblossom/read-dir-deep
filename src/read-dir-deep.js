/* @flow */

/* eslint-disable flowtype/require-exact-type,flowtype/no-mutable-array */

import fs from 'fs';
import globby from 'globby';
import pathSort from 'path-sort2';

function readDir(pathname) {
    return new Promise((resolve, reject) => {
        fs.readdir(pathname, (error, files) => {
            if (error) {
                reject(error);

                return;
            }

            resolve(files);
        });
    });
}

function stat(pathname) {
    return new Promise((resolve, reject) => {
        fs.stat(pathname, (error, stats) => {
            if (error) {
                reject(error);

                return;
            }

            resolve(stats);
        });
    });
}

type Options = { patterns?: string[] };

const defaultPatterns = ['.'];
const defaultOptions = {
    deep: true,
    dot: true,
    markDirectories: true,
};

async function readDirDeep(startPath: string, options?: Options = {}) {
    const { patterns = defaultPatterns, ...globbyOptions } = options;

    const fileStats = await stat(startPath);
    const isDirectory = fileStats.isDirectory();
    if (isDirectory === false) {
        // will throw ENOTDIR
        await readDir(startPath);
    }

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

    const isDirectory = fs.statSync(startPath).isDirectory();
    if (isDirectory === false) {
        // will throw ENOTDIR
        fs.readdirSync(startPath);
    }

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
