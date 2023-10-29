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
    <ProjectOverview v-if="isProject" :project-title="pageTitle" />
    <CatalogOverview v-if="isDirectory" :directory-title="pageTitle" />
    <InterfaceConfiguration v-if="isApi" :api-title="pageTitle" />
  </div>
</template>

<script setup lang="ts" name="treeFilter">
import { reactive, ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import ApiTreeFilter from "./components/ApiTreeFilter/index.vue";
import ProjectOverview from "./components/ProjectOverview/index.vue";
import CatalogOverview from "./components/CatalogOverview/index.vue";
import InterfaceConfiguration from "./components/InterfaceConfiguration/index.vue";
import { getHttpCollectionList } from "@/api/modules/httpServer";

const treeFilterValue = reactive({ CollectionId: "1" });
const initParam = reactive({ departmentId: "" });

const apiCollectionTreeRef = ref(null);
const isProject = ref(true);
const isDirectory = ref(false);
const isApi = ref(false);
const pageTitle = ref("");

const judgeList = (data: any) => {
  isProject.value = !!data.isProject;
  isDirectory.value = !!data.isDirectory;
  isApi.value = !!data.isApi;
};

const changeTreeFilter = (val: { id: string; treeCurrentData: any }) => {
  ElMessage.success(`你选择了 id 为 ${val.id} 的数据🤔`);
  treeFilterValue.CollectionId = val.id;
  pageTitle.value = val.treeCurrentData.name;
  judgeList(val.treeCurrentData);
};

const treeFilterData = ref<any>([]);
const getTreeFilter = async () => {
  const { data } = await getHttpCollectionList();
  treeFilterData.value = data;
  initParam.departmentId = treeFilterData.value[0].id;
  pageTitle.value = treeFilterData.value[0].name;
};

onMounted(() => {
  getTreeFilter();
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
