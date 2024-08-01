<template>
  <div class="card http-config">
    <ApiHeader :api-name="apiName" />
    <!-- 请求体 -->
    <ApiRequest
      :api-id="props.itemId"
      :initial-values="initialValues"
      @on-success="handleSuccess"
      @on-error="handleError"
      @on-send="handleSend"
      @on-save="handleSave"
    />
    <!-- 响应体 -->
    <ApiResponse
      :http-response="httpResp"
      :http-error="httpErr"
      :http-status="httpStatus"
    />
  </div>
</template>

<script setup lang="ts">
import ApiRequest from "./ApiRequest.vue";
import ApiResponse from "./ApiResponse.vue";
import { onMounted, ref, watch } from "vue";
import ApiHeader from "@/views/http-client/components/ApiHeader.vue";
import { getHttpConfigApi } from "@/api/modules/http";
import { RequestForm } from "@/views/http-client/components/ApiRequest.vue";
import { ResponseWithDetails, ResponseWithError } from "@/utils/request";

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

const httpResp = ref<ResponseWithDetails>();
const httpErr = ref<ResponseWithError>();
const httpStatus = ref<boolean>();
function handleSuccess(response: ResponseWithDetails) {
  httpResp.value = response;
}
function handleError(response: ResponseWithError) {
  httpErr.value = response;
}
function handleSend(status: boolean) {
  httpStatus.value = status;
}

function handleSave() {
  fetchApiConfig(props.itemId);
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
