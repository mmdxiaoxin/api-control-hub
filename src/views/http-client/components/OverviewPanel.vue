<template>
  <el-container class="project-description card">
    <el-main class="content">
      <div class="header" @click="saveContent">
        <span class="text">
          {{ projectName }}
          <el-button :icon="Edit" circle size="small" @click="modifyName(projectName)" />
        </span>
        <el-tag>项目概览</el-tag>
      </div>
      <el-divider direction="horizontal" style="width: 100%" @click="saveContent" />
      <ApiStatistic @click="saveContent" />
      <div class="view" v-html="content" v-if="!EditMode" @click="editContent"></div>
      <WangEditor v-else v-model:value="content" height="300px" />
    </el-main>
    <el-divider direction="vertical" style="height: 100%" />
    <el-aside>
      <div class="aside" @click="saveContent">
        <span class="text"> ABOUT </span>
      </div>
    </el-aside>
  </el-container>
</template>

<script setup lang="ts">
import ApiStatistic from "./ApiStatistic.vue";
import { Edit } from "@element-plus/icons-vue";
import { onBeforeMount, ref } from "vue";
import WangEditor from "@/components/WangEditor/index.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getProjectDetail } from "@/api/modules/project";

const EditMode = ref(false);
const ShowMode = ref(true);
const content = ref("");
const props = defineProps({
  itemId: {
    type: String,
    required: true
  }
});
const projectName = ref();
const modifyName = (project: any) => {
  ElMessageBox.prompt("请输入要修改的项目名称", "修改名称", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    inputPattern: /\S/, // 验证规则，确保非空
    inputErrorMessage: "项目名称不能为空" // 错误信息
  })
    .then(({ value }) => {
      ShowMode.value = false;
      projectName.value = value;
      //TODO:连接后端项目修改
      console.log(`Modifying name for project ${project}`);
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
const editContent = () => {
  EditMode.value = true;
};
const saveContent = () => {
  EditMode.value = false;
};

const useProjectDetail = async () => {
  const { data } = await getProjectDetail({ projectId: props.itemId });
  projectName.value = data.name;
};

onBeforeMount(() => {
  useProjectDetail();
});
</script>

<style scoped lang="scss">
.project-description {
  flex: 1;
  height: 100%;
  .content {
    width: calc(100% - 230px);
    .header {
      display: flex;
      align-items: stretch;
      justify-content: space-between;
    }
    .view {
      position: relative;
      min-height: 300px;
      border-radius: 4px;

      /* 添加伪元素 */
      &::before {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        color: var(--el-color-info-dark-2);
        pointer-events: none; /* 防止干扰用户交互 */
        content: "点击这里可以编辑项目概览内容";
        background: rgb(255 255 255 / 80%);
        opacity: 0; /* 初始时不可见 */
        transition: opacity 0.3s; /* 添加渐变效果 */
      }
      &:hover::before {
        opacity: 1; /* 鼠标悬停时显示 */
      }
      &:hover {
        border: 1px solid #ebeef5;
      }
    }
  }
  .aside {
    width: 200px;
    height: 100%;
    margin-left: 20px;
  }
}
</style>
