<template>
  <div id="home">
    <a-form
      :model="searchForm"
      :style="{ margin: '0 auto' }"
      @submit="doSearch"
    >
      <a-form-item field="username" hide-label>
        <a-space>
          <a-input
            v-model="searchForm.appName"
            class="searchInput"
            placeholder="应用名称"
            size="large"
          />
          <a-button
            class="searchButton"
            html-type="submit"
            shape="round"
            size="large"
            type="primary"
          >
            搜索
          </a-button>
        </a-space>
      </a-form-item>
    </a-form>
    <a-list
      :bordered="false"
      :data="dataList"
      :gridProps="{ gutter: [20, 20], sm: 24, md: 12, lg: 8, xl: 6 }"
      :pagination-props="{
        ...searchParams,
        total,
      }"
      @page-change="pageChange"
    >
      <template #item="{ item }">
        <AppCard :app="item" />
      </template>
    </a-list>
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from "vue";
import API from "@/api";
import { Message } from "@arco-design/web-vue";
import { listAppVoByPageUsingPost } from "@/api/appController";
import { ReviewStatusEnum } from "@/constant/app";
import AppCard from "@/components/AppCard.vue";
import App = API.App;

// 搜索
const searchForm = ref<API.AppQueryRequest>({
  appName: "",
});

const doSearch = async () => {
  searchParams.value = {
    ...searchParams.value,
    ...searchForm.value,
    current: 1,
  };
};

const searchParams = ref<API.AppQueryRequest>({
  current: 1,
  pageSize: 12,
});
const dataList = ref<App[]>();
const total = ref<number>();

const loadData = async () => {
  const res = await listAppVoByPageUsingPost({
    ...searchParams.value,
    reviewStatus: ReviewStatusEnum.PASS,
  });
  if (res.data.code === 0) {
    dataList.value = res.data.data?.records || [];
    total.value = Number(res.data.data?.total) || 0;
  } else {
    Message.error(res.data.message as string);
  }
};

const pageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    ...searchForm,
    current: page,
  };
};

// 监听loadData中的变量，如果有变化则重新渲染页面
watchEffect(() => {
  loadData();
});
</script>
<style scoped>
.searchInput {
  width: 200px;
  border-radius: 8px;
}

.icon-hover {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  transition: all 0.1s;
}

.icon-hover:hover {
  background-color: rgb(var(--gray-2));
}
</style>
