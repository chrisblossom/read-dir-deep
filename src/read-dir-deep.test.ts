import path from 'path';
import fs from 'fs';
import slash from 'slash';
import { TempSandbox } from 'temp-sandbox';
import {
	readDirDeep as readDirDeepActual,
	readDirDeepSync as readDirDeepSyncActual,
} from './read-dir-deep';

const readDirDeep: typeof readDirDeepActual = async (...args) =>
	require('./read-dir-deep').readDirDeep(...args);

const readDirDeepSync: typeof readDirDeepSyncActual = (...args) =>
	require('./read-dir-deep').readDirDeepSync(...args);

const sandbox = new TempSandbox();
beforeEach(async () => {
	await sandbox.clean();
});

afterAll(async () => {
	await sandbox.destroySandbox();
});

describe('gets all nested files', () => {
	beforeEach(async () => {
		await Promise.all<string | void>([
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

	const checkResult = (result: string[]) => {
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
		const result = readDirDeepSync(sandbox.dir);

		checkResult(result);
	});
});

describe('gets all nested files from base directory', () => {
	beforeEach(async () => {
		await Promise.all<string | void>([
			sandbox.createDir('other'),
			sandbox.createFile('d.js'),
			sandbox.createFile('.a.js'),
			sandbox.createFile('nested/1.js'),
			sandbox.createFile('nested/.b.js'),
			sandbox.createFile('nested/0/0.js'),
			sandbox.createFile('nested/c/c.js'),
		]);
	});

	const checkResult = (result: string[]) => {
		expect(result).toEqual(['.b.js', '0/0.js', '1.js', 'c/c.js']);
	};

	const rootDir = sandbox.path.resolve('nested');

	test('async', async () => {
		const result = await readDirDeep(rootDir);
		checkResult(result);
	});

	test('sync', () => {
		const result = readDirDeepSync(rootDir);

		checkResult(result);
	});
});

describe('handles empty initial directory', () => {
	const checkResult = (result: string[]) => {
		expect(result).toEqual([]);
	};

	test('async', async () => {
		const result = await readDirDeep(sandbox.dir);
		checkResult(result);
	});

	test('sync', () => {
		const result = readDirDeepSync(sandbox.dir);

		checkResult(result);
	});
});

describe('handles empty nested directory', () => {
	const nested = path.resolve(sandbox.dir, 'nested');

	beforeEach(async () => {
		await sandbox.createDir('nested');
	});

	const checkResult = (result: string[]) => {
		const dirExists = fs.statSync(nested).isDirectory();

		expect(dirExists).toEqual(true);

		expect(result).toEqual([]);
	};

	test('async', async () => {
		const result = await readDirDeep(sandbox.dir);
		checkResult(result);
	});

	test('sync', () => {
		const result = readDirDeepSync(sandbox.dir);

		checkResult(result);
	});
});

describe('throws error when not a directory', () => {
	const rootDir = path.resolve(sandbox.dir, 'a.js');

	beforeEach(async () => {
		await sandbox.createFile('a.js');
	});

	test('async', async () => {
		await expect(
			readDirDeep(rootDir),
		).rejects.toThrowErrorMatchingInlineSnapshot(
			`"The \`cwd\` option must be a path to a directory"`,
		);
	});

	test('sync', () => {
		expect(() =>
			readDirDeepSync(rootDir),
		).toThrowErrorMatchingInlineSnapshot(
			`"The \`cwd\` option must be a path to a directory"`,
		);
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

		const checkResult = (result: string[]) => {
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
			const result = readDirDeepSync(sandbox.dir, options);

			checkResult(result);
		});
	});

	describe('cwd is different directory but same path depth', () => {
		beforeEach(async () => {
			await Promise.all<string | void>([
				sandbox.createDir('other'),
				sandbox.createFile('d.js'),
				sandbox.createFile('.a.js'),
				sandbox.createFile('nested/1.js'),
				sandbox.createFile('nested/.b.js'),
				sandbox.createFile('nested/0/0.js'),
				sandbox.createFile('nested/c/c.js'),
			]);
		});

		const checkResult = (result: string[]) => {
			expect(result).toEqual([
				'../nested/.b.js',
				'../nested/1.js',
				'../nested/0/0.js',
				'../nested/c/c.js',
			]);
		};

		const rootDir = sandbox.path.resolve('nested');
		const options = {
			cwd: path.resolve(sandbox.dir, 'other'),
		};

		test('async', async () => {
			const result = await readDirDeep(rootDir, options);
			checkResult(result);
		});

		test('sync', () => {
			const result = readDirDeepSync(rootDir, options);

			checkResult(result);
		});
	});

	describe('cwd: "process.cwd()"', () => {
		beforeEach(async () => {
			await Promise.all<string | void>([
				sandbox.createDir('other'),
				sandbox.createFile('d.js'),
				sandbox.createFile('.a.js'),
				sandbox.createFile('nested/1.js'),
				sandbox.createFile('nested/.b.js'),
				sandbox.createFile('nested/0/0.js'),
				sandbox.createFile('nested/c/c.js'),
			]);
		});

		const checkResult = (result: string[]) => {
			expect(result).toEqual([
				'nested/.b.js',
				'nested/1.js',
				'nested/0/0.js',
				'nested/c/c.js',
			]);
		};

		const rootDir = sandbox.path.resolve('nested');
		const options = {
			cwd: sandbox.dir,
		};

		test('async', async () => {
			const result = await readDirDeep(rootDir, options);
			checkResult(result);
		});

		test('sync', () => {
			const result = readDirDeepSync(rootDir, options);

			checkResult(result);
		});
	});

	describe('cwd: "process.cwd()", absolute: true', () => {
		beforeEach(async () => {
			await Promise.all<string | void>([
				sandbox.createDir('other'),
				sandbox.createFile('d.js'),
				sandbox.createFile('.a.js'),
				sandbox.createFile('nested/1.js'),
				sandbox.createFile('nested/.b.js'),
				sandbox.createFile('nested/0/0.js'),
				sandbox.createFile('nested/c/c.js'),
			]);
		});

		const checkResult = (result: string[]) => {
			expect(result).toEqual(
				[
					'nested/.b.js',
					'nested/1.js',
					'nested/0/0.js',
					'nested/c/c.js',
				].map((pathname) => slash(path.resolve(sandbox.dir, pathname))),
			);
		};

		const rootDir = sandbox.path.resolve('nested');
		const options = {
			absolute: true,
			rootDir: sandbox.dir,
		};

		test('async', async () => {
			const result = await readDirDeep(rootDir, options);
			checkResult(result);
		});

		test('sync', () => {
			const result = readDirDeepSync(rootDir, options);

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

		const checkResult = (result: string[]) => {
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
			const result = readDirDeepSync(sandbox.dir, options);

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

		const checkResult = (result: string[]) => {
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
			const result = readDirDeepSync(sandbox.dir, options);

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

		const checkResult = (result: string[]) => {
			expect(result).toEqual(['a.js', 'nested/0/0.js']);
		};

		const options = { patterns: ['.', '!**/*.test.js'] };

		test('async', async () => {
			const result = await readDirDeep(sandbox.dir, options);
			checkResult(result);
		});

		test('sync', () => {
			const result = readDirDeepSync(sandbox.dir, options);

			checkResult(result);
		});
	});
});
