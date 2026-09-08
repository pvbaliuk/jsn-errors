# jsn-utils
![coverage badge](https://img.shields.io/badge/coverage-100%25-brightgreen)

## 1.1.0
## List of utility functions

- `noop(): void` - A no-operation function that does nothing
- `ignorePromise(promise: Promise<any>): void` - Helps to suppress unhandled promise rejections
- `chunk<T>(array: T[], size: number): T[][]` - Splits array into chunks of the specified size
- `chunkStr(str: string, chunkSize: number): string[]` - Splits a string into chunks of a specified size
- `isObjectEmpty(obj: object): boolean` - Checks if the given object is empty (contains no own properties)
- `wait(ms: number, signal?: AbortSignal): Promise<void>` - Returns a promise that resolves after the specified amount of time in milliseconds or when signal is aborted
- `createPromisesCache` - deprecated; use createInFlightDeduper instead
- `createInFlightDeduper` - Creates a deduplicator for in-flight promises or sync functions. Prevents duplicate executions for the same key while a promise is pending. Clears the entry after settlement
- `resultify` - Executes a function and returns its result as a tuple `[value, error]`. Works with both sync and async functions. Never throws.

## List of utility classes

- `Monitor` class - provides simple methods to monitor execution time of functions:
    - static `measureFunctionTime(fn: Function): number | Promise<number>`
    - static `autoStart(label: string): Monitor` - Creates a new `Monitor` instance and calls `.start(label)` on it
    - `start(label: string)`
    - `mark(label: string, description?: string)`
    - `stop(label: string): MonitorResult`


### Types
#### MonitorMark
- ts: `number` - mark timestamp
- diff: `number` - difference in milliseconds between start timestamp and mark timestamp
- description?: `string` - an optional description of a mark

#### MonitorResult
- startTs: `number` - start timestamp
- stopTs: `number` - stop timestamp
- totalTime: `number` - difference between `stopTs` and `startTs`
- marks: `MonitorMark[]` - array of marks (if any)
