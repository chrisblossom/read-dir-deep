/* @flow */

import fs from 'fs';
import path from 'path';
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

// eslint-disable-next-line flowtype/require-exact-type
type Options = {
    relative?: boolean,
};

async function readDirDeep(startPath: string, options?: Options = {}) {
    const { relative = true } = options;

    const fileList: string[] = [];
    const getFiles = async (dir) => {
        const files = await readDir(dir);

        const pending = files.map(async (file) => {
            const pathname = path.resolve(dir, file);

            const fileStats = await stat(pathname);
            const isDirectory = fileStats.isDirectory();
            if (isDirectory) {
                await getFiles(pathname);

                return;
            }

            const filePath =
                relative === true
                    ? path.relative(startPath, pathname)
                    : pathname;

            fileList.push(filePath);
        });

        await Promise.all(pending);
    };

    await getFiles(startPath);

    // eslint-disable-next-line flowtype/no-mutable-array
    const sortedFileList: string[] = pathSort(fileList);

    return sortedFileList;
}

function readDirDeepSync(startPath: string, options?: Options = {}) {
    const { relative = true } = options;

    const getFiles = (dir: string) => {
        const result = fs.readdirSync(dir).reduce((acc, file) => {
            const pathname = path.resolve(dir, file);

            const isDirectory = fs.statSync(pathname).isDirectory();
            if (isDirectory) {
                const dirList = getFiles(pathname);

                return [...acc, ...dirList];
            }

            const filePath =
                relative === true
                    ? path.relative(startPath, pathname)
                    : pathname;

            return [...acc, filePath];
        }, []);

        return result;
    };

    const fileList = getFiles(startPath);

    const fileListSorted = pathSort(fileList);

    return fileListSorted;
}

readDirDeep.sync = readDirDeepSync;

module.exports = readDirDeep;
