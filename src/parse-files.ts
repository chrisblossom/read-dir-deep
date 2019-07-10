import path from 'path';
import slash from 'slash';
import pathSort from 'path-sort2';

interface ParseFilesParameters {
	files: string[];
	rootDir: string;
	absolute: boolean;
	cwd: string;
}

function parseFiles({
	files,
	cwd,
	rootDir,
	absolute,
}: ParseFilesParameters): string[] {
	let normalizedFiles = files;

	if (absolute === false && cwd !== rootDir) {
		const relativeBaseDir = path.relative(cwd, rootDir);

		normalizedFiles = files.map((file): string => {
			let baseAdded = path.join(relativeBaseDir, file);

			// always return forward slashes like globby does
			baseAdded = slash(baseAdded);

			return baseAdded;
		});
	}

	const fileListSorted = pathSort(normalizedFiles, '/');

	return fileListSorted;
}

export { parseFiles };
