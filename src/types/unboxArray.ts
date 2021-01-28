export type UnboxArray<T extends Array<any> | null | undefined> = NonNullable<T>[number]
