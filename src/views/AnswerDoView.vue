<template>
  <div id="answerDoView">
    <div :style="{ marginBottom: '20px' }">
      <h2>{{ app.appName }}</h2>
      <div>{{ app.appDesc }}</div>
    </div>

    <a-card>
      <h3>{{ currentQuestion.title }}</h3>
      <a-radio-group
        direction="vertical"
        v-model="currentAnswer"
        @change="(value) => (answerList[current - 1] = value as string)"
      >
        <a-radio
          v-for="(item, index) in currentQuestion.options"
          :key="index"
          :value="item.key"
        >
          {{ item.key }}、{{ item.value }}
        </a-radio>
      </a-radio-group>
      <div :style="{ marginTop: '20px' }">
        <a-space>
          <a-button
            v-if="current < questionContent.length"
            shape="round"
            type="primary"
            :disabled="!currentAnswer"
            @click="current++"
            >下一题
          </a-button>
          <a-popconfirm content="确定提交结果吗？" @ok="checkResult">
            <a-button
              :loading="loading"
              v-if="current === questionContent.length"
              shape="round"
              type="primary"
              >查看结果
            </a-button>
          </a-popconfirm>
          <a-button
            v-if="current > 1"
            shape="round"
            type="primary"
            @click="current--"
            >上一题
          </a-button>
        </a-space>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { defineProps, reactive, ref, watchEffect, withDefaults } from "vue";
import API from "@/api";
import { listQuestionVoByPageUsingPost } from "@/api/questionController";
import { Message } from "@arco-design/web-vue";
import { getAppVoByIdUsingGet } from "@/api/appController";
import { useRouter } from "vue-router";
import {
  addUserAnswerUsingPost,
  generateUserAnswerIdUsingGet,
} from "@/api/userAnswerController";

const router = useRouter();

// 加载数据
const loading = ref<boolean>(false);

// 应用
const app = ref<API.AppVO>({});

// 题目列表
const questionContent = ref<API.QuestionContentDTO[]>([]);
// 当前题目序号（从1开始）
const current = ref<number>(1);
// 档期那题目
const currentQuestion = ref<API.QuestionContentDTO>({});
// 当前题目用户答案
const currentAnswer = ref<string>();
// 用户答案列表
const answerList = reactive<string[]>([]);

// id
const id = ref<number>();

const checkResult = async () => {
  loading.value = true;
  const res = await addUserAnswerUsingPost({
    appId: props.appId,
    choices: answerList,
    id: id.value,
  });
  if (res.data.code === 0) {
    await router.push({
      path: "/answer/result/" + res.data.data,
    });
  } else {
    Message.error(("提交答案失败：" + res.data.message) as string);
  }
  loading.value = false;
};

interface Props {
  appId: number;
}

const props = withDefaults(defineProps<Props>(), {});
// 获取题目列表
const loadData = async () => {
  await loadApp();
  await loadQuestion();
};
const loadApp = async () => {
  const res = await getAppVoByIdUsingGet({ id: props.appId });
  if (res.data.code === 0) {
    app.value = res.data.data ?? {};
  } else {
    Message.error(("获取应用信息失败：" + res.data.message) as string);
  }
};
const loadQuestion = async () => {
  const res = await listQuestionVoByPageUsingPost({
    appId: props.appId,
    current: 1,
    pageSize: 1,
    sortField: "createTime",
    sortOrder: "descend",
  });
  if (res.data.code === 0 && res.data.data?.records) {
    questionContent.value = res.data.data?.records[0]?.questionContent ?? [];
    currentQuestion.value = questionContent.value[0] ?? {};
  } else {
    Message.error(("获取题目列表失败：" + res.data.message) as string);
  }
};

const generateId = async () => {
  const res = await generateUserAnswerIdUsingGet();
  if (res.data.code === 0) {
    id.value = res.data.data;
  } else {
    Message.error(("获取用户答案id失败：" + id.data.message) as string);
  }
};

watchEffect(() => {
  generateId();
});
watchEffect(() => {
  loadData();
});

watchEffect(() => {
  currentQuestion.value = questionContent.value[current.value - 1] ?? {};
  currentAnswer.value = answerList[current.value - 1];
});
</script>

<style scoped>
.input {
  border: 1px solid #d9d9d9;
  border-radius: 8px;
}
</style>
