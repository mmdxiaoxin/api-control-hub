<template>
  <el-row :gutter="20" style="margin-bottom: 20px">
    <el-col :span="20">
      <span class="text">
        {{ apiName }}
        <el-button :icon="Edit" circle size="small" />
      </span>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { Edit } from "@element-plus/icons-vue";

defineProps({
  apiName: String
});
</script>

<style scoped></style>
