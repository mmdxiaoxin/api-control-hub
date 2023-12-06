<template>
  <div class="card my-space-container">
    <div class="space-container-header">
      <div class="space-container-title">
        <h1>{{ spaceTitle }}</h1>
        <el-tag style="margin-left: 20px" :type="getTagType(spaceRole)">{{ spaceRole }}</el-tag>
      </div>
      <span>
        <!-- 添加项目按钮 -->
        <el-button type="primary" @click="addProject" v-if="activeName === 'first'">添加项目</el-button>
      </span>
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
                  <el-button :icon="Position" circle @click="activeProject(element)"></el-button>
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
                        <el-dropdown-item :icon="DocumentCopy" @click="cloneProject(element)">克隆项目 </el-dropdown-item>
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
        <TeamSetting :team-name="spaceTitle" :team-id="spaceId" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts" name="mySpace">
import { onMounted, ref } from "vue";
import draggable from "vuedraggable";
import type { DropdownInstance } from "element-plus";
import { ElMessage, ElMessageBox } from "element-plus";
import { getTagType } from "@/utils/workPlace";
import { useWorkPlaceStore } from "@/stores/modules/workPlace";
import TeamStatistics from "./components/TeamStatistics.vue";
import TeamTable from "./components/TeamTable.vue";
import TeamSetting from "./components/TeamSetting.vue";
import { Delete, Document, DocumentCopy, More, Position, Star } from "@element-plus/icons-vue";
import { useRoute, useRouter } from "vue-router";

const workPlace = useWorkPlaceStore();
const route = useRoute();
const router = useRouter();
const spaceTitle = ref("个人空间");
const spaceId = ref("");
const spaceRole = ref("团队拥有者");
const activeName = ref("first");
const operation = ref<DropdownInstance>();
const gridList = ref([
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

const activeProject = (project: any) => {
  ElMessage.success(`激活项目-${project.title}`);
  //TODO:获取currentRole和curNickName
  workPlace.setWorkPlace(project.id, spaceId.value, project.title, spaceTitle.value, project.currentRole, project.curNickName);
  router.push("/projectCollection/index");
};

const starCollection = (id: number) => {
  const index = gridList.value.findIndex(item => item.id === id);
  gridList.value[index].isCollection = !gridList.value[index].isCollection;
};

const modifyName = (project: any) => {
  ElMessageBox.prompt("请输入要修改的项目名称", "修改名称", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    inputPattern: /\S/, // 验证规则，确保非空
    inputErrorMessage: "项目名称不能为空" // 错误信息
  })
    .then(({ value }) => {
      // 在用户确认输入后更新项目的名称
      const index = gridList.value.findIndex((item: any) => item.id === project.id);
      if (index !== -1) {
        gridList.value[index].title = value;
      }
      //TODO:连接后端项目修改
      console.log(`Modifying name for project ${project.id}: ${project.title}`);
      ElMessage({
        type: "success",
        message: `修改成功:${value}`
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消输入"
      });
    });
};

const addProject = () => {
  // TODO:修改为使用Drawer
  ElMessageBox.prompt("请输入要添加的项目名称", "添加项目", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    inputPattern: /\S/, // 验证规则，确保非空
    inputErrorMessage: "项目名称不能为空" // 错误信息
  })
    .then(({ value }) => {
      const newId = Math.floor(Math.random() * 1000);
      const addProject = {
        id: newId,
        title: value,
        icon: "src/assets/icons/xianxingdaoyu.svg"
      };
      gridList.value.push(addProject);
      ElMessage({
        type: "success",
        message: `添加成功:${addProject.id}: ${addProject.title}`
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消添加"
      });
    });
};

const cloneProject = (project: any) => {
  const newId = Math.floor(Math.random() * 1000);
  const newTitle = `${project.title}-副本`;
  const clonedProject = {
    id: newId,
    title: newTitle,
    icon: project.icon
  };
  //TODO:连接后端项目添加
  gridList.value.push(clonedProject);
  ElMessage({
    type: "success",
    message: `克隆成功:${project.id}: ${project.title}`
  });
};

const deleteProject = (project: { id: number; title: string }) => {
  ElMessageBox.confirm(`确认删除项目 ${project.title} 吗？`, "删除项目", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      // 用户确认删除，从 gridList 中移除项目
      gridList.value = gridList.value.filter(item => item.id !== project.id);

      ElMessage({
        type: "success",
        message: `成功删除项目: ${project.title}`
      });
      //TODO:连接后端项目删除
      console.log(`Deleting project ${project.id}: ${project.title}`);
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消删除"
      });
    });
};

onMounted(() => {
  const teamId = route.query.id as string;
  const spaceName = route.query.spaceName as string;

  // 使用 spaceName 设置 spaceTitle
  if (spaceName) {
    spaceTitle.value = spaceName;
    spaceId.value = teamId;
  }
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
