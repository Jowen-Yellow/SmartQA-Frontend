import { createApp } from "vue";
import ArcoVue from "@arco-design/web-vue";
import App from "./App.vue";
import router from "./router";
import "@arco-design/web-vue/dist/arco.css";
import { createPinia } from "pinia";
import "@/access";
import echarts from "echarts";

const myMixin = {
  echarts: echarts,
};
const pinia = createPinia();
createApp(App).use(ArcoVue).use(pinia).use(router).mixin(myMixin).mount("#app");
console.log(process.env);
