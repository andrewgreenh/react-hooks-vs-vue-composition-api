<template>
  <div>
    <h1>Hello World!</h1>
    <component v-bind:is="myComp" v-on:click.native="console.log($event)"></component>
  </div>
</template>

<script>
import { ref } from "@vue/composition-api";
import ButtonVue from "./Button.vue";
import InputVue from "./Input.vue";

export default {
  components: {
    ButtonVue,
    InputVue
  },
  setup(props, context) {
    console.log(context);
    const componentRef = ref(ButtonVue);

    setTimeout(() => {
      componentRef.value = InputVue;
    }, 5000);

    return {
      console,
      myComp: componentRef
    };
  }
};
</script>
