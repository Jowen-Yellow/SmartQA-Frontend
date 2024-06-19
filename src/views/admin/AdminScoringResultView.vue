<template>
  <a-form :model="searchForm" :style="{ margin: '0 auto' }" @submit="doSearch">
    <a-form-item field="username" hide-label>
      <a-space>
        <a-input
          class="searchInput"
          size="large"
          v-model="searchForm.resultName"
          placeholder="问题内容"
        />
        <a-button
          class="searchButton"
          html-type="submit"
          type="primary"
          shape="round"
          size="large"
        >
          搜索
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
  <a-table
    :columns="columns"
    :data="dataList"
    @page-change="pageChange"
    :pagination="{
      pageSize: 5,
      total: total,
      showTotal: true,
      current: searchParams.current,
    }"
  >
    <template #resultPicture="{ record }">
      <a-image width="50" :src="record.resultPicture" alt="" />
    </template>
    <template #createTime="{ record }">
      {{ dayjs(record.createTime).format("YYYY-MM-DD HH:mm:ss") }}
    </template>
    <template #updateTime="{ record }">
      {{ dayjs(record.updateTime).format("YYYY-MM-DD HH:mm:ss") }}
    </template>
    <template #operation="{ record }">
      <a-button status="danger" shape="round" @click="doDelete(record.id)"
        >删除
      </a-button>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import API from "@/api";
import { Message } from "@arco-design/web-vue";
import dayjs from "dayjs";
import {
  deleteScoringResultUsingPost,
  listScoringResultByPageUsingPost,
} from "@/api/scoringResultController";
import ScoringResult = API.ScoringResult;

// 搜索
const searchForm = ref<API.ScoringResultQueryRequest>({
  resultName: "",
});

const doSearch = async () => {
  searchParams.value = {
    ...searchParams.value,
    ...searchForm.value,
    current: 1,
  };
};

const searchParams = ref<API.ScoringResultQueryRequest>({
  current: 1,
  pageSize: 5,
});
const dataList = ref<ScoringResult[]>();
const total = ref<number>();

const loadData = async () => {
  const res = await listScoringResultByPageUsingPost(searchParams.value);
  if (res.data.code === 0) {
    dataList.value = res.data.data?.records || [];
    total.value = Number(res.data.data?.total) || 0;
  } else {
    Message.error(res.data.message as string);
  }
};

const doDelete = async (id: number) => {
  const res = await deleteScoringResultUsingPost({ id });
  if (res.data.code === 0) {
    Message.success("删除成功");
    loadData().then((r) => r);
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

const columns = [
  {
    title: "ID",
    dataIndex: "id",
  },
  {
    title: "结果名称",
    dataIndex: "resultName",
  },
  {
    title: "结果描述",
    dataIndex: "resultDesc",
  },
  {
    title: "结果图片",
    dataIndex: "resultPicture",
    slotName: "resultPicture",
  },
  {
    title: "结果属性集合 JSON",
    dataIndex: "resultProp",
  },
  {
    title: "结果得分范围",
    dataIndex: "resultScoreRange",
  },
  {
    title: "应用 id",
    dataIndex: "appId",
  },
  {
    title: "创建用户 id",
    dataIndex: "userId",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    slotName: "createTime",
  },
  {
    title: "更新时间",
    dataIndex: "updateTime",
    slotName: "updateTime",
  },
  {
    title: "操作",
    dataIndex: "operation",
    slotName: "operation",
  },
];
</script>

<style scoped>
.searchInput {
  width: 200px;
  border-radius: 8px;
}
</style>
