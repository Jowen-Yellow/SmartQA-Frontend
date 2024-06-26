<template>
  <a-modal :visible="visible" :footer="false" @cancel="handleClose">
    <template #title> 分享应用</template>
    <h4>复制链接</h4>
    <a-typography-paragraph copyable>{{ link }}</a-typography-paragraph>
    <h4>手机扫码查看</h4>
    <a-image :src="codeImg" />
  </a-modal>
</template>
<script setup lang="ts">
import { defineExpose, defineProps, ref, watchEffect, withDefaults } from "vue";
import QRCode from "qrcode";

const codeImg = ref();
const visible = ref(false);

interface Props {
  link: string;
}

const props = withDefaults(defineProps<Props>(), {});

watchEffect(() => {
  QRCode.toDataURL(props.link)
    .then((url: string) => {
      codeImg.value = url;
      console.log(url);
    })
    .catch((err: never) => console.log(err));
});

const handleClose = () => {
  visible.value = false;
};
const handleOpen = () => {
  visible.value = true;
};

defineExpose({
  handleOpen,
});
</script>

<style scoped></style>
