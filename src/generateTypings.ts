import { Argv } from 'yargs';
import * as fs from 'fs';
import * as path from 'path';
import * as chalk from 'chalk';
import * as mkdirp from 'mkdirp';
import * as globby from 'globby';
const DtsCreator: any = require('typed-css-modules');
const read: any = require('read-file-stdin');

export interface TypingsArgs extends Argv {
	in: string;
	out: string;
}

function readFile(fileName: string) {
	return new Promise((resolve, reject) => {
		read(fileName, (err: Error, buffer: Buffer) => {
			if (err) {
				reject(err);
				return;
			}

			resolve(buffer);
		});
	});
}

function write(name: string, content: { formatted: string }) {
	return new Promise((resolve, reject) => {
		mkdirp(path.dirname(name), (err: Error) => {
			if (err) {
				reject(err);
				return;
			}

			fs.writeFile(name, content.formatted, (err) => {
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

	const contents = await readFile(fileName);
	const typings = await creator.create('', contents);
	return await write(outputPath, typings);
}

export function generate(args: TypingsArgs): Promise<void> {
	let creator: any = new DtsCreator();
	const inputFiles: string[] = globby.sync(args.in);

	const operations: Promise<void>[] = inputFiles.map((file) => {
		return processFile(args, creator, file);
	});

	return Promise.all(operations).then(() => {
		console.log('\nDone!');
	});
}
