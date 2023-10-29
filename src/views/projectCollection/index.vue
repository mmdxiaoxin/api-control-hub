<template>
  <div class="content-box">
    <ApiTreeFilter
      ref="apiCollectionTreeRef"
      label="name"
      title="项目集合"
      :data="testData"
      :default-value="treeFilterValue.CollectionId"
      @change="changeTreeFilter"
    />
    <ProjectOverview v-if="isProject" />
    <CatalogOverview v-if="isDirectory" />
    <InterfaceConfiguration v-if="isApi" />
  </div>
</template>

<script setup lang="ts" name="treeFilter">
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import ApiTreeFilter from "./components/ApiTreeFilter/index.vue";
import ProjectOverview from "./components/ProjectOverview/index.vue";
import CatalogOverview from "./components/CatalogOverview/index.vue";
import InterfaceConfiguration from "./components/InterfaceConfiguration/index.vue";

const treeFilterValue = reactive({ CollectionId: "1" });
const apiCollectionTreeRef = ref(null);
const isProject = ref(true);
const isDirectory = ref(false);
const isApi = ref(false);

const testData = [
  {
    id: "1",
    name: "农业监控系统",
    isProject: true,
    children: [
      {
        id: "11",
        name: "目录 1.1",
        isDirectory: true,
        children: [
          { id: "111", name: "api1", isApi: true },
          { id: "112", name: "api2", isApi: true },
          { id: "113", name: "api3", isApi: true },
          { id: "114", name: "api4", isApi: true }
        ]
      }
    ]
  }
];

const judgeList = (Project: boolean, Directory: boolean, Api: boolean) => {
  isProject.value = Project;
  isDirectory.value = Directory;
  isApi.value = Api;
};

const changeTreeFilter = (val: { id: string; treeCurrentData: any }) => {
  ElMessage.success(`你选择了 id 为 ${val.id} 的数据🤔`);
  treeFilterValue.CollectionId = val.id;
  judgeList(
    val.treeCurrentData.isProject as boolean,
    val.treeCurrentData.isDirectory as boolean,
    val.treeCurrentData.isApi as boolean
  );
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
