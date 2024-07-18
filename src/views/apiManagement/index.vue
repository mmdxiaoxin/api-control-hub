<template>
  <div class="content-box">
    <ApiTreeFilter
      ref="filterRef"
      :default-value="initialValue"
      :tree-data="treeData"
      @change="handleTreeChange"
    />
    <component
      :is="currentView"
      v-if="currentView"
      :item-id="`${selectedId}`"
    />
    <el-empty v-else class="card" style="flex: 1; height: 100%"></el-empty>
  </div>
</template>

<script setup lang="ts" name="api-management">
import { markRaw, ref } from "vue";
import ApiTreeFilter from "./components/ApiTreeFilter/index.vue";
import ProjectOverview from "./components/ProjectOverview/index.vue";
import DirectoryOverview from "./components/CatalogOverview/index.vue";
import InterfaceConfiguration from "./components/InterfaceConfiguration/index.vue";
import { getHttpTreeList } from "@/api/modules/http";
import { useWorkbenchStore } from "@/stores/modules/workbench";
import { HttpServer } from "@/api/interface";
import { generateUUID } from "@/utils";

const filterRef = ref<InstanceType<typeof ApiTreeFilter> | null>(null);
const initialValue = ref();
const treeData = ref();
const selectedId = ref();
const currentView = ref();
const workbench = useWorkbenchStore();

const handleTreeChange = (val: { id: string; treeCurrentData: any }) => {
  selectedId.value = val.treeCurrentData.item_id;
  currentView.value = getViewComponent(val.treeCurrentData.type);
};
const getViewComponent = (type: string) => {
  switch (type) {
    case "project":
      return markRaw(ProjectOverview);
    case "dir":
      return markRaw(DirectoryOverview);
    case "api":
      return markRaw(InterfaceConfiguration);
    default:
      return null;
  }
};

interface TreeNode {
  id: number | string;
  item_id: number;
  label: string;
  children: TreeNode[];
  type?: string;
}

const fetchTreeData = async () => {
  const response = await getHttpTreeList({ projectId: workbench.projectId });
  treeData.value = [convertToTreeNode(response.data)];
  initialValue.value = treeData.value[0].id;
  handleTreeChange({
    id: treeData.value[0].item_id,
    treeCurrentData: treeData.value[0]
  });
};
fetchTreeData();

function convertToTreeNode(resTreeList: HttpServer.ResTreeList): TreeNode {
  // 创建一个新的 TreeNode 对象
  const treeNode: TreeNode = {
    id: generateUUID(),
    item_id: resTreeList.id,
    label: resTreeList.category_name,
    children: [],
    type: resTreeList.type
  };

  // 转换 children
  if (resTreeList.children) {
    treeNode.children = resTreeList.children.map(child =>
      convertToTreeNode(child)
    );
  }

  // 转换 configs 并加入到 children 中
  if (resTreeList.configs) {
    treeNode.children = treeNode.children.concat(
      resTreeList.configs.map(config => ({
        id: generateUUID(),
        item_id: config.id,
        label: config.api_name,
        children: [],
        type: "api"
      }))
    );
  }

  return treeNode;
}
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
