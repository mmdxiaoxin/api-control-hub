<template>
  <div class="card http-config">
    <ApiHeader :api-name="apiName" />
    <!-- 请求体 -->
    <ApiRequest :initial-values="initialValues" @on-send="handleSend" />
    <!-- 响应体 -->
    <ApiResponse :http-response="httpResp" />
  </div>
</template>

<script setup lang="ts">
import ApiRequest from "../ApiRequest.vue";
import ApiResponse from "../ApiResponse.vue";
import { onMounted, ref, watch } from "vue";
import ApiHeader from "@/views/http-client/components/ApiHeader.vue";
import { getHttpConfigApi } from "@/api/modules/http";
import { RequestForm } from "@/views/http-client/components/ApiRequest.vue";
import {
  ResponseWithDetails,
  ResponseWithError
} from "@/views/http-client/components/ApiConfig/request";

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

const httpResp = ref<ResponseWithDetails | ResponseWithError>();
function handleSend(response: ResponseWithDetails | ResponseWithError) {
  httpResp.value = response;
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
  min-height: 100%;
  padding: 3%;
}
</style>
