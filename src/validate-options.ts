import path from 'path';
import { Options } from './read-dir-deep';

function isRelative(pathname: string): boolean {
	const result = path.isAbsolute(pathname) === false;
	return result;
}

function validateOptions(dir: string, options: Options): void {
	if (isRelative(dir) === true) {
		throw new Error(`dir cannot be relative. Received: "${dir}"`);
	}

	if (typeof options.cwd === 'string') {
		if (isRelative(options.cwd) === true) {
			throw new Error(
				`options.cwd cannot be relative. Received: "${options.cwd}"`,
			);
		}
	}
}

export { validateOptions };
