<template>
  <div class="content-box">
    <ApiTreeFilter
      ref="treeRef"
      label="name"
      title="项目集合"
      :data="treeData"
      :default-value="initialValue"
      @change="handleTreeChange"
    />
    <component :is="currentView" v-if="currentView" :item-id="selectedId" />
    <el-empty v-else class="card" style="flex: 1; height: 100%"></el-empty>
  </div>
</template>

<script setup lang="ts" name="api-management">
import { ref } from "vue";
import ApiTreeFilter from "./components/ApiTreeFilter/index.vue";
import ProjectOverview from "./components/ProjectOverview/index.vue";
import DirectoryOverview from "./components/CatalogOverview/index.vue";
import InterfaceConfiguration from "./components/InterfaceConfiguration/index.vue";
import { getHttpTreeList } from "@/api/modules/http";
import { HttpServer } from "@/api/interface";
import { useWorkbenchStore } from "@/stores/modules/workbench";

const treeRef = ref(null);
const initialValue = ref("");
const selectedId = ref("");
const currentView = ref();
const workbench = useWorkbenchStore();

const treeData = ref<HttpServer.ResTreeList[]>([]);

const handleTreeChange = (val: { id: string; type: string }) => {
  selectedId.value = val.id;
  currentView.value = getViewComponent(val.type);
};

const getViewComponent = (type: string) => {
  switch (type) {
    case "project":
      return ProjectOverview;
    case "dir":
      return DirectoryOverview;
    case "api":
      return InterfaceConfiguration;
    default:
      return null;
  }
};

const fetchTreeData = async () => {
  const { data } = await getHttpTreeList({ projectId: workbench.projectId });
  treeData.value = data || [];
  if (treeData.value.length > 0) {
    initialValue.value = treeData.value[0].id;
    handleTreeChange(treeData.value[0]);
  }
};

fetchTreeData();
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
