import { useCallback, useEffect, useState } from "react";

export function useAsync<TResult, TArgs extends any[] = []>(
  type: string,
  keys: TArgs | null | undefined | 0 | false,
  asyncFn:
    | ((...args: any) => Promise<TResult>)
    | ((...args: TArgs) => Promise<TResult>),
  options?: { suspense?: boolean }
): AsyncResult<TResult> & { refetch: () => Promise<void> } {
  const argsKey = type + JSON.stringify(keys);

  const [result, setResult] = useState<
    AsyncResult<TResult>
  >(
    promiseCache[argsKey]?.result
      ? {
          state: "done",
          data: promiseCache[argsKey]!.result,
          error: undefined
        }
      : keys
      ? {
          state: "pending",
          data: undefined,
          error: undefined
        }
      : {
          state: "idle",
          data: undefined,
          error: undefined
        }
  );

  const getData = useCallback(
    (forceRefetch?: boolean) => {
      if (!keys) {
        throw new Error("Should never happen");
      }

      let cached = promiseCache[argsKey];
      if (
        !cached ||
        Date.now() - cached.timestamp >= 10000 ||
        forceRefetch
      ) {
        promiseCache[argsKey] = {
          promise: asyncFn(...keys).then(x => {
            if (promiseCache[argsKey]) {
              promiseCache[argsKey]!.result = x;
            }
            return x;
          }),
          timestamp: Date.now(),
          result: undefined
        };
        cached = promiseCache[argsKey]!;
      }
      return cached;
    },
    [argsKey]
  );

  const refetch = useCallback(() => {
    if (!keys) return Promise.resolve();
    return getData(true)
      .promise.then(result => {
        setResult({
          state: "done",
          data: result,
          error: undefined
        });
      })
      .catch(error => {
        setResult({
          state: "error",
          data: undefined,
          error
        });
      });
  }, [getData]);

  useEffect(() => {
    if (!keys) {
      setResult({
        state: "idle",
        data: undefined,
        error: undefined
      });
      return;
    }

    let cancelled = false;

    const cached = getData();
    if (cached.result) {
      if (result.state !== "done") {
        setResult({
          state: "done",
          data: cached.result,
          error: undefined
        });
      }
    } else {
      setResult({
        state: "pending",
        data: undefined,
        error: undefined
      });

      cached.promise
        .then(result => {
          if (cancelled) return;
          setResult({
            state: "done",
            data: result,
            error: undefined
          });
        })
        .catch(error => {
          if (cancelled) return;
          setResult({
            state: "error",
            data: undefined,
            error
          });
        });
    }

    return () => {
      cancelled = true;
    };
  }, [argsKey]);

  if (options?.suspense && result.state === "pending") {
    getData();
    throw promiseCache[argsKey]!.promise;
  }

  return {
    ...result,
    refetch
  };
}

type AsyncResult<TResult> =
  | {
      state: "done";
      data: TResult;
      error: undefined;
    }
  | {
      state: "pending";
      data: undefined;
      error: undefined;
    }
  | {
      state: "idle";
      data: undefined;
      error: undefined;
    }
  | {
      state: "error";
      data: undefined;
      error: any;
    };

const promiseCache: Partial<Record<
  string,
  { promise: Promise<any>; timestamp: number; result: any }
>> = {};
