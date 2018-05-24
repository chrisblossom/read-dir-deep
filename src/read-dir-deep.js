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
    const result = [];
    const getFiles = async (dir: string) => {
        const files = await readDir(dir);

        /* eslint-disable no-await-in-loop */
        for (const file of files) {
            const pathname = path.resolve(dir, file);

            const isDirectory = (await stat(pathname)).isDirectory();
            if (isDirectory) {
                await getFiles(pathname);
            } else {
                const relativePath = path.relative(startPath, pathname);

                result.push(relativePath);
            }
        }
        /* eslint-enable */

        // $FlowIssue
        const sorted = result.sort();

        return sorted;
    };

    const fileList = await getFiles(startPath);

    return fileList;
}

function readDirDeepSync(startPath: string) {
    const getFiles = (dir: string) => {
        const result = fs
            .readdirSync(dir)
            .reduce((acc, file) => {
                const pathname = path.resolve(dir, file);

                const isDirectory = fs.statSync(pathname).isDirectory();
                if (isDirectory) {
                    const dirList = getFiles(pathname);

                    return [...acc, ...dirList];
                }

                const relativePath = path.relative(startPath, pathname);
                return [...acc, relativePath];
            }, [])
            .sort();

        return result;
    };

    const fileList = getFiles(startPath);

    return fileList;
}

readDirDeep.sync = readDirDeepSync;

module.exports = readDirDeep;
