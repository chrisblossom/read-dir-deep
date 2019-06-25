import globby, { sync as globbySync, GlobbyOptions } from 'globby';
import pathSort from 'path-sort2';

export interface Options extends GlobbyOptions {
    patterns?: string[];
}

const defaultPatterns = ['**'];
const defaultOptions: Options = {
    deep: true,
    dot: true,
    markDirectories: true,
};

async function readDirDeep(
    startPath: string,
    options: Options = {},
): Promise<string[]> {
    const { patterns = defaultPatterns, ...globbyOptions } = options;

    const fileList = await globby(patterns, {
        cwd: startPath,
        ...defaultOptions,
        ...globbyOptions,
    });

    const fileListSorted = pathSort(fileList, '/');

    return fileListSorted;
}

function readDirDeepSync(startPath: string, options: Options = {}): string[] {
    const { patterns = defaultPatterns, ...globbyOptions } = options;

    const fileList = globbySync(patterns, {
        cwd: startPath,
        ...defaultOptions,
        ...globbyOptions,
    });

    const fileListSorted = pathSort(fileList, '/');

    return fileListSorted;
}

export { readDirDeep, readDirDeepSync };
