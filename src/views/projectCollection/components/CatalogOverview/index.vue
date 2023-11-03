<template>
  <div class="descriptions-box card">
    <span class="text"> {{ props.directoryTitle }} <el-button :icon="Edit" circle size="small" /></span>
    <el-descriptions title="配置项 📚" :column="1" border>
      <el-descriptions-item label="requestApi"> 请求分类数据的 api </el-descriptions-item>
      <el-descriptions-item label="data"> 分类数据，如果有分类数据，则不会执行 api 请求 </el-descriptions-item>
      <el-descriptions-item label="title"> treeFilter 标题 </el-descriptions-item>
      <el-descriptions-item label="id"> 选择的id，默认为 “id” </el-descriptions-item>
      <el-descriptions-item label="label"> 显示的label，默认为 “label” </el-descriptions-item>
      <el-descriptions-item label="multiple"> 是否为多选，默认为 false </el-descriptions-item>
      <el-descriptions-item label="defaultValue"> 默认选中的值 </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script setup lang="ts">
import { Edit } from "@element-plus/icons-vue";

const props = defineProps({
  directoryTitle: String
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
