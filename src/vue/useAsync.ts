import {
  computed,
  ref,
  Ref,
  watch
} from "@vue/composition-api";

export function useAsync<TResult, TArgs extends any[] = []>(
  type: string,
  keys: Ref<TArgs | null | undefined | 0 | false>,
  asyncFn:
    | ((...args: any) => Promise<TResult>)
    | ((...args: TArgs) => Promise<TResult>),
  options?: { suspense?: boolean }
): {
  result: Ref<AsyncResult<TResult>>;
  refetch: () => Promise<void>;
} {
  const argsKey = computed(
    () => type + JSON.stringify(keys.value)
  );

  function isCurrent(cacheKey: string) {
    const cached = promiseCache[cacheKey];
    return cached && Date.now() - cached.timestamp < 10000;
  }

  const result = ref<AsyncResult<TResult>>(
    promiseCache[argsKey.value]?.result &&
      isCurrent(argsKey.value)
      ? {
          state: "done",
          data: promiseCache[argsKey.value]!.result,
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

  function getData(forceRefetch?: boolean) {
    if (!keys.value) {
      throw new Error("Should never happen");
    }

    let cached = promiseCache[argsKey.value];
    if (
      !cached ||
      !isCurrent(argsKey.value) ||
      forceRefetch
    ) {
      promiseCache[argsKey.value] = {
        promise: asyncFn(...keys.value).then(x => {
          if (promiseCache[argsKey.value]) {
            promiseCache[argsKey.value]!.result = x;
          }
          return x;
        }),
        timestamp: Date.now(),
        result: undefined
      };
      cached = promiseCache[argsKey.value]!;
    }
    return cached;
  }

  function refetch() {
    if (!keys) return Promise.resolve();
    return getData(true)
      .promise.then(r => {
        result.value = {
          state: "done",
          data: r,
          error: undefined
        };
      })
      .catch(error => {
        result.value = {
          state: "error",
          data: undefined,
          error
        };
      });
  }

  watch(argsKey, (argsKey, prevArgsKey, onInvalidate) => {
    if (!keys.value) {
      result.value = {
        state: "idle",
        data: undefined,
        error: undefined
      };
      return;
    }

    let cancelled = false;
    onInvalidate(() => {
      cancelled = true;
    });

    const cached = getData();
    if (cached.result) {
      if (result.value.state !== "done") {
        result.value = {
          state: "done",
          data: cached.result,
          error: undefined
        };
      }
    } else {
      result.value = {
        state: "pending",
        data: undefined,
        error: undefined
      };

      cached.promise
        .then(r => {
          if (cancelled) return;
          result.value = {
            state: "done",
            data: r,
            error: undefined
          };
        })
        .catch(error => {
          if (cancelled) return;
          result.value = {
            state: "error",
            data: undefined,
            error
          };
        });
    }
  });

  return { result, refetch };
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
