<template>
  <el-container class="project-description card">
    <el-main class="project-content">
      <div class="project-header" @click="saveContent">
        <span class="text">
          {{ projectName }}
          <el-button
            :icon="Edit"
            circle
            size="small"
            @click="modifyName(projectName)"
          />
        </span>
        <el-tag>项目概览</el-tag>
      </div>
      <el-divider
        direction="horizontal"
        style="width: 100%"
        @click="saveContent"
      />
      <ApiStatistic @click="saveContent" />
      <div
        class="content-view"
        v-html="content"
        v-if="!EditMode"
        @click="editContent"
      ></div>
      <WangEditor v-else v-model:value="content" height="300px" />
    </el-main>
    <el-divider direction="vertical" style="height: 100%" />
    <el-aside>
      <div class="project-aside" @click="saveContent">
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
@import "index";
</style>
