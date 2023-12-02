<template>
  <div class="descriptions-box card">
    <span class="text"> {{ props.directoryTitle }} <el-button :icon="Edit" circle size="small" /></span>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column label="方法" width="180">
        <template #default="{ row }">
          <el-tag :type="getTagType(row.method)">{{ row.method }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="apiName" label="接口名称" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { Edit } from "@element-plus/icons-vue";

const props = defineProps({
  directoryTitle: String
});

const tableData = [
  {
    method: "GET",
    apiName: "接口1"
  },
  {
    method: "POST",
    apiName: "接口2"
  },
  {
    method: "PUT",
    apiName: "接口3"
  },
  {
    method: "DELETE",
    apiName: "接口4"
  }
];

const getTagType = (method: string) => {
  switch (method) {
    case "GET":
      return "success";
    case "POST":
      return "primary";
    case "PUT":
      return "warning";
    case "DELETE":
      return "danger";
    default:
      return "info";
  }
};
</script>

<style scoped lang="scss">
.descriptions-box {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  height: 100%;
}
</style>
