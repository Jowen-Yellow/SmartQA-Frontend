<template>
  <div id="appStatistics">
    <a-space direction="vertical" size="large">
      <a-card style="width: 80vw">
        <v-chart
          :option="userAnswerCountOptions"
          style="width: 70%; height: 300px"
        />
      </a-card>
      <a-card style="width: 80vw">
        <div style="text-align: right">
          <a-space>
            <span>应用ID</span>
            <a-select
              :options="appIdOptions"
              v-model="appId"
              style="width: 120px"
              placeholder="请选择应用"
            />
          </a-space>
        </div>
        <v-chart
          :option="userAnswerResultCountOptions"
          style="width: 70%; height: 300px"
        />
      </a-card>
    </a-space>
  </div>
</template>

<script setup lang="ts">
import VChart from "vue-echarts";
import "echarts";
import { computed, ref, watchEffect } from "vue";
import {
  getAppAnswerCount,
  getAppAnswerResultCount,
} from "@/api/appStatisticsController";
import { Message } from "@arco-design/web-vue";

// eslint-disable-next-line no-undef
const userAnswerCount = ref<API.AppAnswerCountDTO[]>();
// eslint-disable-next-line no-undef
const userAnswerResultCount = ref<API.AppAnswerResultCountDTO[]>();
const appId = ref<number>();
const appIdOptions = computed(() => {
  return userAnswerCount.value?.map((data) => data.appId as number);
});

const userAnswerCountOptions = computed(() => ({
  xAxis: {
    name: "应用ID",
    type: "category",
    data: userAnswerCount.value?.map((data) => String(data.appId)),
  },
  yAxis: {
    name: "回答数量",
    type: "value",
  },
  series: [
    {
      data: userAnswerCount.value?.map((data) => data.answerCount),
      type: "bar",
    },
  ],
}));
const userAnswerResultCountOptions = computed(() => ({
  title: {
    text: "用户答案结果统计",
    left: "center",
  },
  tooltip: {
    trigger: "item",
  },
  legend: {
    orient: "vertical",
    left: "left",
  },
  series: [
    {
      name: "结果名称",
      type: "pie",
      radius: "60%",
      data: userAnswerResultCount.value?.map((data) => ({
        name: data.resultName,
        value: data.resultCount,
      })),
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ],
}));

const requestForAppAnswerCount = async () => {
  const res = await getAppAnswerCount();
  if (res.data.code === 0 && res.data.data) {
    userAnswerCount.value = res.data.data;
    appId.value = userAnswerCount.value[0]?.appId;
  } else {
    Message.error("获取应用回答统计失败" + res.data.message);
  }
};
const requestForAppAnswerResultCount = async (params: { appId: number }) => {
  const res = await getAppAnswerResultCount(params);
  if (res.data.code === 0 && res.data.data) {
    userAnswerResultCount.value = res.data.data;
  } else {
    Message.error("获取应用回答结果统计失败" + res.data.message);
  }
};

watchEffect(() => {
  requestForAppAnswerCount();
});
watchEffect(() => {
  if (appId.value) {
    requestForAppAnswerResultCount({ appId: appId.value });
  }
});
</script>

<style scoped>
#appStatistics {
  width: 100%;
}
</style>
