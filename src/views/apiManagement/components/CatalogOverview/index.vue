<template>
  <div class="descriptions-box card">
    <span class="text">
      {{ directoryName }} <el-button :icon="Edit" circle size="small" @click="modifyName(directoryName)" />
    </span>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column label="方法" width="180">
        <template #default="{ row }">
          <el-tag :type="getMethodTagType(row.method)">{{ row.method }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="apiName" label="接口名称" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { Edit } from "@element-plus/icons-vue";
import { getMethodTagType } from "@/utils/workPlace";
import { ElMessage, ElMessageBox } from "element-plus";
import { onMounted, ref } from "vue";

const props = defineProps({
  directoryTitle: String
});
const directoryName = ref(props.directoryTitle);
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

const modifyName = (project: any) => {
  ElMessageBox.prompt("请输入要修改的目录名称", "修改名称", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    inputPattern: /\S/, // 验证规则，确保非空
    inputErrorMessage: "目录名称不能为空" // 错误信息
  })
    .then(({ value }) => {
      directoryName.value = value;
      //TODO:连接后端项目修改
      console.log(`Modifying name for directory ${project}`);
      ElMessage({
        type: "success",
        message: `修改成功:${value}`
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消输入"
      });
    });
};

onMounted(() => {
  directoryName.value = props.directoryTitle as string;
});
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
