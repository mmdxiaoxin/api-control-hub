<template>
  <div class="card interface-configuration">
    <!-- 请求体 -->
    <RequestForm />
    <!-- 响应体 -->
    <ResponsePanel />
  </div>
</template>

<script setup lang="ts">
import RequestForm from "@/views/apiManagement/components/InterfaceConfiguration/components/RequestForm.vue";
import ResponsePanel from "@/views/apiManagement/components/InterfaceConfiguration/components/ResponsePanel.vue";
import { useHttpConfigStore } from "@/stores/modules/httpConfig";
import { onMounted, watch } from "vue";

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
.interface-configuration {
  width: calc(100% - 260px);
  height: 100%;
  padding: 3%;
}
</style>
