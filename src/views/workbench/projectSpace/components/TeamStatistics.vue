<template>
  <div class="statistic-card">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-statistic :value="props.memberCount">
          <template #title>
            <span>成员</span>
          </template>
          <template #suffix>
            <el-icon class="icon-style">
              <User />
            </el-icon>
          </template>
        </el-statistic>
      </el-col>
      <el-col :span="8">
        <el-statistic :value="props.viewerCount" class="el-statistic-title">
          <template #title>
            <el-tooltip effect="dark" content="游客只能访问与其明确共享的项目" placement="top">
              <span>游客</span>
            </el-tooltip>
          </template>
          <template #suffix>
            <el-icon class="icon-style">
              <View />
            </el-icon>
          </template>
        </el-statistic>
      </el-col>
      <el-col :span="8">
        <el-statistic :value="props.pendingCount" class="el-statistic-title">
          <template #title>
            <span>待定</span>
          </template>
          <template #suffix>
            <el-icon class="icon-style">
              <Clock />
            </el-icon>
          </template>
        </el-statistic>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { Clock, User, View } from "@element-plus/icons-vue";
const props = defineProps({
  memberCount: {
    type: Number,
    default: 0
  },
  viewerCount: {
    type: Number,
    default: 0
  },
  pendingCount: {
    type: Number,
    default: 0
  }
});
</script>

<style scoped lang="scss">
.statistic-card {
  width: 100%;
  margin-bottom: 20px;
  .el-statistic {
    padding: 10px;
    background-color: var(--el-bg-color-page);
    border-radius: 8px;
    .icon-style {
      font-size: 16px;
      color: var(--el-color-primary);
      vertical-align: middle;
    }
  }
  .el-row {
    margin: -10px; // 根据内边距修正
  }
  .el-col {
    padding: 10px;
  }
}
</style>
