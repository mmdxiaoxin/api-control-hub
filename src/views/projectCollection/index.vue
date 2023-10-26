<template>
  <div class="content-box">
    <TreeFilter
      label="name"
      title="项目集合"
      :data="testData"
      :default-value="treeFilterValue.CollectionId"
      @change="changeTreeFilter"
    />
    <div class="descriptions-box card">
      <span class="text"> 树形筛选器 🍓🍇🍈🍉</span>
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
  </div>
</template>

<script setup lang="ts" name="treeFilter">
import { reactive } from "vue";
import { ElMessage } from "element-plus";
import TreeFilter from "@/components/TreeFilter/index.vue";

const treeFilterValue = reactive({ CollectionId: "1" });
const testData = [
  {
    id: "1",
    name: "Category 1",
    isDir: true,
    children: [
      { id: "11", name: "Subcategory 1.1" },
      { id: "12", name: "Subcategory 1.2" }
    ]
  },
  {
    id: "2",
    name: "Category 2",
    children: [
      { id: "21", name: "Subcategory 2.1" },
      { id: "22", name: "Subcategory 2.2" }
    ]
  }
];
const changeTreeFilter = (val: string) => {
  ElMessage.success(`你选择了 id 为 ${val} 的数据🤔`);
  treeFilterValue.CollectionId = val;
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
