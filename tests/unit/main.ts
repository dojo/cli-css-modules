import { before, beforeEach, afterEach, describe, it } from 'intern!bdd';
import * as assert from 'intern/chai!assert';
import { SinonSandbox, SinonStub, sandbox } from 'sinon';
import * as fs from 'fs';

let main: any;

describe('main', () => {
	let env: SinonSandbox;

	before(() => {
		main = require('intern/dojo/node!./../../src/main');
	});

	beforeEach(() => {
		env = sandbox.create();
	});

	afterEach(() => {
		env.restore();
	});

	it('should register supported arguments', () => {
		const helper = { yargs: {
			option: env.stub(),
			check: env.stub()
		} };
		main.default.register(helper);
		assert.deepEqual(
			helper.yargs.option.firstCall.args,
			['i', {
				alias: 'in',
				describe: 'Input CSS module file(s)',
				demand: true,
				type: 'string'
			}]
		);
		assert.deepEqual(
			helper.yargs.option.secondCall.args,
			['o', {
				alias: 'out',
				describe: 'Directory to write CSS module declaration files',
				demand: true,
				type: 'string'
			}]
		);
		assert.deepEqual(
			helper.yargs.option.thirdCall.args,
			['s', {
				alias: 'stylus',
				describe: 'Enable stylus CSS modules',
				demand: false,
				type: 'boolean'
			}]
		);
		assert.deepEqual(
			helper.yargs.option.getCall(3).args,
			['u', {
				alias: 'use',
				describe: 'Utilize the Stylus plugin at <path>',
				demand: false,
				type: 'string'
			}]
		);
		assert.deepEqual(
			helper.yargs.option.getCall(4).args,
			['w', {
				alias: 'with',
				describe: 'Pass arguments to a Stylus plugin',
				demand: false,
				type: 'string'
			}]
		);
		assert.deepEqual(
			helper.yargs.option.getCall(5).args,
			['I', {
				alias: 'import',
				describe: 'Add <path> to lookup paths',
				demand: false,
				type: 'string'
			}]
		);
	});

	it('should create a CSS module declaration file', () => {
		const writeFileStub: SinonStub = env.stub(fs, 'writeFile', function (name: string, content: string, done: Function) {
			done();
		});
		return main.default.run({}, {
			in: 'tests/support/test.css',
			out: '.'
		}).then(() => {
			assert.isTrue(writeFileStub.calledOnce);
			assert.strictEqual(writeFileStub.getCall(0).args[0], 'test.css.d.ts');
		});
	});

	it('should create a Stylus CSS module declaration file', () => {
		const writeFileStub: SinonStub = env.stub(fs, 'writeFile', function (name: string, content: string, done: Function) {
			done();
		});
		return main.default.run({}, {
			in: 'tests/support/test.styl',
			out: '.',
			stylus: true
		}).then(() => {
			assert.isTrue(writeFileStub.calledOnce);
			assert.strictEqual(writeFileStub.getCall(0).args[0], 'test.styl.d.ts');
		});
	});

	it('should use Stylus plugins', () => {
		const writeFileStub: SinonStub = env.stub(fs, 'writeFile', function (name: string, content: string, done: Function) {
			done();
		});
		return main.default.run({}, {
			in: 'tests/support/plugins.styl',
			out: '.',
			stylus: true,
			use: './node_modules/nib/lib/nib',
			with: '{ browsers: ["ie 7", "ie 8"] }'
		}).then(() => {
			assert.isTrue(writeFileStub.calledOnce);
			assert.strictEqual(writeFileStub.getCall(0).args[0], 'plugins.styl.d.ts');
		});
	});

	it('should use Stylus imports', () => {
		const writeFileStub: SinonStub = env.stub(fs, 'writeFile', function (name: string, content: string, done: Function) {
			done();
		});
		return main.default.run({}, {
			in: 'tests/support/imports.styl',
			out: '.',
			stylus: true,
			import: 'tests/support/test.styl'
		}).then(() => {
			assert.isTrue(writeFileStub.calledOnce);
			assert.strictEqual(writeFileStub.getCall(0).args[0], 'imports.styl.d.ts');
			assert.include(writeFileStub.getCall(0).args[1], 'foo');
		});
	});
});
