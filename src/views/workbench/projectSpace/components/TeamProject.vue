<template>
  <el-skeleton v-if="loading" :rows="5" animated />
  <div class="grid-container">
    <template v-for="element in itemList" :key="element.id">
      <div class="card-item">
        <div class="card-header">
          <div class="card-icon">
            <img :src="element.icon" alt="图标不存在" />
          </div>
          <div class="card-operation">
            <el-button
              :icon="Position"
              circle
              @click="handleJump(element)"
            ></el-button>
            <el-button
              :type="!element.isCollection ? '' : 'warning'"
              :icon="Star"
              @click="handleStar(element.id)"
              circle
            ></el-button>
            <el-dropdown
              ref="operation"
              trigger="click"
              @command="handleCommand"
            >
              <span class="el-dropdown-link">
                <el-button :icon="More" text></el-button>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item :icon="Document" command="update">
                    修改名称
                  </el-dropdown-item>
                  <el-dropdown-item :icon="DocumentCopy" command="clone">
                    >克隆项目
                  </el-dropdown-item>
                  <el-dropdown-item :icon="Delete" command="delete">
                    删除项目
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
        <div class="card-title">
          {{ element.name || "Error: Title not provided" }}
        </div>
        <el-tag class="card-tag">{{ "HTTP" }}</el-tag>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { DropdownInstance, ElMessage } from "element-plus";
import { ref, watch } from "vue";
import type { Projects } from "@/api/interface";
import {
  Delete,
  DocumentCopy,
  More,
  Position,
  Star,
  Document
} from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { useWorkbenchStore } from "@/stores/modules/workbench";

const router = useRouter();
const workBench = useWorkbenchStore();
const operation = ref<DropdownInstance>();
const props = defineProps<{
  gridList: Projects.ResItem[];
  loading: boolean;
}>();

const itemList = ref<Projects.ResItem[]>([]);
watch(
  () => props.gridList,
  newVal => {
    itemList.value = newVal;
  },
  { immediate: true }
);

function handleJump(item: Projects.ResItem) {
  workBench.projectId = item.id;
  workBench.projectName = item.name;
  router.push("/http-client");
}

const handleStar = (projectId: string) => {
  const index = itemList.value.findIndex(item => item.id === projectId);
  itemList.value[index].isCollection = !itemList.value[index].isCollection;
  if (itemList.value[index].isCollection) ElMessage.success("收藏成功");
};

const handleCommand = (command: string, project: any) => {
  switch (command) {
    case "update":
      handleUpdate(project);
      break;
    case "clone":
      handleClone(project);
      break;
    case "delete":
      handleDelete(project);
      break;
  }
};

const handleUpdate = (project: any) => {
  // TODO: 项目修改
  ElMessage.success("修改成功");
  console.log(project);
};

const handleClone = (project: any) => {
  // TODO: 项目克隆
  ElMessage.success("克隆成功");
  console.log(project);
};

const handleDelete = (project: { id: string; name: string }) => {
  // TODO: 项目删除
  ElMessage.success("删除成功");
  console.log(project);
};
</script>
<style scoped lang="scss">
.grid-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .card-item {
    flex: 0 0 calc(31% - 20px);
    height: 150px;
    padding: 10px;
    margin: 10px;
    border: 1px solid;
    border-color: var(--el-aside-border-color);
    border-radius: 8px;
    box-shadow: 0 0 10px rgb(0 0 0 / 10%);
    .card-header {
      display: flex;
      justify-content: space-between;
      height: 30%;
      .card-icon {
        img {
          height: 100%;
        }
      }
      .card-operation {
        opacity: 0;
        transition: opacity 0.5s ease;
        .el-button {
          margin-right: 5px;
        }
      }
    }
    .card-title {
      margin-bottom: 10px;
      font-size: 24px;
      font-weight: bold;
    }
    &:hover,
    &:hover .card-operation {
      .card-operation {
        opacity: 1;
      }
    }
  }
}
</style>
