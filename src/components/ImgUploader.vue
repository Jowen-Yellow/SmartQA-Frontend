<template>
  <a-space direction="vertical" :style="{ width: '100%' }">
    <a-upload
      :action="uploadUrl"
      :fileList="file ? [file] : []"
      :show-file-list="false"
      :data="{ biz }"
      with-credentials
      @change="onChange"
      @progress="onProgress"
      @success="onSuccess"
    >
      <template #upload-button>
        <div
          :class="`arco-upload-list-item${
            file && file.status === 'error'
              ? ' arco-upload-list-item-error'
              : ''
          }`"
        >
          <div
            class="arco-upload-list-picture custom-upload-avatar"
            v-if="file && file.url"
          >
            <img :src="file.url" alt="图片加载失败" />
            <div class="arco-upload-list-picture-mask">
              <IconEdit />
            </div>
            <a-progress
              v-if="file.status === 'uploading' && file.percent < 100"
              :percent="file.percent"
              type="circle"
              size="mini"
              :style="{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translateX(-50%) translateY(-50%)',
              }"
            />
          </div>
          <div
            class="arco-upload-list-picture custom-upload-avatar"
            v-else-if="defaultImg"
          >
            <img :src="appIcon" alt="图片加载失败" />
            <div class="arco-upload-list-picture-mask">
              <IconEdit />
            </div>
          </div>
          <div class="arco-upload-picture-card" v-else>
            <div class="arco-upload-picture-card-text">
              <IconPlus />
              <div style="margin-top: 10px">上传</div>
            </div>
          </div>
        </div>
      </template>
    </a-upload>
  </a-space>
</template>

<script setup lang="ts">
import { IconEdit, IconPlus } from "@arco-design/web-vue/es/icon";
import { defineProps, ref, watchEffect, withDefaults } from "vue";
import { FileItem, Message } from "@arco-design/web-vue";
import { getFileUrl } from "@/api/fileController";

const file = ref();
const uploadUrl = process.env.VUE_APP_API_URL + "/file/upload";

interface Props {
  biz: string;
  setFileName: (fileName: string) => void;
  defaultImg?: string;
}

const props = withDefaults(defineProps<Props>(), {});

const onChange = (_: unknown, currentFile: FileItem) => {
  file.value = {
    ...currentFile,
    // url: URL.createObjectURL(currentFile.file),
  };
};
const onProgress = (currentFile: FileItem) => {
  file.value = currentFile;
};
const onSuccess = (currentFile: FileItem) => {
  const res = currentFile.response;
  if (res.code === 0) {
    Message.success("上传成功");
    props.setFileName(res.data);
  } else {
    Message.error("上传失败:" + res.message);
  }
};

// 加载图片
const appIcon = ref<string>("");
const loadAppIcon = async (filePath: string) => {
  const res = await getFileUrl({ filePath });
  if (res.data.code === 0 && res.data.data) {
    appIcon.value = res.data.data;
  }
};
watchEffect(() => {
  if (props.defaultImg) {
    loadAppIcon(props.defaultImg);
  }
});
</script>
