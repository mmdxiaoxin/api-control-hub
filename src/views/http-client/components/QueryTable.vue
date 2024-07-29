<template>
  <el-table :data="localQueryParams" style="width: 100%" border>
    <el-table-column prop="key" label="参数名">
      <template #default="scope">
        <span v-if="!scope.row.isEditing">{{ scope.row.key }}</span>
        <!-- <el-input v-else v-model="scope.row.key" @blur="saveEdit(scope.row)" />-->
        <el-input v-else v-model="scope.row.key" />
      </template>
    </el-table-column>
    <el-table-column prop="value" label="参数值">
      <template #default="scope">
        <span v-if="!scope.row.isEditing">{{ scope.row.value }}</span>
        <el-input v-else v-model="scope.row.value" />
      </template>
    </el-table-column>
    <el-table-column prop="description" label="描述">
      <template #default="scope">
        <span v-if="!scope.row.isEditing">{{ scope.row.description }}</span>
        <el-input v-else v-model="scope.row.description" />
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <div class="operation">
          <el-button
            v-if="!scope.row.isEditing"
            type="primary"
            @click="startEdit(scope.row)"
          >
            修改
          </el-button>
          <el-button v-else type="success" @click="saveEdit(scope.row)">
            保存
          </el-button>
          <el-button type="danger" @click="removeQueryParam(scope.row)">
            删除
          </el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>
  <el-button @click="addQueryParam" style="width: 100%" :icon="Plus">
    添加参数
  </el-button>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Plus } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

const props = defineProps({
  queryParams: Array
});
const emit = defineEmits([
  "update:queryParams",
  "addQueryParam",
  "removeQueryParam"
]);

// 创建本地变量，将其与父组件的 prop 进行双向绑定
const localQueryParams = ref<Array<any>>(props.queryParams || []);

const addQueryParam = () => {
  // 添加新的参数行，并将其设为编辑状态
  const newParam = { key: "", value: "", description: "", isEditing: true };
  localQueryParams.value.push(newParam);
  emit("addQueryParam", localQueryParams.value);
};

const startEdit = (row: any) => {
  row.isEditing = true;
};

const saveEdit = (row: any) => {
  // 检查是否有 key 属性，如果没有就不可以保存
  if (row.key === "") {
    ElMessage.error("参数名不能为空");
    return;
  }
  row.isEditing = false;
  emit("update:queryParams", localQueryParams.value);
};

const removeQueryParam = (row: any) => {
  const index = localQueryParams.value.indexOf(row);
  if (index !== -1) {
    localQueryParams.value.splice(index, 1);
    emit("removeQueryParam", localQueryParams.value);
  }
};

watch(
  () => props.queryParams!,
  (newVal: any) => {
    localQueryParams.value = newVal;
  }
);
</script>

<style scoped lang="scss">
.operation {
  display: flex;
  justify-content: space-evenly;
}
</style>
