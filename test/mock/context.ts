import Tricycle, { Response, Request, JsonValue, Context, RequestParams } from "@tricycle/tricycle";
import { Platform } from "@tricycle/tricycle/dist/platform";
import { Logger } from "winston";
import { WinstonContext } from "../../src/middleware";
import { MockAzureContext, mockAzureLogger } from "./azurefunction";


export class MockTricycleContext implements Context {
    app: Tricycle;
    response: Response;
    request: Request;
    platform: Platform;
    constructor() {
        this.platform = new Platform();
        this.platform.azureContext = new MockAzureContext();
    }
    get params(): RequestParams {
        throw new Error("Method not implemented.");
    }
    get url(): string {
        throw new Error("Method not implemented.");
    }
    get method(): string {
        throw new Error("Method not implemented.");
    }
    get body(): JsonValue | undefined {
        throw new Error("Method not implemented.");
    }
    get status(): number | undefined {
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
