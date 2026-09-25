### How to create custom errors
```typescript
import {createRootError} from '@jsnw/errors';

// We have to create root error first
const RootError = createRootError(Symbol.for('my-root-error'));

// Now we can implement our custom error
export class MyCustomError extends RootError<{greeting: 'hello' | 'bonjour';}>{
    public static override errorName = 'MyCustomError';
    
    // Optionally, you can override getMessage method to specify the message that is returned by this error by default
    public override getMessage(): string{
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
| Error                            | Context                                                               |
|----------------------------------|-----------------------------------------------------------------------|
| `InvalidArgumentError`           | `{ argName: string; expected?: string; actual?: string; }`            |
| `ConfigurationError`             | `{ key: string; reason?: string; }`                                   |
| `TimeoutError`                   | no context                                                            |
| `RateLimitError`                 | `{ retryAfterMs?: number; limit?: number; }`                          |
| `ValidationError`                | `{ issues: Array<{ path: (string \| number)[]; message: string; }> }` |
| `NotImplementedError`            | `{ feature?: string; }`                                               |
| `ParseError`                     | `{ input?: string; format?: string; }`                                |
| `ExternalServiceError<TDetails>` | `{ service: string; operation?: string; details?: TDetails; }`        |
| `UnauthorizedError`              | no context                                                            |
| `ForbiddenError`                 | `{ action?: string; resource?: string; }`                             |
| `ConflictError`                  | `{ entity: string; field?: string; value?: unknown; }`                |

Each of these implements `getMessage()`, so `err.message` is already a readable string built 
from error `context` - no need to format it yourself 
