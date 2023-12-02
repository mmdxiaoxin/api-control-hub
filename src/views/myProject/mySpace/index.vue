<template>
  <div class="card my-space-container">
    <div class="space-container-title">
      <h1>个人空间</h1>
      <el-tag style="margin-left: 20px" :type="getTagType(workPlace.currentRole)">{{ workPlace.currentRole }}</el-tag>
    </div>
    <el-tabs v-model="activeName" class="my-space-tabs">
      <el-tab-pane label="团队项目" name="first">
        <draggable
          v-model="gridList"
          class="card grid-container"
          item-key="id"
          animation="300"
          chosen-class="chosen"
          force-fallback="true"
        >
          <template #item="{ element }">
            <div class="card-item">
              <div class="card-header">
                <div class="card-icon">
                  <img :src="element.icon" alt="图标不存在" />
                </div>
                <div class="card-operation">
                  <el-button :icon="Position" circle></el-button>
                  <el-button
                    :type="element.isCollection ? '' : 'warning'"
                    :icon="Star"
                    circle
                    @click="starCollection(element.id)"
                  ></el-button>
                  <el-dropdown ref="operation">
                    <span class="el-dropdown-link">
                      <el-button :icon="More" text></el-button>
                    </span>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item :icon="Document" @click="modifyName(element)">修改名称</el-dropdown-item>
                        <el-dropdown-item :icon="DocumentCopy" @click="cloneProject(element)">克隆项目</el-dropdown-item>
                        <el-dropdown-item :icon="Delete" @click="deleteProject(element)">删除项目</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
              </div>
              <div class="card-title">{{ element.title || "Error: Title not provided" }}</div>
              <el-tag class="card-tag">{{ element.role || "HTTP" }}</el-tag>
            </div>
          </template>
        </draggable>
      </el-tab-pane>
      <el-tab-pane label="成员/权限" name="second">
        <TeamStatistics />
        <TeamTable />
      </el-tab-pane>
      <el-tab-pane label="团队设置" name="third">
        <TeamSetting />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts" name="mySpace">
import { ref } from "vue";
import draggable from "vuedraggable";
import type { DropdownInstance } from "element-plus";
import { getTagType } from "@/utils/workPlace";
import { useWorkPlaceStore } from "@/stores/modules/workPlace";
import TeamStatistics from "./components/TeamStatistics.vue";
import TeamTable from "./components/TeamTable.vue";
import TeamSetting from "./components/TeamSetting.vue";
import { Delete, DocumentCopy, More, Position, Star, Document } from "@element-plus/icons-vue";

const workPlace = useWorkPlaceStore();

const activeName = ref("first");
const operation = ref<DropdownInstance>();
let gridList = ref([
  { id: 1, title: "企业网站建设", icon: "src/assets/icons/xianxingdaoyu.svg", isCollection: true },
  { id: 2, title: "电商平台开发", icon: "src/assets/icons/xianxingdiqiu.svg", isCollection: true },
  { id: 3, title: "社交媒体应用", icon: "src/assets/icons/xianxingditu.svg", isCollection: true },
  { id: 4, title: "在线教育平台", icon: "src/assets/icons/xianxingfanchuan.svg" },
  { id: 5, title: "智能家居控制系统", icon: "src/assets/icons/xianxingfeiji.svg" },
  { id: 6, title: "健康管理应用", icon: "src/assets/icons/xianxinglvhangriji.svg" },
  { id: 7, title: "旅游信息平台", icon: "src/assets/icons/xianxingtianqiyubao.svg" },
  { id: 8, title: "智能物流系统", icon: "src/assets/icons/xianxingxiangjipaizhao.svg" },
  { id: 9, title: "人才招聘平台", icon: "src/assets/icons/xianxingxiarilengyin.svg" },
  { id: 10, title: "金融数据分析工具", icon: "src/assets/icons/xianxingyoulun.svg" },
  { id: 11, title: "在线购物商城", icon: "src/assets/icons/xianxingdaoyu.svg" },
  { id: 12, title: "智能车辆管理系统", icon: "src/assets/icons/xianxingdaoyu.svg" }
]);

const starCollection = (id: number) => {
  const index = gridList.value.findIndex(item => item.id === id);
  gridList.value[index].isCollection = !gridList.value[index].isCollection;
};

const modifyName = (project: { id: number; title: string }) => {
  // Implement logic to modify the name of the project
  console.log(`Modifying name for project ${project.id}: ${project.title}`);
};

const cloneProject = (project: { id: number; title: string }) => {
  // Implement logic to clone the project
  console.log(`Cloning project ${project.id}: ${project.title}`);
};

const deleteProject = (project: { id: number; title: string }) => {
  // Implement logic to delete the project
  console.log(`Deleting project ${project.id}: ${project.title}`);
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
