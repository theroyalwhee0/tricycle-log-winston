# @tricycle/log-winston : Winston Logger Middleware for TricycleJS

## Description
Tricycle Log Winston is a middleware library for [TricycleJS](https://github.com/theroyalwhee0/tricycle) that attaches a Winston logger that outputs to the Azure Functions log to the TricycleJS context.


## Installation
`npm install @tricycle/log-winston`


## Usage
When creating the application's instance of Tricycle:
```ts
import Tricycle from '@tricycle/tricycle';
import { winstonLog, WinstonContext } from '@tricycle/log-winston';

export default new Tricycle<WinstonContext>()
    .use(winstonLog({ format: format.simple() });
```

Within middleware or endpoints:
```ts
ctx.log.info('This will write to the Azure Functions logger');
```


## Links
- GitHub: https://github.com/theroyalwhee0/tricycle-log-winston
- NPM: https://www.npmjs.com/package/@tricycle/log-winston


## History
- v0.1.2
    - Upgrade to work with Tricycle v0.1.x.
    - Simplify tests.
    - Improve build and publish.
    - Exclude .github from npm publish.
- v0.1.1
    - Update Tricycle and update tests to match.
    - Add Usage to readme.
- v0.1.0
     - Working logger middleware.
- v0.0.2
    - Fix build.
- v0.0.1
    - Initial release. Work in progress. Testing integration.


## Legal & License
Copyright 2022 Adam Mill

This library is released under Apache 2 license. See [LICENSE](https://github.com/theroyalwhee0/tricycle/blob/master/LICENSE) for more details.
