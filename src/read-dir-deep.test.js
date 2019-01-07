/* @flow */

import path from 'path';
import fs from 'fs';
import slash from 'slash';
import TempSandbox from 'temp-sandbox';

const readDirDeep = (...args) => require('./read-dir-deep')(...args);
readDirDeep.sync = (...args) => require('./read-dir-deep').sync(...args);

const sandbox = new TempSandbox();
beforeEach(async () => {
    await sandbox.clean();
});

afterAll(async () => {
    await sandbox.destroySandbox();
});

describe('gets all nested files', () => {
    beforeEach(async () => {
        await Promise.all([
            sandbox.createFile('.a.js'),
            sandbox.createFile('a.js'),
            sandbox.createFile('a b.js'),
            sandbox.createFile('b.js'),
            sandbox.createFile('.b.js'),
            sandbox.createFile('d.js'),
            sandbox.createFile('nested/1.js'),
            sandbox.createFile('nested/a.js'),
            sandbox.createFile('nested/b.js'),
            sandbox.createFile('nested/0/0.js'),
            sandbox.createFile('nested/0/a.js'),
            sandbox.createFile('nested/0/b.js'),
            sandbox.createFile('nested/c/a.js'),
            sandbox.createFile('nested/c/a.js'),
            sandbox.createFile('nested/c/b.js'),
            sandbox.createFile('nested/c/b.js'),
            sandbox.createFile('nested/c/c.js'),
            sandbox.createDir('other'),
        ]);
    });

    const checkResult = (result) => {
        expect(result).toEqual([
            '.a.js',
            '.b.js',
            'a b.js',
            'a.js',
            'b.js',
            'd.js',
            'nested/1.js',
            'nested/a.js',
            'nested/b.js',
            'nested/0/0.js',
            'nested/0/a.js',
            'nested/0/b.js',
            'nested/c/a.js',
            'nested/c/b.js',
            'nested/c/c.js',
        ]);
    };

    test('async', async () => {
        const result = await readDirDeep(sandbox.dir);
        checkResult(result);
    });

    test('sync', () => {
        const result = readDirDeep.sync(sandbox.dir);

        checkResult(result);
    });
});

describe('handles empty initial directory', () => {
    const checkResult = (result) => {
        expect(result).toEqual([]);
    };

    test('async', async () => {
        const result = await readDirDeep(sandbox.dir);
        checkResult(result);
    });

    test('sync', () => {
        const result = readDirDeep.sync(sandbox.dir);

        checkResult(result);
    });
});

describe('handles empty nested directory', () => {
    const nested = path.resolve(sandbox.dir, 'nested');

    beforeEach(async () => {
        await sandbox.createDir('nested');
    });

    const checkResult = (result) => {
        const dirExists = fs.statSync(nested).isDirectory();

        expect(dirExists).toEqual(true);

        expect(result).toEqual([]);
    };

    test('async', async () => {
        const result = await readDirDeep(sandbox.dir);
        checkResult(result);
    });

    test('sync', () => {
        const result = readDirDeep.sync(sandbox.dir);

        checkResult(result);
    });
});

describe('throws error when not a directory', () => {
    const pathname = path.resolve(sandbox.dir, 'a.js');

    beforeEach(async () => {
        await sandbox.createFile('a.js');
    });

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

describe('options', () => {
    describe('absolute: true', () => {
        beforeEach(async () => {
            await Promise.all([
                sandbox.createFile('a.js'),
                sandbox.createFile('nested/1.js'),
                sandbox.createFile('nested/0/0.js'),
            ]);
        });

        const checkResult = (result) => {
            expect(result).toEqual(
                ['a.js', 'nested/1.js', 'nested/0/0.js'].map((pathname) =>
                    slash(path.resolve(sandbox.dir, pathname)),
                ),
            );
        };

        const options = { absolute: true };

        test('async', async () => {
            const result = await readDirDeep(sandbox.dir, options);
            checkResult(result);
        });

        test('sync', () => {
            const result = readDirDeep.sync(sandbox.dir, options);

            checkResult(result);
        });
    });

    describe('passes options to globby', () => {
        beforeEach(async () => {
            await Promise.all([
                sandbox.createFile('a.js'),
                sandbox.createFile('b.js'),
                sandbox.createFile('c.js'),
                sandbox.createFile('.a.js'),
                sandbox.createFile('nested/1.js'),
                sandbox.createFile('nested/a.js'),
                sandbox.createFile('nested/b.js'),
                sandbox.createFile('nested/0/0.js'),
            ]);
        });

        const checkResult = (result) => {
            expect(result).toEqual([
                'c.js',
                'nested/1.js',
                'nested/a.js',
                'nested/0/0.js',
            ]);
        };

        const options = {
            dot: false,
            ignore: ['a.js', '**/b.js'],
        };

        test('async', async () => {
            const result = await readDirDeep(sandbox.dir, options);
            checkResult(result);
        });

        test('sync', () => {
            const result = readDirDeep.sync(sandbox.dir, options);

            checkResult(result);
        });
    });

    describe('ignore', () => {
        beforeEach(async () => {
            await Promise.all([
                sandbox.createFile('a.js'),
                sandbox.createFile('.DS_Store'),
                sandbox.createFile('node_modules/a.js'),
                sandbox.createFile('.git/a.js'),
                sandbox.createFile('.vscode/a.js'),
                sandbox.createFile('.idea/a.js'),
                sandbox.createFile('nested/0/0.js'),
                sandbox.createFile('nested/0/.DS_Store'),
                sandbox.createFile('nested/0/node_modules/a.js'),
                sandbox.createFile('nested/0/.idea/a.js'),
                sandbox.createFile('nested/0/.vscode/a.js'),
                sandbox.createFile('nested/0/.git/a.js'),
            ]);
        });

        const checkResult = (result) => {
            expect(result).toEqual(['a.js', 'nested/0/0.js']);
        };

        const options = {
            ignore: [
                '**/.DS_Store',
                '**/node_modules/**',
                '**/.git/**',
                '**/.vscode/**',
                '**/.idea/**',
            ],
        };

        test('async', async () => {
            const result = await readDirDeep(sandbox.dir, options);
            checkResult(result);
        });

        test('sync', () => {
            const result = readDirDeep.sync(sandbox.dir, options);

            checkResult(result);
        });
    });

    describe('custom pattern matching', () => {
        beforeEach(async () => {
            await Promise.all([
                sandbox.createFile('a.js'),
                sandbox.createFile('a.test.js'),
                sandbox.createFile('nested/0/0.js'),
                sandbox.createFile('nested/0/0.test.js'),
            ]);
        });

        const checkResult = (result) => {
            expect(result).toEqual(['a.js', 'nested/0/0.js']);
        };

        const options = { patterns: ['.', '!**/*.test.js'] };

        test('async', async () => {
            const result = await readDirDeep(sandbox.dir, options);
            checkResult(result);
        });

        test('sync', () => {
            const result = readDirDeep.sync(sandbox.dir, options);

            checkResult(result);
        });
    });
});
