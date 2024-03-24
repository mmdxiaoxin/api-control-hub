<template>
  <div class="content-box">
    <ApiTreeFilter
      ref="apiCollectionTreeRef"
      label="name"
      title="项目集合"
      :data="treeFilterData"
      :default-value="initParam.departmentId"
      @change="changeTreeFilter"
    />
    <component :is="currentComponent" :item-id="selectedId" />
  </div>
</template>

<script setup lang="ts" name="api-management">
import { reactive, ref, onMounted } from "vue";
import ApiTreeFilter from "./components/ApiTreeFilter/index.vue";
import ProjectOverview from "./components/ProjectOverview/index.vue";
import DirectoryOverview from "./components/CatalogOverview/index.vue";
import InterfaceConfiguration from "./components/InterfaceConfiguration/index.vue";
import { getHttpTreeList } from "@/api/modules/http";
import { HttpServer } from "@/api/interface";
import { useWorkbenchStore } from "@/stores/modules/workbench";

const treeFilterValue = reactive({ CollectionId: "1" });
const initParam = reactive({ departmentId: "" });

const apiCollectionTreeRef = ref(null);
const currentComponent = ref<any>(null);

const judgeList = (data: any) => {
  switch (data) {
    case "project":
      currentComponent.value = ProjectOverview;
      break;
    case "dir":
      currentComponent.value = DirectoryOverview;
      break;
    case "api":
      currentComponent.value = InterfaceConfiguration;
      break;
    default:
      currentComponent.value = null;
  }
};
//选中的id
const selectedId = ref("");

//工作台store
const workbench = useWorkbenchStore();

//树形选择器值改变操作
const changeTreeFilter = (val: { id: string; treeCurrentData: any }) => {
  treeFilterValue.CollectionId = val.id;
  selectedId.value = val.id;
  judgeList(val.treeCurrentData.type);
};

//获取树形选择器数据
const treeFilterData = ref<HttpServer.ResTreeList[]>([]);
const useTreeFilterData = async () => {
  const { data } = await getHttpTreeList({ itemId: workbench.projectId, projectName: workbench.projectName });
  treeFilterData.value = data;
  initParam.departmentId = treeFilterData.value[0].id;
  selectedId.value = treeFilterData.value[0].id;
  judgeList(treeFilterData.value[0].type);
};

onMounted(() => {
  useTreeFilterData();
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
