import { Response, Request, JsonValue, HttpStatus, Context } from "@tricycle/tricycle";
import { Platform } from "@tricycle/tricycle/dist/platform";
import { Logger } from "winston";
import { WinstonContext } from "../../src/middleware";
import { MockAzureContext, mockAzureLogger } from "./azurefunction";


export class MockTricycleContext implements Context {
    constructor() {
        this.platform = new Platform();
        this.platform.azureContext = new MockAzureContext();
    }
    response: Response;
    request: Request;
    platform: Platform;
    get url(): string {
        throw new Error("Method not implemented.");
    }
    get method(): string {
        throw new Error("Method not implemented.");
    }
    get body(): JsonValue | undefined {
        throw new Error("Method not implemented.");
    }
    set body(value: JsonValue | undefined) {
        throw new Error("Method not implemented.");
    }
    get status(): HttpStatus | undefined {
        throw new Error("Method not implemented.");
    }
    set status(value: HttpStatus | undefined) {
        throw new Error("Method not implemented.");
    }

}

export class MockWinstonContext extends MockTricycleContext implements WinstonContext {
    constructor() {
        super();
        this.platform.azureContext.log = mockAzureLogger();
    }
    log: Logger;
}
