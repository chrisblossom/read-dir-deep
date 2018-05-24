/* @flow */

import path from 'path';
import os from 'os';
import del from 'del';
import makeDir from 'make-dir';
import readDirDeep from './read-dir-deep';

describe('readDirDeep', () => {
    describe('gets all nested files', () => {
        const pathname = path.resolve(__dirname, '__sandbox__/files1');

        const checkResult = (result) => {
            expect(result).toEqual([
                path.normalize('nested/nested-inside/inside.js'),
                path.normalize('nested/other.js'),
                path.normalize('test-file.js'),
            ]);
        };

        test('async', async () => {
            const result = await readDirDeep(pathname);
            checkResult(result);
        });

        test('sync', () => {
            const result = readDirDeep.sync(pathname);

            checkResult(result);
        });
    });

    describe('handles empty directory', () => {
        const pathname = path.resolve(os.tmpdir(), 'read-dir-deep-dir');

        beforeEach(() => {
            makeDir.sync(pathname);
        });

        afterEach(() => {
            del.sync(pathname, { force: true });
        });

        const checkResult = (result) => {
            expect(result).toEqual([]);
        };

        test('async', async () => {
            const result = await readDirDeep(pathname);
            checkResult(result);
        });

        test('sync', () => {
            const result = readDirDeep.sync(pathname);

            checkResult(result);
        });
    });

    describe('throws error when not a directory', () => {
        const pathname = path.resolve(
            __dirname,
            '__sandbox__/files1/test-file.js',
        );

        const checkError = (error) => {
            expect(error.code).toEqual('ENOTDIR');
        };

        test('async', async () => {
            expect.hasAssertions();
            try {
                await readDirDeep(pathname);
            } catch (error) {
                checkError(error);
            }
        });

        test('sync', () => {
            expect.hasAssertions();
            try {
                readDirDeep.sync(pathname);
            } catch (error) {
                checkError(error);
            }
        });
    });
});
