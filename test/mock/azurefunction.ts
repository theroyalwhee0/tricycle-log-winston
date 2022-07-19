import { spy } from 'sinon';
import {
    HttpRequest, Context, BindingDefinition,
    ContextBindingData, ContextBindings, ExecutionContext,
    Logger, TraceContext, Form,
    HttpMethod, HttpRequestHeaders, HttpRequestParams,
    HttpRequestQuery, HttpRequestUser, AzureFunction
} from '@azure/functions';

type LoggerFn = (...args: unknown[]) => void;

export const ALL = Symbol('ALL');

export function mockAzureLogger(): Logger {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const all: LoggerFn = spy((..._args: unknown[]): void => {
        return;
    });
    const logger: LoggerFn = spy((...args: unknown[]) => {
        return all(...args);
    });
    const error: LoggerFn = spy((...args: unknown[]) => {
        return all(...args);
    });
    const warn: LoggerFn = spy((...args: unknown[]) => {
        return all(...args);
    });
    const info: LoggerFn = spy((...args: unknown[]) => {
        return all(...args);
    });
    const verbose: LoggerFn = spy((...args: unknown[]) => {
        return all(...args);
    });

    // UNSAFE CODE - START
    const azureLogger: Logger = logger as Logger;
    Object.assign(azureLogger, {
        error, warn, info, verbose,
        [ALL]: all
    });
    // UNSAFE CODE - END

    return azureLogger;
}


export class MockAzureContext implements Context {
    invocationId: string;
    executionContext: ExecutionContext;
    bindings: ContextBindings;
    bindingData: ContextBindingData;
    traceContext: TraceContext;
    bindingDefinitions: BindingDefinition[];
    log: Logger;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    done(_err?: string | Error, _result?: unknown): void {
        throw new Error('Method not implemented.');
    }
    req: HttpRequest;
    res: { [key: string]: unknown; };

    constructor() {
        this.invocationId = 'test';
        this.bindingDefinitions = [];
        this.req = new MockAzureHttpRequest();
        this.res = {
            headers: {},
            body: undefined,
        };
    }
}

export class MockAzureHttpRequest implements HttpRequest {
    method: HttpMethod;
    url: string;
    headers: HttpRequestHeaders;
    query: HttpRequestQuery;
    params: HttpRequestParams;
    user: HttpRequestUser;
    body?: unknown;
    rawBody?: unknown;
    parseFormBody(): Form {
        throw new Error('Method not implemented.');
    }

    constructor() {
        this.method = 'GET';
        this.url = '/birdseed';
        this.headers = {};
        this.query = {};
        this.params = {};
    }
}

export type MockCallFuncResults = {
    context: Context,
    request: HttpRequest
    response: { [key: string]: unknown; }
};

export async function mockCallFunc(func: AzureFunction): Promise<MockCallFuncResults> {
    const context = new MockAzureContext();
    const request = context.req;
    const results = await func(context, request);
    if (results !== undefined) {
        throw new Error(`Expected func results to be undefined.`);
    }
    const response = context.res;
    return {
        context,
        request,
        response
    };
}
