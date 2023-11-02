<template>
  <el-container class="project-description card">
    <el-main class="project-content">
      <div class="project-header">
        <span class="text">{{ props.projectTitle }} <el-button :icon="Edit" circle size="small" /></span>
        <el-tag>项目概览</el-tag>
      </div>
      <el-divider direction="horizontal" style="width: 100%" />
      <ApiStatistic />
      <el-descriptions title="配置项 📚" :column="1" border>
        <el-descriptions-item label="requestApi"> 请求分类数据的 api </el-descriptions-item>
        <el-descriptions-item label="data"> 分类数据，如果有分类数据，则不会执行 api 请求 </el-descriptions-item>
        <el-descriptions-item label="title"> treeFilter 标题 </el-descriptions-item>
        <el-descriptions-item label="id"> 选择的id，默认为 “id” </el-descriptions-item>
        <el-descriptions-item label="label"> 显示的label，默认为 “label” </el-descriptions-item>
        <el-descriptions-item label="multiple"> 是否为多选，默认为 false </el-descriptions-item>
        <el-descriptions-item label="defaultValue"> 默认选中的值 </el-descriptions-item>
      </el-descriptions>
    </el-main>
    <el-divider direction="vertical" style="height: 100%" />
    <el-aside>
      <div class="project-aside">
        <span class="text"> ABOUT </span>
      </div>
    </el-aside>
  </el-container>
</template>

<script setup lang="ts">
import ApiStatistic from "./ApiStatistic.vue";
import { Edit } from "@element-plus/icons-vue";

const props = defineProps({
  projectTitle: String
});
</script>

<style scoped lang="scss">
.project-description {
  height: 100%;

  .project-content {
    width: calc(100% - 230px);

    .project-header {
      display: flex;
      align-items: stretch;
      justify-content: space-between;
    }
  }

  .project-aside {
    width: 200px;
    margin-left: 20px;
  }
}
</style>
