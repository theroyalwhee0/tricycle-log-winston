import { Logger as AzureLogger } from '@azure/functions';
import { LogEntry } from 'winston';
import TransportStream, { TransportStreamOptions } from 'winston-transport';
import { MESSAGE, LEVEL } from 'triple-beam';

// REF: https://github.com/winstonjs/winston#adding-custom-transports
// REF: https://github.com/winstonjs/winston-transport

export type WinstonLogLevel = 'error' | 'warn' | 'info' | 'http' | 'debug' | 'silly';
export type AzureLogLevel = 'error' | 'warn' | 'info' | 'verbose';
export const winstoneToAzureLevels: Readonly<Record<WinstonLogLevel, AzureLogLevel>> = {
    'error': 'error',
    'warn': 'warn',
    'info': 'info',
    'http': 'verbose',
    'debug': 'verbose',
    'silly': 'verbose',
};
export const fallbackLevel: AzureLogLevel = 'verbose';


export interface LogEntryWithSumbols extends LogEntry {
    // Add symbol properties to LogEntry.
    [LEVEL]?: string,
    [MESSAGE]?: string,
}

export class AzureLoggerTransport extends TransportStream {
    constructor(private azureLogger: Readonly<AzureLogger>, opts?: Readonly<TransportStreamOptions>) {
        super(opts);
    }

    public log(info: Readonly<LogEntryWithSumbols>, next: () => void): void {
        const winstonLevel = info[LEVEL] ?? info.level;
        const message = info[MESSAGE] ?? info.message;
        const level = this.mapWinstonToAzureLevel(winstonLevel);
        this.azureLogger[level](message);
        next();
    }

    private isWinstonLogLevel(level: string): level is WinstonLogLevel {
        return level in winstoneToAzureLevels;
    }

    private mapWinstonToAzureLevel(level: string): AzureLogLevel {
        level = level.toLowerCase();
        if (this.isWinstonLogLevel(level)) {
            return winstoneToAzureLevels[level];
        } else {
            return fallbackLevel;
        }
    }
}