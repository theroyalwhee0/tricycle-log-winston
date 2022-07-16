import { isArray } from '@theroyalwhee0/istype';
import { Context, Middleware } from '@tricycle/tricycle';
import { createLogger, format, Logger, LoggerOptions } from 'winston';
import * as Transport from 'winston-transport';
import { AzureLoggerTransport } from './transport';

const LOG_PROP = 'log';

export interface StrictLoggerOptions extends LoggerOptions {
    transports: Transport[]
}

export function buildOptions(logOptions?: LoggerOptions): StrictLoggerOptions {
    const options: LoggerOptions = Object.assign({}, logOptions);
    if (!options.level) {
        options.level = 'info';
    }
    if (!options.format) {
        options.format = format.simple();
    }
    if (!options.transports) {
        options.transports = [];
    } else if (isArray(options.transports)) {
        options.transports = options.transports.slice();
    } else {
        options.transports = [options.transports];
    }
    return options as StrictLoggerOptions;
}

export class WinstonContext extends Context {
    log: Logger
}

export function winstonLog(logOptions?: LoggerOptions): Middleware<WinstonContext> {
    const options = buildOptions(logOptions);
    const winstoneLogMiddleware: Middleware<WinstonContext> = (ctx) => {
        const transport = new AzureLoggerTransport(ctx.platform.azureContext.log);
        options.transports.push(transport);
        if (LOG_PROP in ctx) {
            throw new Error(`Exepected Tricycle context property '${LOG_PROP}' to be unpopulated.`);
        }
        const log = createLogger(options);
        Object.defineProperty(ctx, LOG_PROP, { get: () => log });
    };
    return winstoneLogMiddleware;
}
