<template>
  <div class="card filter">
    <div class="filter-header">
      <el-breadcrumb :separator-icon="ArrowRight" style="margin-bottom: 20px">
        <el-breadcrumb-item>{{ useWorkPlace.teamName }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ useWorkPlace.projectName }}</el-breadcrumb-item>
      </el-breadcrumb>
      <span v-if="title" class="title sle">
        {{ title }}
      </span>
    </div>
    <el-input v-model="filterText" placeholder="输入关键字进行过滤" clearable />
    <el-scrollbar :style="{ height: title ? `calc(100% - 95px)` : `calc(100% - 56px)` }">
      <el-tree
        ref="treeRef"
        default-expand-all
        draggable
        :allow-drop="allowDrop"
        :node-key="id"
        :data="multiple ? treeData : treeAllData"
        :show-checkbox="multiple"
        :check-strictly="false"
        :current-node-key="!multiple ? selected : ''"
        :expand-on-click-node="false"
        :check-on-click-node="multiple"
        :props="defaultProps"
        :filter-node-method="filterNode"
        :default-checked-keys="multiple ? selected : []"
        @node-click="handleNodeClick"
        @check="handleCheckChange"
        @node-drop="handleDrop"
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
                  <el-dropdown-item :icon="FolderAdd" @click="addDirectory(nodeData)" v-if="nodeData.isApi === undefined">
                    子目录添加
                  </el-dropdown-item>
                  <el-dropdown-item :icon="DocumentAdd" @click="addApi(nodeData)" v-if="nodeData.isApi === undefined">
                    接口添加
                  </el-dropdown-item>
                  <el-dropdown-item :icon="DocumentCopy" @click="duplicateApi(nodeData)" v-if="nodeData.isApi !== undefined">
                    克隆
                  </el-dropdown-item>
                  <el-dropdown-item :icon="Delete" v-if="nodeData.isProject === undefined" @click="removeNode(node, nodeData)">
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
import { ref, watch, onBeforeMount, nextTick } from "vue";
import { ElMessage, ElTree } from "element-plus";
import { AllowDropType, NodeDropType } from "element-plus/es/components/tree/src/tree.type";
import type Node from "element-plus/es/components/tree/src/model/node";
import type { DragEvents } from "element-plus/es/components/tree/src/model/useDragNode";
import { TreeNodeData } from "element-plus/es/components/tree-v2/src/types";
import { useWorkPlaceStore } from "@/stores/modules/workPlace";
import { ArrowRight, Delete, More, FolderAdd, DocumentAdd, DocumentCopy } from "@element-plus/icons-vue";

// 接收父组件参数并设置默认值
interface TreeFilterProps {
  requestApi?: (data?: any) => Promise<any>; // 请求分类数据的 api ==> 非必传
  data?: { [key: string]: any }[]; // 分类数据，如果有分类数据，则不会执行 api 请求 ==> 非必传
  title?: string; // treeFilter 标题 ==> 非必传
  id?: string; // 选择的id ==> 非必传，默认为 “id”
  label?: string; // 显示的label ==> 非必传，默认为 “label”
  multiple?: boolean; // 是否为多选 ==> 非必传，默认为 false
  defaultValue?: any; // 默认选中的值 ==> 非必传
}

// 配置节点的数据data
interface Tree {
  id: string;
  name: string;
  children?: Tree[];
}

const props = withDefaults(defineProps<TreeFilterProps>(), {
  id: "id",
  label: "label",
  multiple: false
});

const defaultProps = {
  children: "children",
  label: props.label
};

const useWorkPlace = useWorkPlaceStore();

const treeRef = ref<InstanceType<typeof ElTree>>();
const treeCurrentData = ref<TreeNodeData>();
const treeData = ref<{ [key: string]: any }[]>([]);
const treeAllData = ref<{ [key: string]: any }[]>([]);

const selected = ref();
const setSelected = () => {
  if (props.multiple) selected.value = Array.isArray(props.defaultValue) ? props.defaultValue : [props.defaultValue];
  else selected.value = typeof props.defaultValue === "string" ? props.defaultValue : "";
};

onBeforeMount(async () => {
  setSelected();
  if (props.requestApi) {
    const { data } = await props.requestApi!();
    treeData.value = data;
    treeAllData.value = [...data];
  }
  treeCurrentData.value = treeRef.value?.getCurrentNode();
});

// 使用 nextTick 防止打包后赋值不生效，开发环境是正常的
watch(
  () => props.defaultValue,
  () => nextTick(() => setSelected()),
  { deep: true, immediate: true }
);

