import path from 'path';
import pathSort from 'path-sort2';

interface ParseFilesParameters {
	files: string[];
	rootDir: string;
	cwd: string;
	absolute: boolean;
}

function parseFiles({
	files,
	cwd,
	rootDir,
	absolute,
}: ParseFilesParameters): string[] {
	let normalizedFiles = files;

	if (absolute === false && path.resolve(cwd) !== path.resolve(rootDir)) {
		const relativeBaseDir = path.relative(cwd, rootDir);

		normalizedFiles = files.map((file): string => {
			const baseAdded = path.join(relativeBaseDir, file);
			return baseAdded;
		});
	}

	const fileListSorted = pathSort(normalizedFiles, '/');

	return fileListSorted;
}

export { parseFiles };
