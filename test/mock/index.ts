import { Context, ContextKind, Next } from '@tricycle/tricycle';
import { spy } from 'sinon';
import { mockAzureContext, MockAzureContextOptions } from './azure';
import { mockTricycle } from './tricycle';

/**
 * Mock symbol.
 */
export const Mock = Symbol('Mock');

/**
 * Mock Next.
 */
export const mockNext = ():Next => spy();

/**
 * Mock Context Optins
 */
export type MockContextOptions = { 
    azureContext?:MockAzureContextOptions 
};

/**
 * Mock context with platform.
 */
export function mockPlatformContext<TContext extends Context>(options?:MockContextOptions):TContext {
    const app = mockTricycle<TContext>();
    const ctx:TContext = {
        app: app,
        kind: ContextKind.Unknown,
        platform: {
            azureContext: mockAzureContext(options?.azureContext),
        },
    } as unknown as TContext;
    return ctx;
}
