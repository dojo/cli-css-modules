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

function compileStylus(content: string): Promise<string> {
	return new Promise((resolve, reject) => {
		stylus.render(content, (err: Error, css: string) => {
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

			fs.writeFile(name, content.formatted, (err: Error) => {
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
		contents = await compileStylus(contents);
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
