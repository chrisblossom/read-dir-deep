/* @flow */

import fs from 'fs';
import path from 'path';

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

async function readDirDeep(startPath: string) {
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

            const relativePath = path.relative(startPath, pathname);

            fileList.push(relativePath);
        });

        await Promise.all(pending);
    };

    await getFiles(startPath);

    // eslint-disable-next-line flowtype/no-mutable-array
    const sortedFileList: string[] = fileList.sort();

    return sortedFileList;
}

function readDirDeepSync(startPath: string) {
    const getFiles = (dir: string) => {
        const result = fs.readdirSync(dir).reduce((acc, file) => {
            const pathname = path.resolve(dir, file);

            const isDirectory = fs.statSync(pathname).isDirectory();
            if (isDirectory) {
                const dirList = getFiles(pathname);

                return [...acc, ...dirList];
            }

            const relativePath = path.relative(startPath, pathname);
            return [...acc, relativePath];
        }, []);

        return result;
    };

    const fileList = getFiles(startPath);

    const fileListSorted = fileList.sort();

    return fileListSorted;
}

readDirDeep.sync = readDirDeepSync;

module.exports = readDirDeep;
