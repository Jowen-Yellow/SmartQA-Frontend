<template>
  <a-button type="primary" @click="handleClick" shape="round" size="small"
    >AI生成题目
  </a-button>
  <a-drawer :width="340" :visible="visible" unmountOnClose>
    <template #footer>
      <a-space size="medium">
        <a-button @click="handleCancel">取消</a-button>
        <a-button type="primary" @click="handleOkSSE" :loading="loading"
          >{{ loading ? "生成中" : "生成" }}
        </a-button>
      </a-space>
    </template>
    <template #title>参数设置</template>
    <div>
      <a-form
        label-align="left"
        auto-label-width
        :model="data"
        :style="{ width: '80%', margin: '0 auto' }"
        :disabled="loading"
      >
        <a-form-item label="问题数量">
          <a-input-number class="input" v-model="data.questionNumber" />
        </a-form-item>
        <a-form-item label="选项数量">
          <a-input-number class="input" v-model="data.optionNumber" />
        </a-form-item>
      </a-form>
    </div>
  </a-drawer>
</template>

<script setup lang="ts">
import { defineProps, ref, withDefaults } from "vue";
import API from "@/api";
import { aiGenerateQuestionUsingPost } from "@/api/questionController";
import { Message } from "@arco-design/web-vue";

const visible = ref(false);
const loading = ref(false);

interface Props {
  appId: number;
  onSuccess: (result: API.QuestionContentDTO[]) => void;
  onSSEMessage: (result: API.QuestionContentDTO) => void;
}

const props = withDefaults(defineProps<Props>(), {});

const data = ref<API.AiGenerateQuestionRequest>({
  appId: props.appId,
  questionNumber: 10,
  optionNumber: 4,
});
let yieldNumber = 0;

const handleClick = () => {
  visible.value = true;
};
const handleOk = async () => {
  loading.value = true;
  const res = await aiGenerateQuestionUsingPost(data.value);
  if (res.data.code === 0 && res.data.data) {
    props.onSuccess(res.data.data);
    visible.value = false;
    Message.success("生成成功");
  } else {
    Message.error("生成失败");
  }
  loading.value = false;
};
const handleOkSSE = () => {
  loading.value = true;
  const eventSource = new EventSource(
    "http://localhost:8101/api/question/ai_generate/sse?appId=" +
      props.appId +
      "&questionNumber=" +
      data.value.questionNumber +
      "&optionNumber=" +
      data.value.optionNumber
  );
  eventSource.onmessage = (event) => {
    yieldNumber++;
    if (yieldNumber === data.value.questionNumber) {
      eventSource.close();
      loading.value = false;
      visible.value = false;
      Message.success("生成成功");
      yieldNumber = 0;
    }
    props.onSSEMessage(JSON.parse(event.data));
  };
  eventSource.onerror = (error) => {
    Message.error("生成失败：" + error);
    eventSource.close();
    loading.value = false;
    yieldNumber = 0;
  };
};
const handleCancel = () => {
  visible.value = false;
};
</script>

<style scoped>
.input {
  border: 1px solid #d9d9d9;
  border-radius: 8px;
}
</style>
