<script>
import { ref, computed } from "@vue/composition-api";
import { useAsync } from "./useAsync";
import { getInfo } from "../server/apiClient";

export default {
  components: {},
  setup(props, context) {
    const search = ref("");

    const { result: infoResult } = useAsync(
      "info",
      computed(() => search.value.length >= 3 && [search.value]),
      getInfo
    );

    function onSubmit(e) {
      e.preventDefault();
      if (infoResult.value.state !== "done") return;
      context.emit("add", infoResult.value.data.name);
      search.value = "";
    }
    return {
      search,
      infoResult,
      onSubmit
    };
  }
};
</script>

<template>
  <div class="search">
    <h2>Search Pokemon</h2>
    <form @submit="onSubmit($event)">
      <input v-model="search" />

      <div class="search-info" v-if="infoResult.state === 'done'">
        <img :src="infoResult.data.img" />
        <button>Add to Team</button>
      </div>
    </form>
  </div>
</template>
