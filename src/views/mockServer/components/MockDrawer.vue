<template>
  <el-drawer
    v-model="drawerVisible"
    :destroy-on-close="true"
    size="30%"
    :title="`${drawerProps.title}接口`"
  >
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="Mock方法" prop="mockMethod">
        <el-input
          v-model="drawerProps.row!.mockMethod"
          placeholder="请填写Mock方法"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="URL" prop="mockURL">
        <el-input
          v-model="drawerProps.row!.mockURL"
          placeholder="请填写URL"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="mockDescription">
        <el-input
          v-model="drawerProps.row!.mockDescription"
          placeholder="请填写描述"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="接口状态" prop="mockStatus">
        <el-select
          v-model="drawerProps.row!.mockStatus"
          placeholder="请选择接口状态"
          clearable
        >
          <el-option
            v-for="item in mockStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-drawer
        v-model="contentDrawer"
        :title="`${drawerProps.title}内容`"
        size="70%"
        direction="ltr"
      >
        <el-form-item prop="mockContent">
          <el-input
            v-model="drawerProps.row!.mockContent"
            type="textarea"
            style="margin: 0"
          >
          </el-input>
        </el-form-item>
      </el-drawer>
    </el-form>
    <el-button type="primary" @click="contentDrawer = true">
      {{ `${drawerProps.title}内容` }}
    </el-button>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button
        v-show="!drawerProps.isView"
        type="primary"
        @click="handleSubmit"
        >确定
      </el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="MockDrawer">
import { ref, reactive } from "vue";
import { mockStatus } from "@/utils/dict";
import { ElMessage, FormInstance } from "element-plus";
import { Mock } from "@/api/interface";

const rules = reactive({
  mockMethod: [{ required: true, message: "请填写接口方法" }],
  mockURL: [{ required: true, message: "请填写URL" }],
  mockDescription: [{ required: true, message: "请填写接口描述" }],
  mockStatus: [{ required: true, message: "请选择接口状态" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<Mock.ResList>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const contentDrawer = ref(false);
const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title} 接口成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};

defineExpose({
  acceptParams
});
</script>
