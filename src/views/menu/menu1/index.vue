<template>
  <div class="card content-box">
    <span class="text">我是menu1 🍓🍇🍈🍉</span>
    <el-input v-model="value" placeholder="测试缓存"></el-input>
    <el-button type="primary" @click="toggleImage">显示图片</el-button>

    <!-- 显示图片的div -->
    <div
      v-if="showImage"
      class="image-container"
      @mousemove="handleMouseMove"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <img src="src/assets/images/welcome.png" alt="Image" ref="imageRef" />
      <div v-if="showCoordinates" class="coordinates">
        <p>Mouse Coordinates: {{ mouseX }}, {{ mouseY }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const value = ref<string>("");
const showImage = ref<boolean>(true);
const mouseX = ref<number>(0);
const mouseY = ref<number>(0);
const showCoordinates = ref<boolean>(false);
const imageRef = ref<HTMLElement | null>(null);

// 切换图片显示状态
const toggleImage = () => {
  showImage.value = !showImage.value;
};

// 处理鼠标移动事件
const handleMouseMove = (event: MouseEvent) => {
  if (imageRef.value) {
    const rect = imageRef.value.getBoundingClientRect();
    mouseX.value = event.clientX - rect.left;
    mouseY.value = event.clientY - rect.top;
    showCoordinates.value = true;
  }
};

// 处理鼠标移入事件
const handleMouseEnter = () => {
  showCoordinates.value = true;
};

// 处理鼠标移出事件
const handleMouseLeave = () => {
  showCoordinates.value = false;
};
</script>

<style scoped lang="scss">
@import "./index.scss";

.image-container {
  margin-top: 20px;
  text-align: center;
  position: relative;

  img {
    max-width: 100%;
  }

  .coordinates {
    position: absolute;
    top: 10px;
    left: 10px;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 5px;
    border-radius: 5px;
  }
}
</style>
