<template>
  <a-row id="globalHeader" align="center" :wrap="false">
    <a-col flex="auto">
      <a-menu
        mode="horizontal"
        :selected-keys="selectedKeys"
        @menu-item-click="doMenuItemClick"
      >
        <a-menu-item
          key="0"
          :style="{ padding: 0, marginRight: '38px' }"
          disabled
        >
          <div class="titleBar">
            <a-space>
              <img src="../assets/logo.png" alt="logo" class="logo" />
              <span class="title">SmartQA</span>
            </a-space>
          </div>
        </a-menu-item>
        <a-menu-item v-for="route in visibleRoutes" :key="route.path">
          {{ route.name }}
        </a-menu-item>
      </a-menu>
    </a-col>
    <a-col flex="100px">
      <div v-if="loginUser.id">
        {{ loginUser.userName ?? "匿名用户" }}
      </div>
      <div v-else>
        <a-button type="primary" href="/user/login">登录</a-button>
      </div>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import routes from "../router/routes";
import { useRoute, useRouter } from "vue-router";
import { computed, ref } from "vue";
import { useLoginUserStore } from "@/store/userStore";
import { storeToRefs } from "pinia";
import checkAccess from "@/access/checkAccess";
import { AccessEnum } from "@/access/accessEnum";

const loginUserStore = useLoginUserStore();
const loginUser = storeToRefs(loginUserStore).loginUser;

const visibleRoutes = computed(() => {
  return routes.filter(
    (route) =>
      !route.meta?.hideInMenu &&
      checkAccess(loginUserStore.loginUser, route.meta?.access as AccessEnum)
  );
});
const router = useRouter();
const route = useRoute();
const selectedKeys = ref<string[]>([route.path]);
router.afterEach((to) => {
  selectedKeys.value = [to.path];
});

const doMenuItemClick = (key: string) => {
  router.push({ path: key });
};
</script>

<style scoped>
#globalHeader {
  margin-bottom: 16px;
  box-shadow: #eee 1px 1px 5px;
}

.titleBar {
  display: flex;
  align-items: center;

  .logo {
    width: 40px;
    height: 40px;
  }

  .title {
    color: black;
    font-weight: bold;
  }
}
</style>
