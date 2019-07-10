import path from 'path';
import isPathCwd from 'is-path-cwd';
import isPathInCwd from 'is-path-in-cwd';
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

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function parseArgs(rootDir: string, options: Options) {
	validateOptions(rootDir, options);

	// eslint-disable-next-line prefer-const
	let { cwd, absolute, patterns = defaultPatterns, ...globbyOpts } = options;

	const parsedRootDir = path.resolve(rootDir);

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
	} as const;
}

export { parseArgs, defaultIgnorePatterns };
