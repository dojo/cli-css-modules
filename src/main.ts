import { Command, Helper, OptionsHelper } from 'dojo-cli/interfaces';
import { TypingsArgs, generate } from './generateTypings';

const command: Command = {
	description: 'Generate CSS module type declaration files',
	register(helper: Helper, options: OptionsHelper): void {
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
