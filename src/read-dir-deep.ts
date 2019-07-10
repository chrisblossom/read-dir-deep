import globby, { sync as globbySync, GlobbyOptions } from 'globby';
import { validateOptions } from './validate-options';
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
	rootDir: string,
	options: Options = {},
): Promise<string[]> {
	validateOptions(rootDir, options);

	const {
		cwd = rootDir,
		patterns = defaultPatterns,
		...globbyOptions
	} = options;

	const fileList = await globby(patterns, {
		cwd: rootDir,
		...defaultOptions,
		...globbyOptions,
	});

	const result = parseFiles({
		files: fileList,
		cwd,
		rootDir,
		absolute: !!options.absolute,
	});

	return result;
}

function readDirDeepSync(rootDir: string, options: Options = {}): string[] {
	validateOptions(rootDir, options);

	const {
		cwd = rootDir,
		patterns = defaultPatterns,
		...globbyOptions
	} = options;

	const fileList = globbySync(patterns, {
		cwd: rootDir,
		...defaultOptions,
		...globbyOptions,
	});

	const result = parseFiles({
		files: fileList,
		cwd,
		rootDir,
		absolute: !!options.absolute,
	});

	return result;
}

export { readDirDeep, readDirDeepSync };
