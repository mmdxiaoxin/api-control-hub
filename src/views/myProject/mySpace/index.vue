<template>
  <div class="card my-space-container">
    <h1>个人空间</h1>
    <el-tabs v-model="activeName" class="my-space-tabs" @tab-click="handleClick">
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
            <div :class="'item' + ' ' + 'item-' + element.num">
              {{ element.num }}
            </div>
          </template>
        </draggable>
      </el-tab-pane>
      <el-tab-pane label="成员/权限" name="second">Config</el-tab-pane>
      <el-tab-pane label="团队设置" name="third">Role</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts" name="mySpace">
import { ref } from "vue";
import draggable from "vuedraggable";
import type { TabsPaneContext } from "element-plus";
const activeName = ref("first");

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
};
let gridList = ref([
  { id: 1, num: 1 },
  { id: 2, num: 2 },
  { id: 3, num: 3 },
  { id: 4, num: 4 },
  { id: 5, num: 5 },
  { id: 6, num: 6 },
  { id: 7, num: 7 },
  { id: 8, num: 8 },
  { id: 9, num: 9 }
]);
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
