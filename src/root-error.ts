import type {IfAllPropertiesOptional} from './types';

export type ErrorContext = { [key: string]: any; };
export type ErrorParams<T extends ErrorContext = {}> =
    (IfAllPropertiesOptional<T, { context?: T; }, { context: T; }>)
    & { message?: string; cause?: Error; isRetryable?: boolean; };

export function createRootError(marker: symbol, name?: string) {
    class RootError<T extends ErrorContext = {}> extends Error {
        protected static errorName: string = 'RootError';
        public readonly [marker] = true;

        public get name(): string {
            return (this.constructor as typeof RootError).errorName ?? name ?? 'RootError';
        }

        public readonly message: string;
        public readonly code: string;
        public readonly context: T;
        public readonly isRetryable: boolean;
        public readonly cause?: Error;

        public static isInstance<T extends new (...args: any[]) => any>(this: T, error: unknown): error is InstanceType<T> {
            if(error instanceof this)
                return true;

            return typeof error === 'object' && error !== null
                && marker in error
                && 'name' in error && typeof error['name'] === 'string'
                && error['name'] === (this as unknown as typeof RootError).errorName;
        }

        public constructor(
            ...args: IfAllPropertiesOptional<T, true, false> extends true
                ? [params?: ErrorParams<T>]
                : [params: ErrorParams<T>]
        ) {
            const params: ErrorParams<T> = (args[0] ?? {}) as ErrorParams<T>;
            super();

            this.code = this.name.replace(/([a-zA-Z])(?=[A-Z])/g, '$1_').toUpperCase();
            this.context = (params?.context ?? {}) as T;
            this.message = params?.message ?? this.getMessage();
            this.isRetryable = !!params?.isRetryable;
            this.cause = params?.cause;
        }

        public getMessage(): string {
            return '';
        }

    }

    return RootError;
}

export type AnyRootErrorInstance = ReturnType<typeof createRootError>;
