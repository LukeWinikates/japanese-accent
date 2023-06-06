export declare type LoadableWithError<T> =
  { state: "new" } |
  { state: "loading" } |
  { state: "loaded", data: T } |
  { state: "error", message: string };