watch(
  () => props.data,
  () => {
    if (props.data?.length) {
      treeData.value = props.data;
      treeAllData.value = [...props.data];
    }
  },
  { deep: true, immediate: true }
);

const filterText = ref("");
watch(filterText, val => {
  treeRef.value!.filter(val);
});

// 过滤
const filterNode = (value: string, data: { [key: string]: any }, node: any) => {
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

// emit
const emit = defineEmits<{
  change: [value: any];
}>();

// 单选
const handleNodeClick = (data: { [key: string]: any }) => {
  if (props.multiple) return;
  treeCurrentData.value = treeRef.value?.getCurrentNode();
  const payload = { id: data[props.id], treeCurrentData: treeCurrentData.value };
  emit("change", payload);
};

// 多选
const handleCheckChange = () => {
  emit("change", treeRef.value?.getCheckedKeys());
};

const allowDrop = (draggingNode: Node, dropNode: Node, type: AllowDropType): boolean => {
  // 获取拖拽源和目标节点的数据
  const draggingData = draggingNode.data;
  const dropData = dropNode.data;

  // 检查拖拽源和目标节点的 isApi 属性
  const isDraggingApi = draggingData.isApi !== undefined;
  const isDraggingDir = draggingData.isDirectory !== undefined;
  const isDropApi = dropData.isApi !== undefined;

  if (type === "prev" || type === "next") {
    return true; // 允许拖拽到前一个或后一个节点
  }

  // 如果拖拽源是接口 (isApi 不为 undefined)，并且目标节点也是接口，则禁止拖拽到目标节点内部
  if ((isDraggingApi || isDraggingDir) && isDropApi) {
    return false;
  }

  // 如果是叶子节点（没有子节点）并且拖拽到根节点以外，不允许拖拽
  if (type === "inner") {
    return true; // 允许拖拽到内部
  } else {
    const dragDepth = draggingNode.level;
    const rootDepth = dropNode.level;
    return dragDepth <= rootDepth; // 拖拽节点的深度小于等于根节点的深度才允许
  }
};

// 拖拽事件
const handleDrop = (draggingNode: Node, dropNode: Node, dropType: NodeDropType, ev: DragEvents) => {
  const message = `拖拽源：${draggingNode.label}，目标节点：${dropNode.label}，拖拽类型：${dropType}`;
  ElMessage.success(message);
  console.log("拖拽事件：", ev);
};

// 添加子目录
const addDirectory = (data: Tree) => {
  const newChild = { id: data.id + `${dataId++}`, name: "新目录", children: [], isDirectory: true };
  if (!data.children) {
    data.children = [];
  }
  data.children.push(newChild);
  treeAllData.value = [...treeAllData.value];
};

// 添加接口
const addApi = (data: Tree) => {
  const newChild = { id: data.id + `${dataId++}`, name: "新接口", children: [], isApi: true };
  if (!data.children) {
    data.children = [];
  }
  data.children.push(newChild);
  treeAllData.value = [...treeAllData.value];
};

// 克隆接口
let dataId = 1000;
const duplicateApi = (data: Tree) => {
  const parent = getParentNode(treeAllData.value, data);
  if (!parent) {
    ElMessage.error("没有找到父节点.");
    return;
  }

  const index = parent.children.indexOf(data);
  if (index === -1) {
    ElMessage.error("待复制节点不存在数据.");
    return;
  }

  const newChild = { id: data.id + `${dataId++}`, name: data.name + "-Copy", isApi: true };
  parent.children.splice(index + 1, 0, newChild);

  treeAllData.value = [...treeAllData.value];
};

//获取父节点
const getParentNode = (dataList: { [key: string]: any }[], targetNode: Tree): { [p: string]: any } | null => {
  for (const node of dataList) {
    if (node.children && node.children.includes(targetNode)) {
      return node;
    }
    if (node.children) {
      const parent = getParentNode(node.children, targetNode);
      if (parent) {
        return parent;
      }
    }
  }
  return null;
};

const removeNode = (node: Node, data: Tree) => {
  const parent = node.parent;
  const children: Tree[] = parent.data.children || parent.data;
  const index = children.findIndex(d => d.id === data.id);
  children.splice(index, 1);
  treeAllData.value = [...treeAllData.value];
};
// 暴露给父组件使用
defineExpose({ treeData, treeAllData, treeRef, treeCurrentData });
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
