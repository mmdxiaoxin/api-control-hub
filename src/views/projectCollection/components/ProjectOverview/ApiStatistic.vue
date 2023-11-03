<template>
  <div class="statistic-box">
    <el-row>
      <el-col :span="6">
        <el-statistic title="接口数目" :value="props.apiCount" />
      </el-col>
      <el-col :span="6">
        <el-statistic title="Mock接口数目" :value="props.mockCount" />
      </el-col>
      <el-col :span="6">
        <el-statistic title="今日Mock调用次数" :value="props.dailyMockCount">
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
</template>
<script setup lang="ts">
import { Connection, Clock } from "@element-plus/icons-vue";
const props = defineProps({
  apiCount: {
    type: Number,
    default: 0
  },
  mockCount: {
    type: Number,
    default: 0
  },
  dailyMockCount: {
    type: Number,
    default: 0
  },
  totalMockCount: {
    type: Number,
    default: 0
  }
});
</script>
<style scoped lang="scss">
.statistic-box {
  margin-bottom: 20px;
}
</style>
