import { Context, Tricycle } from '@tricycle/tricycle';
import { Mock } from './index';

export class MockTricycle<TContext extends Context> extends Tricycle<TContext> {
    [Mock]: true;
}

export function mockTricycle<TContext extends Context>(): MockTricycle<TContext> {
    return new MockTricycle<TContext>();
}