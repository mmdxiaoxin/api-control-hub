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
    <InterfaceConfiguration v-if="isApi" :api-title="pageTitle" :api-id="curId" />
  </div>
</template>

<script setup lang="ts" name="treeFilter">
import { reactive, ref, onMounted } from "vue";
import ApiTreeFilter from "./components/ApiTreeFilter/index.vue";
import ProjectOverview from "./components/ProjectOverview/index.vue";
import CatalogOverview from "./components/CatalogOverview/index.vue";
import InterfaceConfiguration from "./components/InterfaceConfiguration/index.vue";
import { getHttpCollectionList } from "@/api/modules/httpServer";
import { HttpServer } from "@/api/interface";
import { useWorkPlaceStore } from "@/stores/modules/workPlace";

const treeFilterValue = reactive({ CollectionId: "1" });
const initParam = reactive({ departmentId: "" });

const apiCollectionTreeRef = ref(null);
const isProject = ref(true);
const isDirectory = ref(false);
const isApi = ref(false);
const curId = ref("");
const pageTitle = ref("");
const workPlace = useWorkPlaceStore();

const judgeList = (data: any) => {
  isProject.value = !!data.isProject;
  isDirectory.value = !!data.isDirectory;
  isApi.value = !!data.isApi;
};

const changeTreeFilter = (val: { id: string; treeCurrentData: any }) => {
  treeFilterValue.CollectionId = val.id;
  curId.value = val.id;
  pageTitle.value = val.treeCurrentData.name;
  judgeList(val.treeCurrentData);
};

const treeFilterData = ref<HttpServer.ResCollectionList[]>([]);
const useTreeFilterData = async () => {
  const { data } = await getHttpCollectionList({ projectId: workPlace.projectId, projectName: workPlace.projectName });
  treeFilterData.value = data;
  initParam.departmentId = treeFilterData.value[0].id;
  pageTitle.value = treeFilterData.value[0].name;
};

onMounted(() => {
  useTreeFilterData();
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
