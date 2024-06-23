<template>
  <a-card>
    <a-row v-if="isOwner" style="margin-bottom: 16px">
      <a-col flex="auto" class="content-wrapper">
        <h1>{{ data.resultName }}</h1>
        <div>
          <h1
            :style="{
              fontFamily: 'Chocolate Classical Sans, sans-serif',
              display: 'inline-block',
            }"
          >
            “
          </h1>
          {{ data.resultDesc }}
        </div>
        <p>
          <a-space size="medium">
            <a-button
              type="primary"
              size="small"
              shape="round"
              @click="() => router.push({ path: '/answer/do/' + data.appId })"
            >
              重新答题
            </a-button>
          </a-space>
        </p>
      </a-col>
      <a-col flex="300px">
        <a-image
          width="100%"
          :src="data.resultPicture"
          :alt="data.resultName"
        />
      </a-col>
    </a-row>
    <h1 v-else>无权限</h1>
  </a-card>
</template>

<script setup lang="ts">
import { Message } from "@arco-design/web-vue";
import { computed, defineProps, ref, watchEffect, withDefaults } from "vue";
import API from "@/api";
import { useLoginUserStore } from "@/store/userStore";
import { useRouter } from "vue-router";
import { getUserAnswerVoById } from "@/api/userAnswerController";

const router = useRouter();

interface Props {
  id: number;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => 0,
});

const data = ref<API.UserAnswerVO>({});

// 获取登录用户
const loginUserStore = useLoginUserStore();
let loginUserId = loginUserStore.loginUser.id;
// 是否为本人创建
const isOwner = computed(() => {
  return loginUserId && loginUserId === data.value.userId;
});

const loadData = async () => {
  const res = await getUserAnswerVoById({ id: props.id });
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
