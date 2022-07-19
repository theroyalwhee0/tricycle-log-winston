import { isArray } from '@theroyalwhee0/istype';
import { Context, Middleware } from '@tricycle/tricycle';
import { createLogger, Logger, LoggerOptions } from 'winston';
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
    if (!options.transports) {
        options.transports = [];
    } else if (isArray(options.transports)) {
        options.transports = options.transports.slice();
    } else {
        options.transports = [options.transports];
    }
    return options as StrictLoggerOptions;
}

export function cloneOptions(logOptions: StrictLoggerOptions): StrictLoggerOptions {
    const options: StrictLoggerOptions = Object.assign({}, logOptions);
    options.transports = options.transports.slice();
    return options;
}

export class WinstonContext extends Context {
    log: Logger
}

export function winstonLog(logOptions?: LoggerOptions): Middleware<WinstonContext> {
    const options = buildOptions(logOptions);
    const winstoneLogMiddleware: Middleware<WinstonContext> = async (ctx, next) => {
        const opts: StrictLoggerOptions = cloneOptions(options);
        const transport = new AzureLoggerTransport(ctx.platform.azureContext.log);
        opts.transports.push(transport);
        if (LOG_PROP in ctx) {
            throw new Error(`Exepected Tricycle context property '${LOG_PROP}' to be unpopulated.`);
        }
        const log = createLogger(opts);
        Object.defineProperty(ctx, LOG_PROP, {
            get: () => log
        });
        await next();
        log.close();
    };
    return winstoneLogMiddleware;
}
