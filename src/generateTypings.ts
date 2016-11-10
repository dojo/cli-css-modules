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

function readFile(file: string) {
	return new Promise((resolve, reject) => {
		read(file, function (err: any, buffer: Buffer) {
			if (err) {
				reject(err);
				return;
			}

			resolve(buffer);
		});
	});
}

function execute(declarations: {}, creator: any) {
	return new Promise((resolve, reject) => {
		creator.create('', declarations).then(function (result: any) {
			resolve(result);
		}).catch(reject);
	});
}

function write(name: string, content: any) {
	return new Promise((resolve, reject) => {
		mkdirp(path.dirname(name), function(err: any) {
			if (err) {
				reject(err);
				return;
			}

			fs.writeFile(name, content.formatted, function (err) {
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

async function processFile(args: TypingsArgs, creator: any, file: string) {
	const outputPath: string = path.join(args.out, path.basename(file) + '.d.ts');

	const contents = await readFile(file);
	const typings = await execute(contents, creator);
	return await write(outputPath, typings);
}

export function generate(args: TypingsArgs): Promise<any> {
	let creator: any = new DtsCreator();
	const inputFiles: string[] = globby.sync(args.in);

	const operations: Promise<any>[] = inputFiles.map((file) => {
		return processFile(args, creator, file);
	});

	return Promise.all(operations).then(() => {
		console.log('\nDone!');
	});
}
