<template>
  <button>
    Click me
    <slot data="hehe"></slot>
  </button>
</template>

<script>
import { watchEffect } from "@vue/composition-api";
export default {
  setup(props, { emit }) {
    return {};
  }
};
</script>
