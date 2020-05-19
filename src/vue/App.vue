
<script>
import { ref, watch, watchEffect } from "@vue/composition-api";
import ButtonVue from "./Button.vue";
import InputVue from "./Input.vue";
import { useAsync } from "./useAsync";
import { getTeamNames, removeFromTeam, addToTeam } from "../server/apiClient";
import TeamListVue from "./TeamList.vue";

export default {
  components: {
    TeamListVue
  },
  setup(props, context) {
    const { result: membersResult, refetch } = useAsync(
      "team-names",
      ref([]),
      getTeamNames
    );

    const selectedMember = ref(null);

    function onSelect(name) {
      selectedMember.value = name;
    }

    function onRemove(name) {
      removeFromTeam(name).then(refetch);
    }

    function onAdd(name) {
      addToTeam(name).then(refetch);
    }

    return {
      membersResult,
      onAdd,
      onRemove,
      onSelect,
      selectedMember
    };
  }
};
</script>


<template>
  <div>
    <team-list-vue
      :names="membersResult.data || []"
      @select="onSelect($event)"
      @remove="onRemove($event)"
      @add="onAdd($event)"
    ></team-list-vue>
  </div>
</template>

