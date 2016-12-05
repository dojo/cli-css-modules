import { Command, Helper } from 'dojo-cli/interfaces';
import { TypingsArgs, generate } from './generateTypings';
import { Options } from 'yargs';

const command: Command = {
	description: 'Generate CSS module type declaration files',
	register(options: (key: string, options: Options) => void): void {
		options('i', {
			alias: 'in',
			describe: 'Input CSS module file(s)',
			demand: true,
			type: 'string'
		});
		options('o', {
			alias: 'out',
			describe: 'Directory to write CSS module declaration files',
			demand: true,
			type: 'string'
		});
	},
	run(helper: Helper, args: TypingsArgs) {
		console.log('\nGenerating CSS module typings...\n');
		return generate(args);
	}
};
export default command;
