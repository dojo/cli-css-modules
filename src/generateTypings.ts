import { Argv } from 'yargs';
import * as fs from 'fs';
import * as path from 'path';
import * as chalk from 'chalk';
import * as mkdirp from 'mkdirp';
import * as globby from 'globby';
const stylus: any = require('stylus');
const DtsCreator: any = require('typed-css-modules');
const read: any = require('read-file-stdin');

export interface TypingsArgs extends Argv {
	in: string;
	out: string;
	stylus: boolean;
	use: string;
	import: string;
}

function readFile(fileName: string): Promise<string> {
	return new Promise((resolve, reject) => {
		read(fileName, (err: Error, content: string) => {
			if (err) {
				reject(err);
				return;
			}

			resolve(content.toString());
		});
	});
}

function getStylusPlugins(args: TypingsArgs): {fn: Function, options: any}[] {
	if (!args.use) {
		return [];
	}
	let plugins: any[] = Array.isArray(args.use) ? args.use : [args.use];
	plugins = plugins.map((pluginPath, i) => {
		let index: number = process.argv.indexOf(pluginPath);
		let options: any = null;
		// Check if the next option is --with or -w and parse if applicable
		if (process.argv[index + 1] && (process.argv[index + 1] === '--with' || process.argv[index + 1] === '-w')) {
			/* tslint:disable:no-eval */
			options = eval(`(${ process.argv[index + 2] })`);
		}
		// Require each plugin
		let fn: any = require(/^\.+\//.test(pluginPath) ? path.resolve(pluginPath) : pluginPath);
		if (typeof fn !== 'function') {
			throw new Error(`plugin ${pluginPath} does not export a function`);
		}
		return {
			fn: fn,
			options: options
		};
	});
	return plugins;
}

function compileStylus(args: TypingsArgs, content: string): Promise<string> {
	return new Promise((resolve, reject) => {
		let plugins: {fn: Function, options: any}[] = getStylusPlugins(args);
		let imports: string[] = Array.isArray(args.import) ? args.import : [args.import];
		let styles = stylus(content);

		plugins.forEach(plugin => {
			styles.use(plugin.fn(plugin.options));
		});

		args.import && imports.forEach(path => {
			styles.import(path);
		});

		styles.render((err: Error, css: string) => {
			if (err) {
				reject(err);
				return;
			}

			resolve(css);
		});
	});
}

function write(name: string, content: { formatted: string }): Promise<void> {
	return new Promise((resolve, reject) => {
		mkdirp(path.dirname(name), (err: Error) => {
			if (err) {
				reject(err);
				return;
			}

			fs.writeFile(name, content.formatted + '\n', (err: Error) => {
				if (err) {
					reject(err);
					return;
				}
				console.log(chalk.green(name));
				resolve();
			});
		});
	});
};

async function processFile(args: TypingsArgs, creator: any, fileName: string) {
	const outputPath: string = path.join(args.out, path.basename(fileName) + '.d.ts');

	let contents = await readFile(fileName);
	if (args.stylus) {
		contents = await compileStylus(args, contents);
	}
	const typings = await creator.create('', contents);
	return await write(outputPath, typings);
}

export function generate(args: TypingsArgs): Promise<void> {
	let creator: any = new DtsCreator();
	const inputFiles: string[] = globby.sync(args.in);

	const operations: Promise<void>[] = inputFiles.map((fileName: string) => {
		return processFile(args, creator, fileName);
	});

	return Promise.all(operations).then(() => {
		console.log('\nDone!');
	});
}
