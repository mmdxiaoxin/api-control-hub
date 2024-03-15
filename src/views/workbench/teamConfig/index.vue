<template>
  <div class="my-team-container card">
    <div class="team-container-header">
      <div class="team-container-title">
        <h1>团队设置</h1>
      </div>
      <span>
        <!-- 添加项目按钮 -->
        <el-button type="primary" @click="addTeamSpace" style="margin-right: 20px">添加团队</el-button>
      </span>
    </div>
    <el-divider />
    <div class="team-box card">
      <div class="team-item" v-for="team in teams" :key="team.id">
        <div class="item-title">
          <div class="item-img">
            <!-- 使用你的团队图片字段，这里假设是team.imageUrl -->
            <el-image class="item-img" :src="team.imageUrl" fit="cover">
              <template #placeholder>
                <div class="image-slot">Loading<span class="dot">...</span></div>
              </template>
              <template #error>
                <div class="image-slot">
                  <!-- 使用你的默认图片 -->
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
          </div>
          {{ team.name }}
          <!-- 使用你的团队名称字段 -->
        </div>
        <div class="item-operation">
          <el-button type="info" :icon="Position" circle @click="handleButtonClick('detail', team)" />
          <el-button type="danger" :icon="Delete" circle @click="handleButtonClick('delete', team)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Delete, Position } from "@element-plus/icons-vue";

interface Team {
  id: number;
  name: string;
  imageUrl: string;
}

const teams = ref<Team[]>([]);
// 模拟异步获取数据
onMounted(() => {
  teams.value = [
    {
      id: 1,
      name: "团队1",
      imageUrl: "src/assets/icons/xianxingdaoyu.svg"
    },
    {
      id: 2,
      name: "团队2",
      imageUrl: "src/assets/icons/xianxingdiqiu.svg"
    }
    // 添加更多数据项
  ];
});

const handleButtonClick = (action: string, team: Team) => {
  // 在这里执行与特定团队相关的操作
  if (action === "delete") {
    console.log(`Clicked on delete for team: ${team.name}`);
  } else if (action === "detail") {
    console.log(`Clicked on Detail for team: ${team.name}`);
  }
};

const addTeamSpace = () => {
  // 在这里执行添加团队的操作
  console.log("Clicked on addTeamSpace");
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
