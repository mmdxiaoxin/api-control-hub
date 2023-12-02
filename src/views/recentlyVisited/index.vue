<template>
  <div class="collection-content card">
    <div class="title"><h1>最近访问</h1></div>
    <div class="collection-box card">
      <div class="collection-item" v-for="collection in collections" :key="collection.id">
        <div class="collection-item-title">
          <div class="collection-item-img">
            <el-image class="item-img" :src="collection.imageUrl" fit="cover">
              <template #placeholder>
                <div class="image-slot">Loading<span class="dot">...</span></div>
              </template>
              <template #error>
                <div class="image-slot">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
          </div>
          {{ collection.title }}
        </div>
        <div class="collection-item-operation">
          <el-button :icon="Edit" circle @click="handleButtonClick('edit', collection)" />
          <el-button type="info" :icon="Message" circle @click="handleButtonClick('detail', collection)" />
          <el-button type="warning" :icon="Star" circle @click="handleButtonClick('star', collection)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="recentlyVisited">
import { ref, onMounted } from "vue";
import { Edit, Message, Star } from "@element-plus/icons-vue";

interface Collection {
  id: number;
  title: string;
  imageUrl: string;
}

const collections = ref<Collection[]>([]);

// 模拟异步获取数据
onMounted(() => {
  collections.value = [
    {
      id: 1,
      title: "测试项目1",
      imageUrl: "src/assets/icons/xianxingdaoyu.svg"
    },
    {
      id: 2,
      title: "测试项目2",
      imageUrl: "src/assets/icons/xianxingdiqiu.svg"
    }
    // 添加更多数据项
  ];
});

const handleButtonClick = (action: string, collection: Collection) => {
  // 在这里执行与特定项目相关的操作
  if (action === "star") {
    // 执行收藏操作
    console.log(`Clicked on Star for item: ${collection.title}`);
  } else if (action === "edit") {
    // 执行编辑操作
    console.log(`Clicked on Edit for item: ${collection.title}`);
  } else if (action === "detail") {
    // 执行详情操作
    console.log(`Clicked on Detail for item: ${collection.title}`);
  }
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
