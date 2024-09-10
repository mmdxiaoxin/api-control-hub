<template>
  <el-container class="overview-box card">
    <el-main class="content">
      <div class="header">
        <span class="text">
          {{ title }}
          <el-button :icon="Edit" circle size="small" @click="modifyName(title)" />
        </span>
        <el-tag>项目概览</el-tag>
      </div>
      <el-divider direction="horizontal" style="width: 100%" />
      <div class="statistic-box">
        <el-row>
          <el-col :span="6">
            <el-statistic title="接口数目" />
          </el-col>
          <el-col :span="6">
            <el-statistic title="Mock接口数目" />
          </el-col>
          <el-col :span="6">
            <el-statistic title="今日Mock调用次数">
              <template #suffix>
                <el-icon style="vertical-align: -0.125em">
                  <Clock />
                </el-icon>
              </template>
            </el-statistic>
          </el-col>
          <el-col :span="6">
            <el-statistic title="总Mock调用次数" :value="props.totalMockCount">
              <template #suffix>
                <el-icon style="vertical-align: -0.125em">
                  <Connection />
                </el-icon>
              </template>
            </el-statistic>
          </el-col>
        </el-row>
      </div>
    </el-main>
    <el-divider direction="vertical" style="height: 100%" />
    <el-aside>
      <div class="aside">
        <span class="text"> ABOUT </span>
      </div>
    </el-aside>
  </el-container>
</template>

<script setup lang="ts">
import { Clock, Connection, Edit } from "@element-plus/icons-vue";
import { ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getProjectDetail } from "@/api/modules/project";

const props = defineProps({
  itemId: {
    type: String,
    required: true
  }
});

const title = ref();
const visible = ref(true);

const modifyName = (project: any) => {
  ElMessageBox.prompt("请输入要修改的项目名称", "修改名称", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    inputPattern: /\S/,
    inputErrorMessage: "项目名称不能为空"
  })
    .then(({ value }) => {
      visible.value = false;
      title.value = value;
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

const init = async () => {
  const { data } = await getProjectDetail({ projectId: props.itemId });
  title.value = data.name;
};
init();
</script>

<style scoped lang="scss">
.overview-box {
  flex: 1;
  height: 100%;
  .content {
    width: calc(100% - 230px);
    .header {
      display: flex;
      align-items: stretch;
      justify-content: space-between;
    }
  }
  .aside {
    width: 200px;
    height: 100%;
    margin-left: 20px;
  }
}
</style>
