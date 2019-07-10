import path from 'path';
import pathSort from 'path-sort2';

interface ParseFilesParameters {
	files: string[];
	dir: string;
	cwd: string;
	absolute: boolean;
}

function parseFiles({
	files,
	cwd,
	dir,
	absolute,
}: ParseFilesParameters): string[] {
	let normalizedFiles = files;

	if (absolute === false && path.resolve(cwd) !== path.resolve(dir)) {
		const relativeBaseDir = path.relative(cwd, dir);

		normalizedFiles = files.map((file): string => {
			const baseAdded = path.join(relativeBaseDir, file);
			return baseAdded;
		});
	}

	const fileListSorted = pathSort(normalizedFiles, '/');

	return fileListSorted;
}

export { parseFiles };
