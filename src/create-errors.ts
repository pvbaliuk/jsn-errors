import {type AnyRootErrorInstance} from './root-error';

export function createErrors(RootError: AnyRootErrorInstance) {
    return {
        InvalidArgumentError: class InvalidArgumentError extends RootError<{
            argName: string;
            expected?: string;
            actual?: string;
        }> {
            public static override errorName = 'InvalidArgumentError';

            public override getMessage(): string {
                const details = [
                    this.context.expected && `expected: ${this.context.expected}`,
                    this.context.actual && `got: ${this.context.actual}`
                ].filter(Boolean);

                return `Invalid argument: ${this.context.argName}` + (details.length > 0 ? '; ' + details.join(', ') : '');
            }
        },
        ConfigurationError: class ConfigurationError extends RootError<{ key: string; reason?: string; }> {
            public static override errorName = 'ConfigurationError';

            public override getMessage(): string {
                return `Invalid configuration: ${this.context.key}` + (
                    this.context.reason ? ` - ${this.context.reason}` : ''
                );
            }
        },
        TimeoutError: class TimeoutError extends RootError {
            public static override errorName = 'TimeoutError';
        },
        RateLimitError: class RateLimitError extends RootError<{ retryAfterMs?: number; limit?: number; }> {
            public static override errorName = 'RateLimitError';

            public override getMessage(): string {
                return 'Rate limit exceeded' + (
                    this.context.retryAfterMs ? `, retry after ${this.context.retryAfterMs}ms` : ''
                );
            }
        },
        ValidationError: class ValidationError extends RootError<{
            issues: Array<{ path: (string | number)[]; message: string; }>
        }> {
            public static override errorName = 'ValidationError';

            public override getMessage(): string {
                const first = this.context.issues[0];
                const suffix = this.context.issues.length > 1 ? ` (+${this.context.issues.length - 1} more)` : '';
                return first
                    ? `Validation failed: ${first.path.join('.')} — ${first.message}${suffix}`
                    : 'Validation failed';
            }
        },
        NotImplementedError: class NotImplementedError extends RootError<{ feature?: string; }> {
            public static override errorName = 'NotImplementedError';

            public override getMessage(): string {
                return this.context.feature
                    ? `Not implemented: ${this.context.feature}`
                    : 'Not implemented';
            }
        },
        ParseError: class ParseError extends RootError<{ input?: string; format?: string; }> {
            public static override errorName = 'ParseError';

            public override getMessage(): string {
                return `Failed to parse ${this.context.format ? ' ' + this.context.format : ''}`;
            }
        },
        ExternalServiceError: class ExternalServiceError<TDetails extends Record<string, unknown> = {}> extends RootError<{
            service: string;
            operation?: string;
            details?: TDetails;
        }> {
            public static override errorName = 'ExternalServiceError';

            public override getMessage(): string {
                return `External service failure: ${this.context.service}`
                    + (this.context.operation ? ` (operation: ${this.context.operation})` : '');
            }
        },
        UnauthorizedError: class UnauthorizedError extends RootError {
            public static override errorName = 'UnauthorizedError';

            public override getMessage(): string {
                return 'Authentication required';
            }
        },
        ForbiddenError: class ForbiddenError extends RootError<{ action?: string; resource?: string; }> {
            public static override errorName = 'ForbiddenError';

            public override getMessage(): string {
                return this.context.action && this.context.resource
                    ? `Forbidden: cannot ${this.context.action} ${this.context.resource}`
                    : 'Forbidden';
            }
        },
        ConflictError: class ConflictError extends RootError<{entity: string; field?: string; value?: unknown;}>{
            public static override errorName = 'ConflictError';

            public override getMessage(): string {
                return this.context.field
                    ? `${this.context.entity} conflict on \'${this.context.field}\'${this.context.value ? ': ' + JSON.stringify(this.context.value) : ''}`
                    : `${this.context.entity} conflict`;
            }
        },
        NotFoundError: class NotFoundError extends RootError<{entity: string; field?: string; value?: unknown;}>{
            public static override errorName = 'NotFoundError';

            public override getMessage(): string {
                return this.context.field
                    ? `${this.context.entity} not found: ${this.context.field}${this.context.value ? ' = ' + JSON.stringify(this.context.value) : ''}`
                    : `${this.context.entity} not found`;
            }
        }
    };
}
