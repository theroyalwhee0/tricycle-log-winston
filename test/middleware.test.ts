import { expect } from 'chai';
import { Format } from 'logform';
import { describe, it } from 'mocha';
import { spy } from 'sinon';
import TransportStream from 'winston-transport';
import {
    buildOptions, cloneOptions, StrictLoggerOptions,
    WinstonContext, winstonLog,
} from '../src/middleware';
import { mockPlatformContext } from './mock';

describe('buildOptions', () => {
    it('should be a function', () => {
        expect(buildOptions).to.be.a('function');
        expect(buildOptions.length).to.equal(1);
    });
    it('should build default options', () => {
        const result = buildOptions();
        expect(result).to.be.a('object');
        expect(result.level).to.equal('info');
        expect(result.transports).to.be.an('array');
        expect(result.transports.length).to.equal(0);
    });
    it('should handle being given single transport', () => {
        const fakeTransport = {} as TransportStream;
        const result = buildOptions({
            level: 'debug',
            transports: fakeTransport,
        });
        expect(result).to.be.a('object');
        expect(result.level).to.equal('debug');
        expect(result.transports).to.be.an('array');
        expect(result.transports.length).to.equal(1);
        expect(result.transports[0]).to.equal(fakeTransport);
    });
    it('should handle being given a transport array', () => {
        const fakeTransport = <TransportStream><unknown>{ fake: 'transport ' };
        const fakeFormat = <Format><unknown>{ fake: 'format ' };
        const result = buildOptions({
            level: 'warn',
            format: fakeFormat,
            transports: [fakeTransport],
        });
        expect(result).to.be.a('object');
        expect(result.level).to.equal('warn');
        expect(result.format).to.equal(fakeFormat);
        expect(result.transports).to.be.an('array');
        expect(result.transports.length).to.equal(1);
        expect(result.transports[0]).to.equal(fakeTransport);
    });
});

describe('cloneOptions', () => {
    it('should be a function', () => {
        expect(cloneOptions).to.be.a('function');
        expect(cloneOptions.length).to.equal(1);
    });
    it('should clone options', () => {
        const options: StrictLoggerOptions = {
            level: 'warn',
            transports: [],
        };
        const result = cloneOptions(options);
        expect(result).to.be.a('object');
        expect(result.level).to.equal('warn');
        expect(result.transports).to.be.an('array');
        expect(result.transports.length).to.equal(0);
        expect(result.transports).to.not.equal(options.transports);
    });
});

describe('winstonLog', () => {
    it('should be a function', () => {
        expect(winstonLog).to.be.a('function');
        expect(winstonLog.length).to.equal(1);
    });
    it('should build middlweare with logger', async () => {
        const middleware = winstonLog();
        expect(middleware).to.be.a('function');
        const ctx = mockPlatformContext<WinstonContext>();
        const next = spy();
        const results = await middleware(ctx, next);
        expect(results).to.equal(undefined);
        expect(next.callCount).to.oneOf([0, 1]);
        expect(ctx.log).to.be.an('object');
        expect(ctx.log.info).to.be.a('function');
    });
});
