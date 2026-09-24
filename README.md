### How to create custom errors
```typescript
import {createRootError} from '@jsnw/errors';

// We have to create root error first
const RootError = createRootError(Symbol.for('my-root-error'));

// Now we can implement our custom error
export class MyCustomError extends RootError<{greeting: 'hello' | 'bonjour';}>{
    protected static override errorName = 'MyCustomError';
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
- `NotImplementedError`
- `InvalidArgumentError`
- `ConfigurationError`
- `TimeoutError`
- `RateLimitError`
- `ValidationError`
- `ParseError`
- `ExternalServiceError`
- `UnauthorizedError`
- `ForbiddenError`
