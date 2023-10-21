<template>
  <div class="message">
    <el-popover placement="bottom" :width="310" trigger="click">
      <template #reference>
        <el-badge :value="notifications.length + messages.length + todos.length" class="item">
          <i :class="'iconfont icon-xiaoxi'" class="toolBar-icon"></i>
        </el-badge>
      </template>
      <el-tabs v-model="activeName">
        <el-tab-pane :label="numberOfNotifications" name="first">
          <div class="message-list">
            <div class="message-item" v-for="notification in notifications" :key="notification.id">
              <img :src="notification.icon" alt="" class="message-icon" />
              <div class="message-content">
                <span class="message-title">{{ notification.title }}</span>
                <span class="message-date">{{ notification.date }}</span>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="numberOfMessages" name="second">
          <div class="message-list">
            <div class="message-item" v-for="message in messages" :key="message.id">
              <img :src="message.icon" alt="" class="message-icon" />
              <div class="message-content">
                <span class="message-title">{{ message.title }}</span>
                <span class="message-date">{{ message.date }}</span>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane :label="numberOfTodos" name="third">
          <div class="message-list">
            <div class="message-item" v-for="todo in todos" :key="todo.id">
              <img :src="todo.icon" alt="" class="message-icon" />
              <div class="message-content">
                <span class="message-title">{{ todo.title }}</span>
                <span class="message-date">{{ todo.date }}</span>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
const activeName = ref("first");
const numberOfNotifications = ref("通知(0)");
const numberOfMessages = ref("消息(0)");
const numberOfTodos = ref("待办(0)");

const notifications = ref([
  {
    id: 1,
    icon: "src/assets/images/msg01.png",
    title: "一键三连 🧡",
    date: "一分钟前"
  },
  {
    id: 2,
    icon: "src/assets/images/msg02.png",
    title: "一键三连 💙",
    date: "一小时前"
  },
  {
    id: 3,
    icon: "src/assets/images/msg03.png",
    title: "新通知 💌",
    date: "2小时前"
  },
  {
    id: 4,
    icon: "src/assets/images/msg04.png",
    title: "重要通知 🚨",
    date: "昨天"
  },
  {
    id: 5,
    icon: "src/assets/images/msg05.png",
    title: "通知示例 📢",
    date: "两天前"
  }
  // 继续添加更多通知项
]);

const messages = ref([
  {
    id: 1,
    icon: "src/assets/images/msg03.png",
    title: "新消息 💌",
    date: "2小时前"
  },
  {
    id: 2,
    icon: "src/assets/images/msg04.png",
    title: "未读消息 📬",
    date: "昨天"
  }
  // 添加更多消息项
]);

const todos = ref([
  {
    id: 1,
    icon: "src/assets/images/msg05.png",
    title: "处理任务 1 ✅",
    date: "今天"
  },
  {
    id: 2,
    icon: "src/assets/images/msg01.png",
    title: "待办事项 2 ⏰",
    date: "明天"
  }
  // 添加更多代办项
]);

onMounted(() => {
  numberOfNotifications.value = `通知(${notifications.value.length})`;
  numberOfMessages.value = `消息(${messages.value.length})`;
  numberOfTodos.value = `待办(${todos.value.length})`;
});
</script>

<style scoped lang="scss">
.message-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 260px;
  line-height: 45px;
}
.message-list {
  display: flex;
  flex-direction: column;
  .message-item {
    display: flex;
    align-items: center;
    padding: 20px 0;
    border-bottom: 1px solid var(--el-border-color-light);
    &:last-child {
      border: none;
    }
    .message-icon {
      width: 40px;
      height: 40px;
      margin: 0 20px 0 5px;
    }
    .message-content {
      display: flex;
      flex-direction: column;
      .message-title {
        margin-bottom: 5px;
      }
      .message-date {
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }
    }
  }
}
</style>
