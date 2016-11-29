import { Command, Helper } from 'dojo-cli/interfaces';
import { TypingsArgs, generate } from './generateTypings';

const command: Command = {
	description: 'Generate CSS module type declaration files',
	register(helper: Helper) {
		helper.yargs.option('i', {
			alias: 'in',
			describe: 'Input CSS module file(s)',
			demand: true,
			type: 'string'
		});
		helper.yargs.option('o', {
			alias: 'out',
			describe: 'Directory to write CSS module declaration files',
			demand: true,
			type: 'string'
		});
		helper.yargs.option('s', {
			alias: 'stylus',
			describe: 'Enable stylus CSS modules',
			demand: false,
			type: 'boolean'
		});
		helper.yargs.option('u', {
			alias: 'use',
			describe: 'Utilize the Stylus plugin at <path>',
			demand: false,
			type: 'string'
		});
		helper.yargs.option('w', {
			alias: 'with',
			describe: 'Pass arguments to a Stylus plugin',
			demand: false,
			type: 'string'
		});
		helper.yargs.option('I', {
			alias: 'import',
			describe: 'Add <path> to lookup paths',
			demand: false,
			type: 'string'
		});

		return helper.yargs;
	},
	run(helper: Helper, args: TypingsArgs) {
		console.log('\nGenerating CSS module typings...\n');
		return generate(args);
	}
};
export default command;
