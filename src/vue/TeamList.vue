<script>
import SearchVue from "./Search.vue";

export default {
  props: {
    names: Array
  },
  components: {
    SearchVue
  },
  setup(props, context) {
    return {};
  }
};
</script>

<template>
  <div>
    <h1>My Pokemon Team</h1>
    <ul class="team-list">
      <li v-for="name in names" :key="name">
        <span class="link" @click="$emit('select', name)">{{name}}</span>
        <span class="link" @click="$emit('remove', name)">remove</span>
      </li>
    </ul>
    <search-vue @add="$emit('add', $event)" />
  </div>
</template>


