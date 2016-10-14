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
			[ 'c', {
				alias: 'cssOut',
				describe: 'directory to write CSS modules',
				demand: false,
				type: 'string'
			} ]
		);
		assert.deepEqual(
			helper.yargs.option.secondCall.args,
			[ 't', {
				alias: 'tsOut',
				describe: 'directory to write TS modules',
				demand: false,
				type: 'string'
			} ]
		);
	});

	it('should create a CSS module file', () => {
		const writeFileStub: sinon.SinonStub = sandbox.stub(fs, 'writeFile', function (name: string, content: string, done: Function) {
			done();
		});
		return main.default.run({}, {
			cssOut: '.',
			_: [null, null, 'tests/support/test.css']
		}).then(() => {
			assert.isTrue(writeFileStub.calledOnce);
			assert.strictEqual(writeFileStub.getCall(0).args[0], 'test.css');
		});
	});

	it('should create a TS module file', () => {
		const writeFileSyncStub: sinon.SinonStub = sandbox.stub(fs, 'writeFileSync');
		return main.default.run({}, {
			tsOut: '.',
			_: [null, null, 'tests/support/test.css']
		}).then(() => {
			assert.isTrue(writeFileSyncStub.calledOnce);
			assert.strictEqual(writeFileSyncStub.getCall(0).args[0], './test.ts');
		});
	});

	it('should not create a CSS module file if cssOut not specified', () => {
		const writeFileStub: sinon.SinonStub = sandbox.stub(fs, 'writeFile', function (name: string, content: string, done: Function) {
			done();
		});
		return main.default.run({}, {
			_: [null, null, 'tests/support/test.css']
		}).then(() => {
			assert.isFalse(writeFileStub.called);
		});
	});

	it('should not create a TS module file if tsOut not specified', () => {
		const writeFileSyncStub: sinon.SinonStub = sandbox.stub(fs, 'writeFileSync');
		return main.default.run({}, {
			_: [null, null, 'tests/support/test.css']
		}).then(() => {
			assert.isFalse(writeFileSyncStub.called);
		});
	});

	it ('should reject if CSS file is invalid', function (this: any) {
		const dfd: any = this.async();

		main.default.run({}, {
			_: [null, null, 'tests/support/invalid.css']
		}).then(() => { }, dfd.callback(() => {}));
	});
});
