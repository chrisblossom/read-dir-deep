import path from 'path';
import isPathCwd from 'is-path-cwd';
import isPathInCwd from 'is-path-in-cwd';
import slash from 'slash';
import type globby from 'globby';
import { validateOptions } from './validate-args';
import { Options } from './read-dir-deep';

const defaultIgnorePatterns = [
	'**/.DS_Store',
	'**/node_modules/**',
	'**/.git/**',
	'**/.vscode/**',
	'**/.idea/**',
	'**/dist/**',
	'**/build/**',
	'**/coverage/**',
];

const defaultPatterns = ['**'];
const defaultOptions = {
	deep: Infinity,
	dot: true,
	markDirectories: true,
	gitignore: true,
	ignore: defaultIgnorePatterns,
};

function isInsideProcessCwd(pathname: string): boolean {
	const isCwd = isPathCwd(pathname);

	if (isCwd === true) {
		return isCwd;
	}

	const insideCwd = isPathInCwd(pathname);

	return insideCwd;
}

interface ParsedArgsReturn {
	absolute: boolean;
	rootDir: string;
	cwd: string;
	patterns: string[];
	globbyOptions: globby.GlobbyOptions;
}

function parseArgs(rootDir: string, options: Options): ParsedArgsReturn {
	validateOptions(rootDir, options);

	// eslint-disable-next-line prefer-const
	let { cwd, absolute, patterns = defaultPatterns, ...globbyOpts } = options;

	let parsedRootDir = path.resolve(rootDir);

	const processCwd = path.resolve(process.cwd());
	const rootDirIsInsideProcessCwd = isInsideProcessCwd(parsedRootDir);

	// default to absolute: true when rootDir is outside process.cwd()
	if (typeof absolute !== 'boolean') {
		absolute = rootDirIsInsideProcessCwd === false;
	}

	if (typeof cwd !== 'string') {
		// default to process.cwd when inside cwd
		cwd = rootDirIsInsideProcessCwd === true ? processCwd : parsedRootDir;
	}

	cwd = slash(cwd);
	parsedRootDir = slash(parsedRootDir);

	const globbyOptions = {
		...defaultOptions,
		...globbyOpts,
		cwd: parsedRootDir,
		absolute,
	};

	return {
		absolute,
		rootDir,
		cwd,
		patterns,
		globbyOptions,
	};
}

export { parseArgs, defaultIgnorePatterns };
