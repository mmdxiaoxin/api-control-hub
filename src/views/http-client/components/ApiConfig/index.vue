<template>
  <div class="card http-config">
    <ApiHeader :api-name="apiName" />
    <!-- 请求体 -->
    <ApiRequest />
    <!-- 响应体 -->
    <ApiResponse />
  </div>
</template>

<script setup lang="ts">
import ApiRequest from "./components/ApiRequest.vue";
import ApiResponse from "./components/ApiResponse.vue";
import { useHttpConfigStore } from "@/stores/modules/httpConfig";
import { computed, onMounted, watch } from "vue";
import ApiHeader from "@/views/http-client/components/ApiConfig/components/ApiHeader.vue";

const apiName = computed(() => httpConfig.apiName);

const props = defineProps({
  itemId: {
    type: String,
    required: true
  }
});

const httpConfig = useHttpConfigStore();
const useHttpConfig = async () => {
  await httpConfig.getHttpConfig(props.itemId);
};

onMounted(() => {
  useHttpConfig();
});

watch(
  () => props.itemId,
  () => {
    useHttpConfig();
  }
);
</script>

<style scoped lang="scss">
.http-config {
  width: calc(100% - 260px);
  padding: 3%;
}
</style>
