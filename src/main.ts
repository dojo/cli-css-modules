import { Command, Helper } from 'dojo-cli/interfaces';
import { Argv } from 'yargs';
import * as fs from 'fs';
import * as path from 'path';
const postcss: any = require('postcss');
const cssModules: any = require('postcss-modules');
const read: any = require('read-file-stdin');
const globby: any = require('globby');
const async: any = require('async');
const mkdirp: any = require('mkdirp');
const chalk: any = require('chalk');

interface PostcssArgs extends Argv {
	input: string;
	cssOut: string;
	tsOut: string;
}

function processFile(args: PostcssArgs, processor: any, file: string, done: Function): void {
	const cssOut: string = args.cssOut || path.dirname(file);
	const outputPath: string = path.join(cssOut, path.basename(file));

	function execute(css: string, done: Function): void {
		function complete(result: any) {
			if (typeof result.warnings === 'function') {
				result.warnings().forEach(function (warning: any) {
					console.warn(warning.toString());
				});
			}
			done(null, result);
		};

		const result: any = processor.process(css, { from: file, to: outputPath });

		if (typeof result.then === 'function') {
			result.then(complete).catch(done);
		}
		else {
			process.nextTick(complete.bind(null, result));
		}
	};

	function write(name: string, content: any, done: Function): void {
		async.parallel([
			async.apply(function(name: string, content: string, done: Function) {
				mkdirp(path.dirname(name), function(err: any) {
					if (err) {
						done(err);
					}
					else {
						fs.writeFile(name, content, done);
						console.log(chalk.green(name));
					}
				});
			}, name, content.css)
		], done);
	};

	async.waterfall([
		async.apply(read, file),
		execute,
		async.apply(write, outputPath)
	], done);
}

function modularize(args: PostcssArgs): Promise<any> {
	const processor: any = postcss([
		cssModules({
			getJSON: function(cssFileName: string, json: string) {
				const filename = path.basename(cssFileName, '.css');
				fs.writeFileSync(
					`${ args.tsOut || '.' }/${ filename }.ts`,
					`/* tslint:disable:object-literal-key-quotes quotemark whitespace */\nexport default ${ JSON.stringify(json) };\n`
				);
			}
		})
	]);

	const inputFiles: string[] = globby.sync(args._.splice(2));

	return new Promise((resolve, reject) => {
		async.each(inputFiles, processFile.bind(null, args, processor), function(err: any) {
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
	description: 'compile css modules',
	register(helper: Helper) {
		helper.yargs
			.option('c', {
				alias: 'cssOut',
				describe: 'directory to write CSS modules',
				demand: true,
				type: 'string'
			})
			.option('t', {
				alias: 'tsOut',
				describe: 'directory to write TS modules',
				demand: true,
				type: 'string'
			})
			.check(function(argv) {
				if (argv._.length === 2) {
					throw 'input CSS file(s) must be specified';
				}
				return true;
			});

		return helper.yargs;
	},
	run(helper: Helper, args: PostcssArgs) {
		console.log('\nGenerating CSS modules...\n');
		return modularize(args);
	}
};
export default command;
