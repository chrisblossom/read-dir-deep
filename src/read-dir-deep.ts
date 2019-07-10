import globby, { sync as globbySync, GlobbyOptions } from 'globby';
import { parseFiles } from './parse-files';

export interface Options extends GlobbyOptions {
	patterns?: string[];
	cwd?: string;
}

const defaultPatterns = ['**'];
const defaultOptions: Options = {
	deep: Infinity,
	dot: true,
	markDirectories: true,
};

async function readDirDeep(
	dir: string,
	options: Options = {},
): Promise<string[]> {
	const { cwd = dir, patterns = defaultPatterns, ...globbyOptions } = options;

	const fileList = await globby(patterns, {
		cwd: dir,
		...defaultOptions,
		...globbyOptions,
	});

	const result = parseFiles({
		files: fileList,
		cwd,
		dir,
		absolute: !!options.absolute,
	});

	return result;
}

function readDirDeepSync(dir: string, options: Options = {}): string[] {
	const { cwd = dir, patterns = defaultPatterns, ...globbyOptions } = options;

	const fileList = globbySync(patterns, {
		cwd: dir,
		...defaultOptions,
		...globbyOptions,
	});

	const result = parseFiles({
		files: fileList,
		cwd,
		dir,
		absolute: !!options.absolute,
	});

	return result;
}

export { readDirDeep, readDirDeepSync };
