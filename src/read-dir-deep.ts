import globby, { sync as globbySync, GlobbyOptions } from 'globby';
import { parseArgs, defaultIgnorePatterns } from './parse-args';
import { parseFiles } from './parse-files';

export interface Options extends GlobbyOptions {
	patterns?: string[];
	cwd?: string;
}

async function readDirDeep(
	rootDir: string,
	options: Options = {},
): Promise<string[]> {
	const {
		rootDir: rootDirParsed,
		absolute,
		cwd,
		patterns,
		globbyOptions,
	} = parseArgs(rootDir, options);

	const fileList = await globby(patterns, globbyOptions);

	const result = parseFiles({
		files: fileList,
		cwd,
		rootDir: rootDirParsed,
		absolute,
	});

	return result;
}

function readDirDeepSync(rootDir: string, options: Options = {}): string[] {
	const {
		rootDir: rootDirParsed,
		absolute,
		cwd,
		patterns,
		globbyOptions,
	} = parseArgs(rootDir, options);

	const fileList = globbySync(patterns, globbyOptions);

	const result = parseFiles({
		files: fileList,
		cwd,
		rootDir: rootDirParsed,
		absolute,
	});

	return result;
}

export { readDirDeep, readDirDeepSync, defaultIgnorePatterns };
