<template>
  <a-card id="appCard" hoverable @click="doCardClick">
    <template #actions>
      <span class="icon-hover"> <IconThumbUp /> </span>
      <span class="icon-hover" @click="doShare">
        <IconShareInternal />
      </span>
    </template>
    <template #cover>
      <div
        :style="{
          height: '204px',
          overflow: 'hidden',
        }"
      >
        <img
          :style="{ width: '100%', transform: 'translateY(-20px)' }"
          :alt="app.appName"
          :src="app.appIcon"
        />
      </div>
    </template>
    <a-card-meta :title="app.appName" :description="app.appDesc">
      <template #avatar>
        <div
          :style="{
            display: 'flex',
            alignItems: 'center',
            color: '#1D2129',
          }"
        >
          <a-avatar
            :size="24"
            :style="{ marginRight: '8px' }"
            :image-url="app.user?.userAvatar"
          />
          <a-typography-text
            >{{ app.user?.userName ?? "匿名用户" }}
          </a-typography-text>
        </div>
      </template>
    </a-card-meta>
  </a-card>
  <ShareModal :link="link" ref="shareModalRef" />
</template>

<script setup lang="ts">
import { IconShareInternal, IconThumbUp } from "@arco-design/web-vue/es/icon";
import API from "@/api";
import { computed, defineProps, ref, withDefaults } from "vue";
import { useRouter } from "vue-router";
import ShareModal from "@/components/ShareModal.vue";

const router = useRouter();

interface Props {
  app: API.AppVO;
}

const props = withDefaults(defineProps<Props>(), {
  app: () => ({}),
});

const shareModalRef = ref();
const link = computed(
  () => `${location.protocol}//${location.host}/app/detail/${props.app.id}`
);

const doCardClick = () => {
  router.push(`/app/detail/${props.app.id}`);
};

const doShare = (e: Event) => {
  if (shareModalRef.value) {
    shareModalRef.value.handleOpen();
  }
  e.stopPropagation();
};
</script>

<style scoped>
#appCard {
  cursor: pointer;
}
</style>
