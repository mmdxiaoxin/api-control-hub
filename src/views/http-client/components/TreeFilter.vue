<template>
  <div class="card filter">
    <div class="filter-header">
      <el-breadcrumb :separator-icon="ArrowRight" style="margin-bottom: 20px">
        <el-breadcrumb-item>{{ workbenchStore.teamName }}</el-breadcrumb-item>
        <el-breadcrumb-item>
          {{ workbenchStore.projectName }}
        </el-breadcrumb-item>
      </el-breadcrumb>
      <span v-if="workbenchStore.projectName" class="title sle">
        {{ workbenchStore.projectName }}
      </span>
    </div>
    <el-input v-model="filterText" placeholder="输入关键字进行过滤" clearable />
    <el-scrollbar
      :style="{
        height: workbenchStore.projectName
          ? `calc(100% - 125px)`
          : `calc(100% - 86px)`
      }"
    >
      <el-tree
        ref="treeRef"
        :props="defaultProps"
        :data="props.treeData"
        :node-key="props.id"
        :filter-node-method="filterNode"
        :expand-on-click-node="false"
        :default-checked-keys="selected"
        highlight-current
        default-expand-all
        draggable
        :allow-drop="allowDrop"
        :allow-drag="allowDrag"
        @node-click="handleNodeClick"
      >
        <template #default="{ node, data: nodeData }">
          <span class="el-tree-node__label custom-tree-node">
            <span>{{ node.label }}</span>
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                <el-icon><More /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <!-- Project node (root) -->
                  <el-dropdown-item
                    :icon="FolderAdd"
                    v-if="
                      nodeData.type === 'project' || nodeData.type === 'dir'
                    "
                  >
                    子目录添加
                  </el-dropdown-item>
                  <el-dropdown-item
                    :icon="DocumentAdd"
                    v-if="
                      nodeData.type === 'project' || nodeData.type === 'dir'
                    "
                  >
                    接口添加
                  </el-dropdown-item>
                  <!-- API node -->
                  <el-dropdown-item
                    :icon="DocumentCopy"
                    v-if="nodeData.type === 'api'"
                  >
                    克隆
                  </el-dropdown-item>
                  <!-- Not root node -->
                  <el-dropdown-item
                    :icon="Delete"
                    v-if="nodeData.type !== 'project'"
                  >
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </span>
        </template>
      </el-tree>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts" name="ApiTreeFilter">
import { onBeforeMount, ref, watch } from "vue";
import { useWorkbenchStore } from "@/stores/modules/workbench";
import {
  ArrowRight,
  Delete,
  More,
  FolderAdd,
  DocumentAdd,
  DocumentCopy
} from "@element-plus/icons-vue";
import { ElTree } from "element-plus";
import { FilterValue } from "element-plus/es/components/tree/src/tree.type";
import { TreeNodeData } from "element-plus/es/components/tree-v2/src/types";
import type Node from "element-plus/es/components/tree/src/model/node";

/**
 * 树形组件过滤组件部分
 */
const workbenchStore = useWorkbenchStore();
const filterText = ref("");
watch(filterText, val => {
  treeRef.value!.filter(val);
});

// 过滤
const filterNode = (value: FilterValue, data: TreeNodeData, node: any) => {
  if (!value) return true;
  let parentNode = node.parent,
    labels = [node.label],
    level = 1;
  while (level < node.level) {
    labels = [...labels, parentNode.label];
    parentNode = parentNode.parent;
    level++;
  }
  return labels.some(label => label.indexOf(value) !== -1);
};

/**
 * 树形组件主要功能部分
 */
interface TreeNode {
  id: number | string;
  item_id: number;
  label: string;
  children: TreeNode[];
  type?: string;
}

interface TreeFilterProps {
  id?: string; // 选择的id ==> 非必传，默认为 “id”
  label?: string; // 显示的label ==> 非必传，默认为 “label”
  children?: string; // 子节点的key ==> 非必传，默认为 “children”
  defaultValue?: string; // 默认选中的值 ==> 非必传，默认为 “”
  treeData?: TreeNode[] | undefined; // 树形数据 ==> 非必传，默认为 []
}

// 接收父组件参数并设置默认值
const props = withDefaults(defineProps<TreeFilterProps>(), {
  id: "id",
  label: "label",
  children: "children"
});

const emit = defineEmits(["change"]);

const defaultProps = {
  label: props.label,
  children: props.children
};

const treeRef = ref<InstanceType<typeof ElTree>>();
const treeCurrentData = ref();
const selected = ref();
const setSelected = () => {
  selected.value = props.defaultValue ? [props.defaultValue] : [];
};
// 单选
const handleNodeClick = (data: { [key: string]: any }) => {
  treeCurrentData.value = treeRef.value?.getCurrentNode();
  const payload = {
    id: data[props.id],
    treeCurrentData: treeCurrentData.value
  };
  emit("change", payload);
};

// 拖拽规则
const allowDrop = (draggingNode: Node, dropNode: Node) => {
  const draggingData = draggingNode.data;
  const dropData = dropNode.data;

  if (draggingData.type === "project") {
    return false;
  }
  if (draggingData.type === "dir" && dropData.type === "api") {
    return false;
  }
  if (draggingData.type === "api" && dropData.type === "api") {
    return false;
  }
  return true;
};

const allowDrag = (node: Node) => {
  return node.data.type !== "project";
};

onBeforeMount(() => {
  setSelected();
});

defineExpose({ treeRef });
</script>

<style scoped lang="scss">
.filter {
  box-sizing: border-box;
  width: 300px;
  min-height: 100%;
  padding: 18px;
  margin-right: 10px;
  .filter-header {
    margin-bottom: 20px;
    .title {
      margin: 0 0 15px;
      font-size: 18px;
      font-weight: bold;
      color: var(--el-color-info-dark-2);
      letter-spacing: 0.5px;
    }
  }
  .el-input {
    margin: 0 0 15px;
  }
  .el-scrollbar {
    :deep(.el-tree) {
      height: 70%;
      overflow: auto;
      .el-tree-node__content {
        height: 33px;
      }
    }
    :deep(.el-tree--highlight-current) {
      .el-tree-node.is-current > .el-tree-node__content {
        background-color: var(--el-color-primary);
        .el-tree-node__label,
        .el-tree-node__expand-icon {
          color: white;
        }
        .is-leaf {
          color: transparent;
        }
      }
    }
  }
}
.custom-tree-node {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  padding-right: 8px;
  font-size: 14px;
  .el-dropdown-link {
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  &:hover {
    .el-dropdown-link {
      opacity: 1;
    }
  }
}
</style>
