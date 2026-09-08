type OptionalKeys<T> = {
    [K in keyof T]-?: undefined extends T[K] ? K : never;
}[keyof T];

export type IfAllPropertiesOptional<T, TIf, TElse> = T extends Record<string, unknown>
    ? Exclude<keyof T, OptionalKeys<T>> extends never
        ? TIf
        : TElse
    : TElse;
