import VueCompositionApi from "@vue/composition-api";
import Vue from "vue";
import { getTeam } from "../server/apiClient";
import App from "./App.vue";

Vue.use(VueCompositionApi);

new Vue({
  el: "#vue-root",
  render(createElement) {
    return createElement(App);
  }
});

getTeam().then(console.log);
