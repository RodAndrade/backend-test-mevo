export type ApiResponse<T = any, TError = any> =
  | {
      data: T;
      error?: never;
    }
  | {
      data?: never;
      error: TError;
    };
