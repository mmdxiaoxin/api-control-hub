<template>
  <div class="card my-space-container">
    <div class="space-container-header">
      <div class="space-container-title">
        <h1>{{ teamName }}</h1>
        <el-tag style="margin-left: 20px" :type="getRoleTagType(spaceRole)">
          {{ spaceRole }}
        </el-tag>
      </div>
      <span>
        <el-button
          type="primary"
          @click="addProject"
          v-if="activeName === 'first'"
        >
          添加项目
        </el-button>
      </span>
    </div>
    <el-tabs v-model="activeName" class="my-space-tabs">
      <el-tab-pane label="团队项目" name="projectList">
        <TeamProject :grid-list="projectList" :loading="loading" />
      </el-tab-pane>
      <el-tab-pane label="成员/权限" name="teamAndRole">
        <TeamStatistics />
        <TeamTable />
      </el-tab-pane>
      <el-tab-pane label="团队设置" name="setting">
        <TeamSetting
          :team-name="teamName as string"
          :team-id="teamId as string"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import TeamStatistics from "./components/TeamStatistics.vue";
import TeamTable from "./components/TeamTable.vue";
import TeamSetting from "./components/TeamSetting.vue";
import TeamProject from "./components/TeamProject.vue";
import { ElMessageBox } from "element-plus";
import { getRoleTagType } from "@/utils/workPlace";
import { useRoute } from "vue-router";
import { getProjectList } from "@/api/modules/project";
import { ProjectServer } from "@/api/interface";
import { useWorkbenchStore } from "@/stores/modules/workbench";

const route = useRoute();
const { id: teamId, spaceName: teamName } = route.query;
const workBench = useWorkbenchStore();
workBench.teamId = teamId as string;
workBench.teamName = teamName as string;
const spaceRole = ref("团队拥有者");
const activeName = ref("projectList");
const projectList = ref<ProjectServer.ResProjectItem[]>([]);
const loading = ref(false);

const addProject = () => {
  // TODO: 实现项目添加的功能
  ElMessageBox.prompt("请输入要添加的项目名称", "添加项目", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    inputPattern: /\S/, // 验证规则，确保非空
    inputErrorMessage: "项目名称不能为空" // 错误信息
  });
};

async function getSpaceInfo() {
  loading.value = true;
  const { data: gridList } = await getProjectList({ teamId: teamId as string });
  projectList.value = gridList;
  loading.value = false;
}

getSpaceInfo();
</script>
<style scoped lang="scss">
@import "./index.scss";
</style>
