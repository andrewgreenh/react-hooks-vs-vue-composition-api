import { reactive, ref } from "@vue/composition-api";

export function useInput(initialValue = "") {
  const value = ref(initialValue);
  const touched = ref(false);

  function onInput(event: { target: HTMLInputElement }) {
    value.value = event.target.value;
  }

  function onBlur() {
    touched.value = true;
  }

  const result = reactive({
    value: value,
    "data-touched": touched,
    touched: touched,
    listeners: {
      input: onInput,
      blur: onBlur
    }
  });

  return result;
}

export function useBoolean(initialValue = false) {
  const value = ref(false);

  const toggle = () => (value.value = !value.value);

  const set = (newValue: boolean) => (value.value = newValue);
  return {
    toggle,
    set,
    value
  };
}
