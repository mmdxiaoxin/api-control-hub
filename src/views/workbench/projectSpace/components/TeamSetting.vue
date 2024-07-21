<template>
  <el-descriptions
    :column="1"
    border
    title="基础信息"
    class="card"
    style="margin-bottom: 20px"
  >
    <el-descriptions-item width="30%" label="团队名称">
      <div class="team-name">
        <span v-if="!editMode.teamName">{{ props.teamName }}</span>
        <el-input v-else v-model="teamNameRef" style="width: 70%" />
        <el-button
          disabled
          :type="editMode.teamName ? 'success' : 'info'"
          @click="toggleEditMode('teamName')"
        >
          {{ editMode.teamName ? "保存" : "编辑" }}
        </el-button>
      </div>
    </el-descriptions-item>
    <el-descriptions-item label="我的团队内昵称">
      <div class="nick-name">
        <span v-if="!editMode.curNickName">{{ props.curNickName }}</span>
        <el-input v-else v-model="curNickNameRef" style="width: 70%" />
        <el-button
          :type="editMode.curNickName ? 'success' : 'info'"
          @click="toggleEditMode('curNickName')"
          >{{ editMode.curNickName ? "保存" : "编辑" }}</el-button
        >
      </div>
    </el-descriptions-item>
  </el-descriptions>
  <el-descriptions :column="1" border title="危险区域" class="card">
    <el-descriptions-item width="30%" label="移交">
      <div class="team-transfer">
        <span>将团队的所有者权限移交给其他成员</span
        ><el-button type="warning">移交</el-button>
      </div>
    </el-descriptions-item>
    <el-descriptions-item label="解散团队">
      <div class="team-delete">
        <span>务必谨慎，解散后无法找回</span
        ><el-button type="danger">解散</el-button>
      </div>
    </el-descriptions-item>
  </el-descriptions>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";

const props = defineProps({
  teamId: String,
  teamName: String,
  curNickName: String
});

const teamNameRef = ref(props.teamName);
const curNickNameRef = ref(props.curNickName);
const editMode = reactive({
  teamName: false,
  curNickName: false
});

const toggleEditMode = (field: keyof typeof editMode) => {
  if (editMode[field]) {
    ElMessage.success("保存成功");
  }
  editMode[field] = !editMode[field];
};
</script>

<style scoped lang="scss">
.nick-name,
.team-name,
.team-transfer,
.team-delete {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
</style>
