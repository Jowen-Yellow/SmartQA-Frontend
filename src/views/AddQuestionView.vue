<template>
  <div id="userLoginView">
    <a-form
      label-align="left"
      auto-label-width
      :model="questionContent"
      :style="{ width: '600px', margin: '0 auto' }"
      @submit="handleSubmit"
    >
      <a-form-item hide-label>
        <h2 :style="{ margin: '0 auto' }">
          {{ question.id ? "修改" : "创建" }}问题
        </h2>
      </a-form-item>
      <a-form-item label="应用id">
        {{ id }}
      </a-form-item>
      <a-form-item label="题目列表" :content-flex="false" :merge-props="false">
        <a-space size="large">
          <a-button
            type="primary"
            shape="round"
            size="small"
            @click="() => addQuestion(questionContent.length)"
            >添加题目
          </a-button>
          <AiGenerateQuestionDrawer
            :appId="id"
            :onSuccess="onAiGenerateQuestionSuccess"
            :onSSEMessage="onSSEMessage"
          />
        </a-space>
      </a-form-item>
      <div v-for="(item, index) in questionContent" :key="index">
        <a-collapse>
          <a-collapse-item :key="item.title">
            <template #header>
              <a-space size="large">
                <h3>题目{{ index + 1 }}</h3>
                <a-button
                  shape="round"
                  size="small"
                  @click="() => moveUpQuestion(index)"
                  >上移
                </a-button>
                <a-button
                  shape="round"
                  size="small"
                  @click="() => moveDownQuestion(index)"
                  >下移
                </a-button>
                <a-button
                  status="danger"
                  shape="round"
                  size="small"
                  @click="() => deleteQuestion(index)"
                  >删除
                </a-button>
              </a-space>
            </template>
            <a-form-item label="标题">
              <a-input class="input" v-model="item.title" />
            </a-form-item>
            <a-form-item
              label="选项列表"
              :content-flex="false"
              :merge-props="false"
            >
              <a-button
                type="primary"
                shape="round"
                size="small"
                @click="() => addOption(index)"
                >添加选项
              </a-button>
              <div
                v-for="(option, optionIndex) in item.options"
                :key="optionIndex"
              >
                <a-space size="large">
                  <h3>选项{{ optionIndex + 1 }}</h3>
                  <a-button
                    shape="round"
                    size="small"
                    @click="() => moveUpOption(index, optionIndex)"
                    >上移
                  </a-button>
                  <a-button
                    shape="round"
                    size="small"
                    @click="() => moveDownOption(index, optionIndex)"
                    >下移
                  </a-button>
                  <a-button
                    status="danger"
                    shape="round"
                    size="small"
                    @click="() => deleteOption(index, optionIndex)"
                    >删除
                  </a-button>
                </a-space>
                <a-form-item label="选项键">
                  <a-input
                    class="input"
                    v-model="option.key"
                    placeholder='"A、小猫"中，A即为选项键'
                  />
                </a-form-item>
                <a-form-item label="选项值">
                  <a-input
                    class="input"
                    v-model="option.value"
                    placeholder='"A、小猫"中，小猫即为选项值'
                  />
                </a-form-item>
                <a-form-item label="选项答案">
                  <a-input class="input" v-model="option.result" />
                </a-form-item>
                <a-form-item label="选项得分">
                  <a-input-number class="input" v-model="option.score" />
                </a-form-item>
              </div>
            </a-form-item>
          </a-collapse-item>
        </a-collapse>
      </div>

      <a-form-item hide-label>
        <a-button
          class="loginButton"
          html-type="submit"
          type="primary"
          shape="round"
          size="large"
        >
          提交
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, watchEffect, withDefaults } from "vue";
import API from "@/api";
import { Message } from "@arco-design/web-vue";
import { useRouter } from "vue-router";
import {
  addQuestionUsingPost,
  editQuestionUsingPost,
  listQuestionVoByPageUsingPost,
} from "@/api/questionController";
import AiGenerateQuestionDrawer from "@/components/AiGenerateQuestionDrawer.vue";

const router = useRouter();

const question = ref<API.QuestionVO>({});

