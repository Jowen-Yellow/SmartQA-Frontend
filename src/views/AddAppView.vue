<template>
  <div id="userLoginView">
    <a-form
      :model="form"
      :style="{ width: '400px', margin: '0 auto' }"
      @submit="handleSubmit"
    >
      <a-form-item>
        <h2 :style="{ margin: '0 auto' }">
          {{ id ? "修改应用" : "创建应用" }}
        </h2>
      </a-form-item>
      <a-form-item field="appName" label="应用名称">
        <a-input
          class="input"
          size="large"
          v-model="form.appName"
          placeholder="应用名称"
        />
      </a-form-item>
      <a-form-item field="appDesc" label="应用描述">
        <a-input
          class="input"
          size="large"
          v-model="form.appDesc"
          placeholder="应用描述"
        />
      </a-form-item>
      <a-form-item field="appIcon" label="应用图标">
        <ImgUploader
          v-if="id"
          biz="user_avatar"
          :set-file-name="setFileName"
          :default-img="form.appIcon"
        />
        <ImgUploader v-else biz="user_avatar" :set-file-name="setFileName" />
      </a-form-item>
      <a-form-item field="appType" label="应用类型">
        <a-select
          placeholder="应用类型"
          :style="{
            border: '1px solid #d9d9d9',
            'border-radius': '8px',
          }"
          v-model="form.appType"
          @change="
            (value) => {
              currentAppType = value as number;
            }
          "
        >
          <a-option
            v-for="(value, key) in AppTypeMap"
            :key="value"
            :value="Number(key)"
            :label="value"
            :disabled="
              AppTypeEnum.SCORE.valueOf() === Number(key) &&
              currentScoringStrategy === ScoringStrategyEnum.AI.valueOf()
            "
          />
        </a-select>
      </a-form-item>
      <a-form-item field="scoringStrategy" label="评分策略">
        <a-select
          placeholder="评分策略"
          :style="{
            border: '1px solid #d9d9d9',
            'border-radius': '8px',
          }"
          v-model="form.scoringStrategy"
          @change="value => {
            currentScoringStrategy = value as number;
          }"
        >
          <a-option
            v-for="(value, key) in ScoringStrategyMap"
            :disabled="
              ScoringStrategyEnum.AI.valueOf() === Number(key) &&
              currentAppType === AppTypeEnum.SCORE.valueOf()
            "
            :key="value"
            :value="Number(key)"
            :label="value"
          />
        </a-select>
      </a-form-item>
      <a-form-item>
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
  AppTypeEnum,
  AppTypeMap,
  ScoringStrategyEnum,
  ScoringStrategyMap,
} from "@/constant/app";
import { addApp, editApp, getAppVoById } from "@/api/appController";
import ImgUploader from "@/components/ImgUploader.vue";
import { getFileUrl } from "@/api/fileController";

const router = useRouter();

let form = ref<API.AppAddRequest>({
  appName: "",
  appDesc: "",
  appIcon: "",
  appType: AppTypeEnum.SCORE,
  scoringStrategy: ScoringStrategyEnum.CUSTOM,
});

const currentAppType = ref<number>(AppTypeEnum.SCORE.valueOf());
const currentScoringStrategy = ref<number>(
  ScoringStrategyEnum.CUSTOM.valueOf()
);

const setFileName = (fileName: string) => {
  form.value.appIcon = fileName;
};
const handleSubmit = async () => {
  if (props.id) {
    // 修改应用
    const res = await editApp(form.value);
    if (res.data.code === 0) {
      Message.success("修改成功，即将跳转详情页");
      setTimeout(() => {
        router.push({ path: "/app/detail/" + props.id });
      }, 1000);
    } else {
      Message.error(res.data.message as string);
    }
  } else {
    // 创建应用
    const res = await addApp(form.value);
    if (res.data.code === 0) {
      Message.success("创建成功，即将跳转详情页");
      setTimeout(() => {
        router.push({ path: "/app/detail/" + res.data.data });
      }, 1000);
    } else {
      Message.error(res.data.message as string);
    }
  }
};

interface Props {
  id: number;
}

const props = withDefaults(defineProps<Props>(), {
  id: 0,
});

const loadData = async () => {
  if (!props.id) return;
  const res = await getAppVoById({ id: props.id });
  if (res.data.code === 0 && res.data.data) {
    form.value = res.data.data;
  } else {
    Message.error(res.data.message as string);
  }
};

watchEffect(() => {
  loadData();
});

// 加载图片
const appIcon = ref<string>("");
const loadAppIcon = async (filePath: string) => {
  const res = await getFileUrl({ filePath });
  if (res.data.code === 0 && res.data.data) {
    appIcon.value = res.data.data;
  }
};
watchEffect(() => {
  if (form.value.appIcon) {
    loadAppIcon(form.value.appIcon);
  }
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

.footer {
  display: flex;
  justify-content: space-between;
  width: 80%;
  margin: 10px auto 0;
}
</style>
