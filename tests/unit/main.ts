import { before, beforeEach, afterEach, describe, it } from 'intern!bdd';
import * as assert from 'intern/chai!assert';
import * as sinon from 'sinon';
import * as fs from 'fs';

let main: any;

describe('main', () => {
	let sandbox: sinon.SinonSandbox;

	before(() => {
		main = require('intern/dojo/node!./../../src/main');
	});

	beforeEach(() => {
		sandbox = sinon.sandbox.create();
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('should register supported arguments', () => {
		const helper = { yargs: {
			option: sandbox.stub(),
			check: sandbox.stub()
		} };
		main.default.register(helper);
		assert.deepEqual(
			helper.yargs.option.firstCall.args,
			[ 'o', {
				alias: 'out',
				describe: 'directory to write CSS module declaration files',
				demand: true,
				type: 'string'
			} ]
		);
	});

	it('should create a CSS module declaration file', () => {
		const writeFileStub: sinon.SinonStub = sandbox.stub(fs, 'writeFile', function (name: string, content: string, done: Function) {
			done();
		});
		return main.default.run({}, {
			out: '.',
			_: [null, null, 'tests/support/test.css']
		}).then(() => {
			assert.isTrue(writeFileStub.calledOnce);
			assert.strictEqual(writeFileStub.getCall(0).args[0], 'test.d.ts');
		});
	});
});
