import { describe, it } from 'mocha';
import { expect } from 'chai';
import { spy } from 'sinon';
import { LogEntry } from 'winston';
import { Logger as AzureLogger } from '@azure/functions';
import { AzureLoggerTransport, LogEntryWithSumbols } from '../src/transport';
import { mockAzureLogger } from './mock/azurefunction';
import { MESSAGE, LEVEL } from 'triple-beam';

describe('AzureLoggerTransport', () => {
    it('should be a class', () => {
        expect(AzureLoggerTransport).to.be.a('function');
    });
    it('should log when called', () => {
        const logger: AzureLogger = mockAzureLogger();
        const transport = new AzureLoggerTransport(logger);
        const cb = spy();
        const logEntry: LogEntry = {
            level: "info",
            message: "Test"
        };
        transport.log(logEntry, cb);
        expect(cb.callCount).to.equal(1);
    });
    it('should log when called with log entry symbols', () => {
        const logger: AzureLogger = mockAzureLogger();
        const transport = new AzureLoggerTransport(logger);
        const cb = spy();
        const logEntry: LogEntryWithSumbols = {
            level: 'info',
            message: 'Test',
            [LEVEL]: "info",
            [MESSAGE]: "Test"
        };
        transport.log(logEntry, cb);
        expect(cb.callCount).to.equal(1);
    });
});
