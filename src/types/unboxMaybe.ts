import { Maybe } from '../api'

type InferArrayOfMaybe<T> = T extends Array<Maybe<infer R>>
  ? Array<UnboxMaybeMap<R>>
  : T extends Object
  ? UnboxMaybeMap<T>
  : T
type UnboxMaybeMap<T> = {
  [P in keyof T]: T[P] extends Object ? UnboxMaybeMap<T[P]> : InferArrayOfMaybe<T[P]>
}

export type UnboxMaybe<T> = InferArrayOfMaybe<T>
