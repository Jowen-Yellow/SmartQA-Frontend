<template>
  <a-form :model="searchForm" :style="{ margin: '0 auto' }" @submit="doSearch">
    <a-form-item field="username" hide-label>
      <a-space>
        <a-input
          class="searchInput"
          size="large"
          v-model="searchForm.appName"
          placeholder="应用名称"
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
    <template #appIcon="{ record }">
      <a-image width="50" :src="record.appIcon" alt="" />
    </template>
    <template #appType="{ record }">
      {{ AppTypeMap[record.appType as keyof typeof AppTypeMap] }}
    </template>
    <template #scoringStrategy="{ record }">
      {{
        ScoringStrategyMap[
          record.scoringStrategy as keyof typeof ScoringStrategyMap
        ]
      }}
    </template>
    <template #reviewStatus="{ record }">
      {{ ReviewStatusMap[record.reviewStatus as keyof typeof ReviewStatusMap] }}
    </template>
    <template #createTime="{ record }">
      {{ dayjs(record.createTime).format("YYYY-MM-DD HH:mm:ss") }}
    </template>
    <template #updateTime="{ record }">
      {{ dayjs(record.updateTime).format("YYYY-MM-DD HH:mm:ss") }}
    </template>
    <template #operation="{ record }">
      <a-space>
        <a-button
          type="primary"
          shape="round"
          v-if="record.reviewStatus !== ReviewStatusEnum.PASS"
          @click="doReview(record, ReviewStatusEnum.PASS, '审核通过')"
          >通过
        </a-button>
        <a-button
          type="secondary"
          shape="round"
          v-if="record.reviewStatus !== ReviewStatusEnum.REJECT"
          @click="doReview(record, ReviewStatusEnum.REJECT, '不符合上架要求')"
          >拒绝
        </a-button>
        <a-button status="danger" shape="round" @click="doDelete(record.id)"
          >删除
        </a-button>
      </a-space>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import API from "@/api";
import { Message, TableColumnData } from "@arco-design/web-vue";
import dayjs from "dayjs";
import {
  deleteAppUsingPost,
  listAppByPageUsingPost,
  updateAppUsingPost,
} from "@/api/appController";
import {
  AppTypeMap,
  ReviewStatusEnum,
  ReviewStatusMap,
  ScoringStrategyMap,
} from "@/constant/app";
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
  pageSize: 5,
});
const dataList = ref<App[]>();
const total = ref<number>();

const loadData = async () => {
  const res = await listAppByPageUsingPost(searchParams.value);
  if (res.data.code === 0) {
    dataList.value = res.data.data?.records || [];
    total.value = Number(res.data.data?.total) || 0;
  } else {
    Message.error(res.data.message as string);
  }
};

const doDelete = async (id: number) => {
  const res = await deleteAppUsingPost({ id });
  if (res.data.code === 0) {
    Message.success("删除成功");
    loadData().then((r) => r);
  } else {
    Message.error(res.data.message as string);
  }
};

const doReview = async (
  app: API.App,
  reviewStatus: ReviewStatusEnum,
  reviewMessage: string
) => {
  const res = await updateAppUsingPost({
    ...app,
    reviewStatus,
    reviewMessage,
  });
  if (res.data.code === 0) {
    Message.success("审核成功");
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

const columns: TableColumnData[] = [
  {
    title: "ID",
    dataIndex: "id",
  },
  {
    title: "应用名",
    dataIndex: "appName",
  },
  {
    title: "应用描述",
    dataIndex: "appDesc",
  },
  {
    title: "应用图标",
    dataIndex: "appIcon",
    slotName: "appIcon",
    align: "center",
  },
  {
    title: "应用类型",
    dataIndex: "appType",
    slotName: "appType",
  },
  {
    title: "评分策略",
    dataIndex: "scoringStrategy",
    slotName: "scoringStrategy",
  },
  {
    title: "审核状态",
    dataIndex: "reviewStatus",
    slotName: "reviewStatus",
  },
  {
    title: "审核信息",
    dataIndex: "reviewMessage",
  },
  {
    title: "审核人id",
    dataIndex: "reviewerId",
  },
  {
    title: "审核时间",
    dataIndex: "reviewTime",
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
    align: "center",
  },
];
</script>

<style scoped>
.searchInput {
  width: 200px;
  border-radius: 8px;
}
</style>
