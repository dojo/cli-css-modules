import { Command, Helper } from 'dojo-cli/interfaces';
import { Argv } from 'yargs';
import * as fs from 'fs';
import * as path from 'path';
const DtsCreator: any = require('typed-css-modules');
const read: any = require('read-file-stdin');
const globby: any = require('globby');
const async: any = require('async');
const mkdirp: any = require('mkdirp');
const chalk: any = require('chalk');

interface TypingsArgs extends Argv {
	out: string;
}

function processFile(args: TypingsArgs, creator: any, file: string, done: Function): void {
	const outputPath: string = path.join(args.out, path.basename(file, '.css') + '.d.ts');

	function execute(declarations: string, done: Function): void {
		creator.create('', declarations).then(function (result: any) {
			done(null, result);
		}).catch(done);
	};

	function write(name: string, content: any, done: Function): void {
		async.parallel([
			async.apply(function(name: string, content: string, done: Function) {
				mkdirp(path.dirname(name), function(err: any) {
					if (err) {
						done(err);
					}
					else if (args.out) {
						fs.writeFile(name, content, done);
						console.log(chalk.green(name));
					} else {
						done();
					}
				});
			}, name, content.formatted)
		], done);
	};

	async.waterfall([
		async.apply(read, file),
		execute,
		async.apply(write, outputPath)
	], done);
}

function generate(args: TypingsArgs): Promise<any> {
	let creator: any = new DtsCreator();
	const inputFiles: string[] = globby.sync(args._.splice(2));

	return new Promise((resolve, reject) => {
		async.each(inputFiles, processFile.bind(null, args, creator), function(err: any) {
			if (err) {
				reject(err);
				return;
			}
			console.log('\nDone!');
			resolve({});
		});
	});
}

const command: Command = {
	description: 'generate CSS module type declaration files',
	register(helper: Helper) {
		helper.yargs.option('o', {
			alias: 'out',
			describe: 'directory to write CSS module declaration files',
			demand: true,
			type: 'string'
		});
		helper.yargs.check(function(argv: any) {
			if (argv._.length === 2) {
				throw 'input CSS file(s) must be specified';
			}
			return true;
		});

		return helper.yargs;
	},
	run(helper: Helper, args: TypingsArgs) {
		console.log('\nGenerating CSS module typings...\n');
		return generate(args);
	}
};
export default command;
