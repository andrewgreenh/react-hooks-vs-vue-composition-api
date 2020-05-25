import { ChangeEvent, useCallback, useState } from "react";

export function useInput(initialValue = "") {
  const [value, setValue] = useState(initialValue);
  const [touched, setTouched] = useState(false);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    },
    []
  );

  const onBlur = useCallback(() => {
    setTouched(true);
  }, []);

  return {
    value,
    onChange,
    onBlur,
    "data-touched": touched
  };
}

export function useBoolean(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(x => !x);
  }, []);

  const set = useCallback((value: boolean) => {
    setValue(value);
  }, []);

  return {
    toggle,
    set,
    value
  };
}
