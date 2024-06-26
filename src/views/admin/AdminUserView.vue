<template>
  <a-form :model="searchForm" :style="{ margin: '0 auto' }" @submit="doSearch">
    <a-form-item field="username" hide-label>
      <a-space>
        <a-input
          class="searchInput"
          size="large"
          v-model="searchForm.userName"
          placeholder="用户名"
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
    <template #userAvatar="{ record }">
      <a-image width="50" :src="userAvatarMap.get(record.id)" alt="" />
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
import { deleteUser, listUserByPage } from "@/api/userController";
import { Message } from "@arco-design/web-vue";
import dayjs from "dayjs";
import { getFileUrl } from "@/api/fileController";
import User = API.User;

// 搜索
const searchForm = ref<API.UserQueryRequest>({
  userName: "",
});

const doSearch = async () => {
  searchParams.value = {
    ...searchParams.value,
    ...searchForm.value,
    current: 1,
  };
};

const searchParams = ref<API.UserQueryRequest>({
  current: 1,
  pageSize: 5,
});
const dataList = ref<User[]>([]);
const total = ref<number>();

const loadData = async () => {
  const res = await listUserByPage(searchParams.value);
  if (res.data.code === 0) {
    dataList.value = res.data.data?.records || [];
    total.value = Number(res.data.data?.total) || 0;
  } else {
    Message.error(res.data.message as string);
  }
};

const doDelete = async (id: number) => {
  const res = await deleteUser({ id });
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

// 加载图片
const userAvatarMap = ref<Map<number, string>>(new Map());
const loadUserAvatar = async (filePath: string, key: number) => {
  const res = await getFileUrl({ filePath });
  if (res.data.code === 0 && res.data.data) {
    userAvatarMap.value.set(key, res.data.data);
  }
};
watchEffect(() => {
  for (let data of dataList.value) {
    if (data.userAvatar && data.id) {
      loadUserAvatar(data.userAvatar, data.id);
    }
  }
});

const columns = [
  {
    title: "ID",
    dataIndex: "id",
  },
  {
    title: "账号",
    dataIndex: "userAccount",
  },
  {
    title: "头像",
    dataIndex: "userAvatar",
    align: "center" as const,
    slotName: "userAvatar",
  },
  {
    title: "用户名",
    dataIndex: "userName",
  },
  {
    title: "角色",
    dataIndex: "userRole",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    slotName: "createTime",
  },
  {
    title: "修改时间",
    dataIndex: "updateTime",
    slotName: "updateTime",
  },
  {
    title: "操作",
    dataIndex: "operation",
    align: "center" as const,
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
