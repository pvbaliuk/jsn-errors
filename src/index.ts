import type {IfAllPropertiesOptional} from './types';

const JSNW_ERROR_MARKER = Symbol.for('@jsnw/errors:JsnwError');

export type JsnwErrorContext = { [key: string]: any; };
export type JsnwErrorParams<T extends JsnwErrorContext = {}> =
    (IfAllPropertiesOptional<T, { context?: T; }, { context: T; }>)
    & { message?: string; cause?: Error; isRetryable?: boolean; };

export class JsnwError<T extends JsnwErrorContext = {}> extends Error {

    public readonly [JSNW_ERROR_MARKER] = true;

    public get name(): string {
        return 'JsnwError';
    }

    public readonly message: string;
    public readonly code: string;
    public readonly context: T;
    public readonly isRetryable: boolean;
    public readonly cause?: Error;

    public constructor(
        ...args: IfAllPropertiesOptional<T, true, false> extends true
            ? [params?: JsnwErrorParams<T>]
            : [params: JsnwErrorParams<T>]
    ) {
        const params: JsnwErrorParams<T> = (args[0] ?? {}) as JsnwErrorParams<T>;
        super();

        this.code = this.name.replace(/([a-zA-Z])(?=[A-Z])/g, '$1_').toUpperCase();
        this.context = (params?.context ?? {}) as T;
        this.message = params?.message ?? this.getMessage();
        this.isRetryable = !!params?.isRetryable;
        this.cause = params?.cause;
    }

    protected getMessage(): string {
        return '';
    }

}

export class InvalidArgumentError extends JsnwError<{ argName: string; expected?: string; actual?: string; }> {

    public get name(): string {
        return 'InvalidArgumentError';
    }

    protected getMessage(): string {
        const details = [
            this.context.expected && `expected: ${this.context.expected}`,
            this.context.actual && `got: ${this.context.actual}`
        ].filter(Boolean);

        return `Invalid argument: ${this.context.argName}` + (details.length > 0 ? '; ' + details.join(', ') : '');
    }

}

export class TimeoutError extends JsnwError {

    public get name(): string {
        return 'TimeoutError';
    }

}

export class NotFoundError<T extends string | number = string | number> extends JsnwError<{
    entity: string;
    id: string | number;
}> {

    public get name(): string {
        return 'NotFoundError';
    }

    protected getMessage(): string {
        return `${this.context.entity} not found: ${this.context.id}`;
    }

}

export class ValidationError extends JsnwError<{ issues: Array<{ path: (string | number)[]; message: string; }> }> {

    public get name(): string {
        return 'ValidationError';
    }

    protected getMessage(): string {
        const first = this.context.issues[0];
        const suffix = this.context.issues.length > 1 ? ` (+${this.context.issues.length - 1} more)` : '';
        return first
            ? `Validation failed: ${first.path.join('.')} — ${first.message}${suffix}`
            : 'Validation failed';
    }

}

export class ConflictError extends JsnwError<{ entity: string; field?: string; value?: unknown; }> {

    public get name(): string {
        return 'ConflictError';
    }

    protected getMessage(): string {
        return this.context.field
            ? `${this.context.entity} conflict on ${this.context.field}: ${JSON.stringify(this.context.value)}`
            : `${this.context.entity} conflict`;
    }

}

export class InvalidStateError extends JsnwError<{ entity: string; expectedState?: string; actualState: string; }> {

    public get name(): string {
        return 'InvalidStateError';
    }

    protected getMessage(): string {
        return `${this.context.entity} is in invalid state: ${this.context.expectedState}`
            + (this.context.expectedState ? ` (expected: ${this.context.expectedState})` : '');
    }
}

export class UnauthorizedError extends JsnwError {

    public get name(): string {
        return 'UnauthorizedError';
    }

    protected getMessage(): string {
        return 'Authentication required';
    }

}

export class ForbiddenError extends JsnwError<{ action?: string; resource?: string; }> {

    public get name(): string {
        return 'ForbiddenError';
    }

    protected getMessage(): string {
        return this.context.action && this.context.resource
            ? `Forbidden: cannot ${this.context.action} ${this.context.resource}`
            : 'Forbidden';
    }

}

export class ExternalServiceError extends JsnwError<{ service: string; operation?: string; }> {

    public get name(): string {
        return 'ExternalServiceError';
    }

    protected getMessage(): string {
        return `External service failure: ${this.context.service}`
            + (this.context.operation ? ` (${this.context.operation})` : '');
    }

}

export class RateLimitError extends JsnwError<{ retryAfterMs?: number; limit?: number; }> {

    public get name(): string {
        return 'RateLimitError';
    }

    protected getMessage(): string {
        return 'Rate limit exceeded' + (
            this.context.retryAfterMs ? `, retry after ${this.context.retryAfterMs}ms` : ''
        );
    }

}

export class ConfigurationError extends JsnwError<{ key: string; reason?: string; }> {

    public get name(): string {
        return 'ConfigurationError';
    }

    protected getMessage(): string {
        return `Invalid configuration: ${this.context.key}` + (
            this.context.reason ? ` — ${this.context.reason}` : ''
        );
    }

}

export class NotImplementedError extends JsnwError<{ feature?: string; }> {

    public get name(): string {
        return 'NotImplementedError';
    }

    protected getMessage(): string {
        return this.context.feature
            ? `Not implemented: ${this.context.feature}`
            : 'Not implemented';
    }

}

export class InvariantError extends JsnwError<{ expression?: string; }> {

    public get name(): string {
        return 'InvariantError';
    }

    protected getMessage(): string {
        return this.context.expression
            ? `Invariant violated: ${this.context.expression}`
            : 'Invariant violated';
    }

}

export class ParseError extends JsnwError<{ input?: string; format?: string; }> {

    public get name(): string {
        return 'ParseError';
    }

    protected getMessage(): string {
        return `Failed to parse` + (this.context.format ? ` ${this.context.format}` : '');
    }

}

export function invariant(condition: unknown, expression?: string): asserts condition {
    if (!condition)
        throw new InvariantError({context: {expression}});
}

/**
 * @param err
 * @returns {err is JsnwError}
 */
export function isJsnwError(err: unknown): err is JsnwError {
    return !!(err && typeof err === 'object' && JSNW_ERROR_MARKER in err && err[JSNW_ERROR_MARKER] === true);
}
