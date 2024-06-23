<template>
  <a-card>
    <a-row style="margin-bottom: 16px">
      <a-col flex="auto" class="content-wrapper">
        <h2>{{ data.appName }}</h2>
        <p>{{ data.appDesc }}</p>
        <p>
          应用类型：{{ AppTypeMap[data.appType as keyof typeof AppTypeMap] }}
        </p>
        <p>
          评分策略：{{
            ScoringStrategyMap[
              data.scoringStrategy as keyof typeof ScoringStrategyMap
            ]
          }}
        </p>
        <p>
          作者：
          <a-avatar :size="24" :image-url="data.user?.userAvatar" />
          {{ data.user?.userName }}
        </p>
        <p>
          创建时间：{{ dayjs(data.createTime).format("YYYY-MM-DD HH:mm:ss") }}
        </p>
        <p>
          <a-space size="medium">
            <a-button
              type="primary"
              size="small"
              shape="round"
              @click="() => router.push({ path: '/answer/do/' + id })"
            >
              开始答题
            </a-button>
            <a-button size="small" shape="round">分享应用</a-button>
            <a-button
              v-if="isOwner"
              size="small"
              shape="round"
              @click="() => router.push({ path: '/add/question/' + id })"
              >设置问题
            </a-button>
            <a-button
              v-if="isOwner"
              size="small"
              shape="round"
              @click="() => router.push({ path: '/add/scoringResult/' + id })"
              >设置评分
            </a-button>
            <a-button
              v-if="isOwner"
              size="small"
              shape="round"
              @click="(ev) => router.push({ path: '/add/app/' + id })"
              >修改应用
            </a-button>
          </a-space>
        </p>
      </a-col>
      <a-col flex="300px">
        <a-image width="100%" :src="data.appIcon" :alt="data.appName" />
      </a-col>
    </a-row>
  </a-card>
</template>

<script setup lang="ts">
import { Message } from "@arco-design/web-vue";
import { withDefaults, defineProps, ref, watchEffect, computed } from "vue";
import API from "@/api";
import { AppTypeMap, ScoringStrategyMap } from "@/constant/app";
import dayjs from "dayjs";
import { useLoginUserStore } from "@/store/userStore";
import { useRouter } from "vue-router";
import { getAppVoById } from "@/api/appController";

const router = useRouter();

interface Props {
  id: number;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => 0,
});

const data = ref<API.AppVO>({});

// 获取登录用户
const loginUserStore = useLoginUserStore();
let loginUserId = loginUserStore.loginUser.id;
// 是否为本人创建
const isOwner = computed(() => {
  return loginUserId && loginUserId === data.value.userId;
});

const loadData = async () => {
  const res = await getAppVoById({ id: props.id });
  if (res.data.code === 0) {
    data.value = res.data.data || {};
  } else {
    Message.error(res.data.message as string);
  }
};

watchEffect(() => {
  loadData();
});
</script>

<style scoped>
.content-wrapper > p {
  margin-bottom: 24px;
}
</style>
