import { isArray } from '@theroyalwhee0/istype';
import { Middleware, TricycleContext } from '@tricycle/tricycle';
import { createLogger, Logger, LoggerOptions } from 'winston';
import * as Transport from 'winston-transport';
import { AzureLoggerTransport } from './transport';

/** 
 * The name of the Tricycle Context property to add.
 */
const LOG_PROP = 'log';

/**
 * Strict LoggerOptions. 'transports' must be an array.
 */
export interface StrictLoggerOptions extends LoggerOptions {
    transports: Transport[]
}

/**
 * Additions to Tricycle context.
 */
export type WinstonAdded = {
    log: Logger
};

/**
 * Combined Tricycle context.
 */
export type WinstonContext = TricycleContext & WinstonAdded;

/**
 * Build Strict LoggerOptions from Logger options.
 * @param logOptions The Winston logger options.
 * @returns Strict logger options, with defaults.
 */
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

/**
 * Clone the logger options.
 * @param logOptions The Winston logger options.
 * @returns Cloned logger options.
 */
export function cloneOptions(logOptions: StrictLoggerOptions): StrictLoggerOptions {
    const options: StrictLoggerOptions = Object.assign({}, logOptions);
    options.transports = options.transports.slice();
    return options;
}

/**
 * Build the Winston middleare for Tricycle.
 * @param logOptions The Winston logger options.
 * @returns The Winston Tricycle middleware.
 */
export function winstonLog(logOptions?: LoggerOptions): Middleware<WinstonContext> {
    const options = buildOptions(logOptions);
    const winstoneLogMiddleware: Middleware<WinstonContext> = async (ctx, next) => {
        const opts: StrictLoggerOptions = cloneOptions(options);
        const transport = new AzureLoggerTransport(ctx.platform.azureContext.log);
        opts.transports.push(transport);
        if (LOG_PROP in ctx) {
            throw new Error(`Expected Tricycle context property '${LOG_PROP}' to be unpopulated.`);
        }
        const log = createLogger(opts);
        Object.defineProperty(ctx, LOG_PROP, {
            get: () => log,
        });
        await next();
        log.close();
    };
    return winstoneLogMiddleware;
}
