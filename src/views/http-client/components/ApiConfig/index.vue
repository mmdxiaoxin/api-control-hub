<template>
  <div class="card http-config">
    <ApiHeader :api-name="apiName" />
    <!-- 请求体 -->
    <ApiRequest :initial-values="initialValues" />
    <!-- 响应体 -->
    <ApiResponse />
  </div>
</template>

<script setup lang="ts">
import ApiRequest from "./components/ApiRequest.vue";
import ApiResponse from "./components/ApiResponse.vue";
import { onMounted, ref, watch } from "vue";
import ApiHeader from "@/views/http-client/components/ApiConfig/components/ApiHeader.vue";
import { getHttpConfigApi } from "@/api/modules/http";
import { RequestForm } from "@/views/http-client/components/ApiConfig/components/ApiRequest.vue";

const apiName = ref<string>();
const initialValues = ref<RequestForm>();

const props = defineProps({
  itemId: {
    type: String,
    required: true
  }
});

async function fetchApiConfig(apiId: string) {
  const { data } = await getHttpConfigApi({ apiId });
  const { name, ...rest } = data;
  apiName.value = name;
  initialValues.value = rest;
}

onMounted(() => {
  fetchApiConfig(props.itemId);
});

watch(
  () => props.itemId,
  () => {
    fetchApiConfig(props.itemId);
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
.http-config {
  width: calc(100% - 260px);
  padding: 3%;
}
</style>
