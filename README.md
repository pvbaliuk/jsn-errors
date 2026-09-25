### How to create custom errors

```typescript
import {createRootError} from '@jsnw/errors';

// We have to create root error first
const RootError = createRootError(Symbol.for('my-root-error'));

// Now we can implement our custom error
export class MyCustomError extends RootError<{ greeting: 'hello' | 'bonjour'; }> {
    public static override errorName = 'MyCustomError';

    // Optionally, you can override getMessage method to specify the message that is returned by this error by default
    public override getMessage(): string {
        return `Custom greeting: ${this.context.greeting}`;
    }
}

// ---
throw new MyCustomError({context: {greeting: 'hello'}});
```

### How to create common errors

```typescript
import {createRootError, createErrors} from '@jsnw/errors';

const RootError = createRootError(Symbol.for('my-root-error'));

export const MyErrors = createErrors(RootError);

// Alternatively you can do this
const errors = createErrors(RootError);

export const AllMyErrors = {
    ...errors,
    RootError
} as const;
```

### Currently available common errors

| Error                            | Description                                                         | Context                                                               |
|----------------------------------|---------------------------------------------------------------------|-----------------------------------------------------------------------|
| `InvalidArgumentError`           | An argument passed to a function/method failed validation           | `{ argName: string; expected?: string; actual?: string; }`            |
| `ConfigurationError`             | A required or invalid configuration value                           | `{ key: string; reason?: string; }`                                   |
| `TimeoutError`                   | An operation exceeded its allotted time                             | no context                                                            |
| `RateLimitError`                 | A rate limit was hit                                                | `{ retryAfterMs?: number; limit?: number; }`                          |
| `ValidationError`                | Structured validation failed with one or more issues                | `{ issues: Array<{ path: (string \| number)[]; message: string; }> }` |
| `NotImplementedError`            | A feature or code path is not yet implemented                       | `{ feature?: string; }`                                               |
| `ParseError`                     | Parsing input in a given format failed                              | `{ input?: string; format?: string; }`                                |
| `ExternalServiceError<TDetails>` | A call to an external service failed                                | `{ service: string; operation?: string; details?: TDetails; }`        |
| `UnauthorizedError`              | The caller is not authenticated                                     | no context                                                            |
| `ForbiddenError`                 | The caller is authenticated but not allowed to perform the action   | `{ action?: string; resource?: string; }`                             |
| `ConflictError`                  | The operation conflicts with existing state (e.g. a duplicate)      | `{ entity: string; field?: string; value?: unknown; }`                |
| `NotFoundError`                  | An entity could not be found (optionally by a specific field/value) | `{ entity: string; field?: string; value?: unknown; }`                |

Each of these implements `getMessage()`, so `err.message` is already a readable string built
from error `context` - no need to format it yourself 
