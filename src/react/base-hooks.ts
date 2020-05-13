import {
  ComponentProps,
  useCallback,
  useState
} from "react";

export function useInput(initialValue = "") {
  const [value, setValue] = useState(initialValue);
  const [touched, setTouched] = useState(false);

  const onChange: ComponentProps<
    "input"
  >["onChange"] = useCallback(e => {
    setValue(e.target.value);
  }, []);

  const onBlur: ComponentProps<
    "input"
  >["onChange"] = useCallback(e => {
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