const questionContent = ref<API.QuestionContentDTO[]>([]);

const onAiGenerateQuestionSuccess = (
  aiQuestionContent: API.QuestionContentDTO[]
) => {
  questionContent.value = [...questionContent.value, ...aiQuestionContent];
};
const onSSEMessage = (result: API.QuestionContentDTO) => {
  questionContent.value.push(result);
};

const addQuestion = (index: number) => {
  const question: API.QuestionContentDTO = {
    title: "",
    options: [],
  };
  questionContent.value.splice(index, 0, question);
};

const moveUpQuestion = (index: number) => {
  if (index <= 0 || index >= questionContent.value.length) return;
  const temp = questionContent.value[index];
  questionContent.value[index] = questionContent.value[index - 1]!;
  questionContent.value[index - 1] = temp!;
};

const moveDownQuestion = (index: number) => {
  if (index < 0 || index >= questionContent.value.length - 1) return;
  const temp = questionContent.value[index];
  questionContent.value[index] = questionContent.value[index + 1]!;
  questionContent.value[index + 1] = temp!;
};

const deleteQuestion = (index: number) => {
  questionContent.value.splice(index, 1);
};

const addOption = (questionIndex: number) => {
  const option: API.Option = {
    key: "",
    result: "",
    score: 0,
    value: "",
  };
  questionContent.value[questionIndex]?.options?.push(option);
};

const moveUpOption = (questionIndex: number, optionIndex: number) => {
  if (questionIndex < 0 || questionIndex >= questionContent.value.length)
    return;
  const options = questionContent.value[questionIndex]?.options;
  if (!options || optionIndex <= 0 || optionIndex >= options.length) return;
  const temp = options[optionIndex];
  options[optionIndex] = options[optionIndex - 1]!;
  options[optionIndex - 1] = temp!;
};

const moveDownOption = (questionIndex: number, optionIndex: number) => {
  if (questionIndex < 0 || questionIndex >= questionContent.value.length)
    return;
  const options = questionContent.value[questionIndex]?.options;
  if (!options || optionIndex < 0 || optionIndex >= options.length - 1) return;
  const temp = options[optionIndex];
  options[optionIndex] = options[optionIndex + 1]!;
  options[optionIndex + 1] = temp!;
};

const deleteOption = (questionIndex: number, optionIndex: number) => {
  questionContent.value[questionIndex]?.options?.splice(optionIndex, 1);
};

interface Props {
  id: number;
}

const props = withDefaults(defineProps<Props>(), {});

const handleSubmit = async () => {
  if (!question.value.id) {
    // 创建题目
    const res = await addQuestionUsingPost({
      appId: props.id,
      questionContent: questionContent.value,
    });
    if (res.data.code === 0) {
      Message.success("创建成功，即将跳转详情页");
      setTimeout(() => {
        router.push({ path: "/app/detail/" + props.id });
      }, 1000);
    } else {
      Message.error(res.data.message as string);
    }
  } else {
    // 修改题目
    const res = await editQuestionUsingPost({
      id: question.value.id,
      questionContent: questionContent.value,
    });
    if (res.data.code === 0) {
      Message.success("修改成功，即将跳转详情页");
      setTimeout(() => {
        router.push({ path: "/app/detail/" + props.id });
      }, 1000);
    } else {
      Message.error(res.data.message as string);
    }
  }
};

const loadData = async () => {
  if (!props.id) return;
  const res = await listQuestionVoByPageUsingPost({
    appId: props.id,
    current: 1,
    pageSize: 1,
    sortField: "createTime",
    sortOrder: "descend",
  });
  if (res.data.code === 0 && res.data.data?.records) {
    question.value = res.data.data?.records[0] ?? {};
    if (question.value.questionContent) {
      questionContent.value = question.value.questionContent;
    }
  } else {
    Message.error(res.data.message as string);
  }
};

watchEffect(() => {
  loadData();
});
</script>

<style scoped>
#userLoginView {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.loginButton {
  width: 100%;
  margin: 10px auto 0;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
}

.input {
  border: 1px solid #d9d9d9;
  border-radius: 8px;
}
</style>
