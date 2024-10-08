<template>
  <div class="content-box">
    <TreeFilter
      ref="filterRef"
      :default-value="initialValue"
      :tree-data="treeData"
      @change="handleChange"
      @on-node-drop="handleNodeDrop"
      @on-node-change="handleNodeChange"
    />
    <component :is="view" v-if="view" :item-id="`${selected}`" />
    <el-empty v-else class="card" style="flex: 1; height: 100%"></el-empty>
  </div>
</template>

<script setup lang="ts" name="api-management">
import { markRaw, ref } from "vue";
import TreeFilter from "./components/FilterTree.vue";
import ProjectOverview from "./components/OverviewPanel.vue";
import DirConfig from "./components/DirConfig.vue";
import ApiConfig from "./components/ApiConfig.vue";
import { getHttpTreeList, updateHttpConfig } from "@/api/modules/http";
import { useWorkbenchStore } from "@/stores/modules/workbench";
import { Http } from "@/api/interface";
import { generateUUID } from "@/utils";

const filterRef = ref<InstanceType<typeof TreeFilter> | null>(null);
const initialValue = ref();
const treeData = ref();
const selected = ref();
const view = ref();
const workbench = useWorkbenchStore();

const handleChange = (val: { id: string; treeCurrentData: any }) => {
  selected.value = val.treeCurrentData.item_id;
  view.value = getViewComponent(val.treeCurrentData.type);
};
const getViewComponent = (type: string) => {
  switch (type) {
    case "project":
      return markRaw(ProjectOverview);
    case "dir":
      return markRaw(DirConfig);
    case "api":
      return markRaw(ApiConfig);
    default:
      return null;
  }
};

interface TreeNode {
  id: number | string;
  item_id: number;
  label: string;
  parent_id: number | null;
  children: TreeNode[];
  type?: string;
}

const fetchTreeData = async () => {
  const response = await getHttpTreeList({ projectId: workbench.projectId });
  treeData.value = [convertToTreeNode(response.data)];
  initialValue.value = treeData.value[0].id;
  handleChange({
    id: treeData.value[0].item_id,
    treeCurrentData: treeData.value[0]
  });
};
fetchTreeData();

function convertToTreeNode(
  resTreeList: Http.ResTree,
  parentItemId: number | null = null
): TreeNode {
  // 创建一个新的 TreeNode 对象
  const treeNode: TreeNode = {
    id: generateUUID(),
    item_id: resTreeList.id,
    label: resTreeList.category_name,
    parent_id: parentItemId,
    children: [],
    type: resTreeList.type
  };

  // 转换 children
  if (resTreeList.children) {
    treeNode.children = resTreeList.children.map(child => convertToTreeNode(child, resTreeList.id));
  }

  // 转换 configs 并加入到 children 中
  if (resTreeList.configs) {
    treeNode.children = treeNode.children.concat(
      resTreeList.configs.map(config => ({
        id: generateUUID(),
        item_id: config.id,
        label: config.api_name,
        parent_id: resTreeList.id,
        children: [],
        type: "api"
      }))
    );
  }

  return treeNode;
}

const handleNodeChange = () => {
  fetchTreeData();
};

const handleNodeDrop = ({ draggingData, dropData, type }) => {
  if (type === "api") {
    updateHttpConfig({
      apiId: draggingData.item_id,
      categoryId: dropData.item_id
    }).then(() => {
      fetchTreeData();
    });
  }
};
</script>

<style scoped lang="scss">
.content-box {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}
</style>
