<script>
import { useRef } from "react";
import { useBoolean, useInput } from "./base-hooks";
import { useAsync } from "./useAsync";
import { computed, watchEffect, watch } from "@vue/composition-api";
import { getMemberDetails, updateTeamMember } from "../server/apiClient";

export default {
  props: {
    name: String
  },
  setup(props) {
    const loading = useBoolean();

    const { result: data } = useAsync(
      "details",
      computed(() => [props.name]),
      getMemberDetails
    );

    const nickname = useInput();

    const comment = useInput();

    watch(
      () => data.value,
      () => {
        if (data.value.state === "done") {
          nickname.value = data.value.data.nickname;
          comment.value = data.value.data.comment;
        }
      }
    );

    function onSubmit(e) {
      e.preventDefault();

      loading.set(true);

      updateTeamMember({
        name: props.name,
        comment: comment.value,
        nickname: nickname.value
      })
        .then(data.refetch)
        .then(() => {
          loading.set(false);
        });
    }

    return {
      loading,
      data,
      onSubmit,
      nickname,
      comment
    };
  }
};
</script>

<template>
  <div v-if="data.state === 'done'">
    <div class="details-header">
      <h1>Details for {{name}} (#{{data.data.number}})</h1>
      <span class="link" @click="$emit('back')">back</span>
    </div>
    <form class="details-form" @submit="onSubmit">
      <img :src="data.data.img" />
      <label>Nickname</label>
      <input v-bind="nickname" v-on="nickname.listeners" />
      <br />
      <label>Comment</label>
      <input v-bind="comment" v-on="comment.listeners" />
      <br />
      <button :disabled="loading.value.value">{{loading.value.value ? "Loading" : "Save"}}</button>
    </form>
  </div>
</template>

