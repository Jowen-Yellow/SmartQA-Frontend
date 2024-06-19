<template>
  <div id="userLoginView">
    <!-- support from v2.25.0  -->
    <a-table
      :columns="columns"
      :data="data"
      style="margin-top: 20px"
      :pagination="{
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: total,
      }"
      @page-change="onPageChange"
    >
      <template #resultName="{ record, rowIndex }">
        <a-input
          v-if="editingTable[rowIndex]"
          class="input"
          v-model="record.resultName"
        />
        <template v-else>
          {{ record.resultName }}
        </template>
      </template>
      <template #resultDesc="{ record, rowIndex }">
        <a-input
          v-if="editingTable[rowIndex]"
          class="input"
          v-model="record.resultDesc"
        />
        <template v-else>
          {{ record.resultDesc }}
        </template>
      </template>
      <template #resultPicture="{ record, rowIndex }">
        <a-input
          v-if="editingTable[rowIndex]"
          class="input"
          v-model="record.resultPicture"
        />
        <template v-else>
          {{ record.resultPicture }}
        </template>
      </template>
      <template #resultProp="{ record, rowIndex }">
        <a-input-tag
          v-if="editingTable[rowIndex]"
          class="input"
          v-model="record.resultProp"
          placeholder="输入结果集，按回车键添加"
          allow-clear
        />
        <a-space v-else size="small">
          <template v-for="(item, index) in record.resultProp" :key="index">
            <a-tag color="green">{{ item }}</a-tag>
          </template>
        </a-space>
      </template>
      <template #resultScoreRange="{ record, rowIndex }">
        <a-input-number
          v-if="editingTable[rowIndex]"
          class="input"
          size="large"
          v-model="record.resultScoreRange"
          placeholder="结果分数范围"
        />
        <template v-else>
          {{ record.resultScoreRange }}
        </template>
      </template>
      <template #operation="{ record, rowIndex }">
        <a-space>
          <a-button
            v-if="!editingTable[rowIndex]"
            type="primary"
            shape="round"
            @click="handleEdit(rowIndex)"
          >
            编辑
          </a-button>
          <a-button
            v-else
            type="primary"
            shape="round"
            @click="handleSave(record, rowIndex)"
          >
            保存
          </a-button>
          <a-button
            status="danger"
            shape="round"
            @click="handleDelete(record.id, rowIndex)"
            >删除
          </a-button>
        </a-space>
      </template>
    </a-table>
    <a-space :style="{ marginTop: '20px' }">
      <a-button type="primary" shape="round" size="large" @click="handleAdd">
        添加评分结果
      </a-button>
      <a-button
        type="primary"
        shape="round"
        size="large"
        @click="() => router.push('/app/detail/' + id)"
      >
        返回应用详情
      </a-button>
    </a-space>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  defineProps,
  reactive,
  ref,
  watchEffect,
  withDefaults,
} from "vue";
import API from "@/api";
import {
  Message,
  PaginationProps,
  TableColumnData,
} from "@arco-design/web-vue";
import { useRouter } from "vue-router";

import {
  addScoringResultUsingPost,
  deleteScoringResultUsingPost,
  editScoringResultUsingPost,
  listScoringResultVoByPageUsingPost,
} from "@/api/scoringResultController";

const router = useRouter();

const pagination = ref<PaginationProps>({
  pageSize: 10,
  current: 1,
});
const total = ref<number>(0);
const data = ref<API.ScoringResultVO[]>([]);

const editingTable = ref<boolean[]>([]);

const handleEdit = (rowIndex: number) => {
  editingTable.value[rowIndex] = true;
};
const handleSave = async (record: API.ScoringResultVO, rowIndex: number) => {
  let res;
  if (!record.id) {
    // 创建
    res = await addScoringResultUsingPost({
      appId: props.id,
      ...record,
    });
  } else {
    // 修改
    res = await editScoringResultUsingPost({
      appId: props.id,
      ...record,
    });
  }
  if (res.data.code === 0) {
    Message.success("保存成功");
    loadData().then((r) => r);
    editingTable.value[rowIndex] = false;
  } else {
    Message.error(res.data.message as string);
  }
};
const handleDelete = async (id: number, rowIndex: number) => {
  if (!id) {
    data.value.splice(rowIndex, 1);
    return;
  }
  const res = await deleteScoringResultUsingPost({ id });
  if (res.data.code === 0) {
    Message.success("删除成功");
    loadData().then((r) => r);
  } else {
    Message.error(res.data.message as string);
  }
};
const handleAdd = () => {
  data.value.push({
    resultDesc: "",
    resultName: "",
    resultPicture: "",
    resultProp: [],
    resultScoreRange: 0,
  });
  editingTable.value.push(true);
};

const onPageChange = (page: number) => {
  pagination.value = {
    ...pagination.value,
    current: page,
  };
};

interface Props {
  id: number;
}

const props = withDefaults(defineProps<Props>(), {});

const loadData = async () => {
  if (!props.id) return;
  const res = await listScoringResultVoByPageUsingPost({
    appId: props.id,
    ...pagination.value,
  });
  if (res.data.code === 0 && res.data.data?.records) {
    data.value = res.data.data.records;
    editingTable.value = new Array(res.data.data.records.length).fill(false);
    total.value = res.data.data.total ?? 0;
  } else {
    Message.error(res.data.message as string);
  }
};

watchEffect(() => {
  loadData();
});

const columns: TableColumnData[] = [
  {
    title: "ID",
    dataIndex: "id",
  },
  {
    title: "结果名称",
    dataIndex: "resultName",
    slotName: "resultName",
  },
  {
    title: "结果描述",
    dataIndex: "resultDesc",
    slotName: "resultDesc",
  },
  {
    title: "结果图片",
    dataIndex: "resultPicture",
    slotName: "resultPicture",
    align: "center",
  },
  {
    title: "结果集",
    dataIndex: "resultProp",
    slotName: "resultProp",
  },
  {
    title: "结果得分范围",
    dataIndex: "resultScoreRange",
    slotName: "resultScoreRange",
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
#userLoginView {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.input {
  border: 1px solid #d9d9d9;
  border-radius: 8px;
}

.footer {
  display: flex;
  justify-content: space-between;
  width: 80%;
  margin: 10px auto 0;
}
</style>
