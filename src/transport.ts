import { Logger as AzureLogger } from '@azure/functions';
import { LogEntry } from 'winston';
import TransportStream, { TransportStreamOptions } from 'winston-transport';

// REF: https://github.com/winstonjs/winston#adding-custom-transports
// REF: https://github.com/winstonjs/winston-transport

export class AzureLoggerTransport extends TransportStream {
    constructor(private _azureLogger: AzureLogger, opts?: TransportStreamOptions) {
        super(opts);
    }

    public log(info: LogEntry, next: () => void): void {
        if (process.env.NODE_ENV === 'development') {
            console.log("@@ log", info);
        }
        next();
    }
}