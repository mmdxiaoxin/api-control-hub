<template>
  <div class="table-box">
    <div class="card table-detail">
      <h3>Base URL:</h3>
      <span>{{ baseURL }}</span>
    </div>
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="getMockList"
      :init-param="initParam"
      :data-callback="dataCallback"
      @darg-sort="sortTable"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button v-if="BUTTONS.add" type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增接口</el-button>
        <el-button v-if="BUTTONS.import" type="primary" :icon="Upload" plain @click="batchAdd">导入接口</el-button>
        <el-button v-if="BUTTONS.export" type="primary" :icon="Download" plain @click="downloadFile">导出接口</el-button>
        <el-button
          v-if="BUTTONS.delete"
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="batchDelete(scope.selectedListIds)"
        >
          批量删除接口
        </el-button>
      </template>
      <!-- Expand -->
      <template #expand="scope">
        <div class="expand-content card">
          <div class="expand-item">
            <span class="label">Method:</span>
            <span class="value">{{ scope.row.mockMethod }}</span>
          </div>
          <div class="expand-item">
            <span class="label">URL:</span>
            <span class="value">{{ scope.row.mockURL }}</span>
          </div>
          <div class="expand-item">
            <span class="label">描述:</span>
            <span class="value">{{ scope.row.mockDescription }}</span>
          </div>
        </div>
      </template>
      <!-- usernameHeader -->
      <template #usernameHeader="scope">
        <el-button type="primary" @click="ElMessage.success('我是通过作用域插槽渲染的表头')">
          {{ scope.column.label }}
        </el-button>
      </template>
      <!-- createTime -->
      <template #createTime="scope">
        <el-button type="primary" link @click="ElMessage.success('我是通过作用域插槽渲染的内容')">
          {{ scope.row.createTime }}
        </el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <MockDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { ref, reactive } from "vue";
import { MockServer } from "@/api/interface";
import { useHandleData } from "@/hooks/useHandleData";
import { useDownload } from "@/hooks/useDownload";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import { ElMessage, ElMessageBox } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen, Download, Upload, View } from "@element-plus/icons-vue";
import { deleteUser, editUser, addUser, exportUserInfo, BatchAddUser } from "@/api/modules/user";
import { changeMockStatus, getMockList, getMockStatus } from "@/api/modules/mockServer";
import MockDrawer from "@/views/mockServer/components/MockDrawer.vue";

const baseURL = "https://mock.presstime.cn/mock/6534b86affb279f23e01859d/api-control-hub";

// ProTable 实例
const proTable = ref<ProTableInstance>();

// 页面按钮权限（按钮权限既可以使用 hooks，也可以直接使用 v-auth 指令，指令适合直接绑定在按钮上，hooks 适合根据按钮权限显示不同的内容）
const { BUTTONS } = useAuthButtons();

// 如果表格需要初始化请求参数，直接定义传给 ProTable (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ type: 1 });

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total && pageNum && pageSize 这些字段，可以在这里进行处理成这些字段
// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};

// 表格配置项
const columns = reactive<ColumnProps<MockServer.ResMockList>[]>([
  { type: "selection", fixed: "left", width: 70 },
  { type: "expand", label: "", width: 85 },
  {
    prop: "mockMethod",
    label: "Method",
    render: scope => {
      let tag;
      if (scope.row.mockMethod === "GET") tag = <el-tag>GET</el-tag>;
      else if (scope.row.mockMethod === "POST") tag = <el-tag type="warning">POST</el-tag>;
      else if (scope.row.mockMethod === "PUT") tag = <el-tag type="success">PUT</el-tag>;
      else if (scope.row.mockMethod === "DELETE") tag = <el-tag type="danger">DELETE</el-tag>;
      return <span>{tag}</span>;
    }
  },
  { prop: "mockURL", label: "URL" },
  { prop: "mockDescription", label: "接口描述" },
  {
    prop: "mockStatus",
    label: "接口状态",
    sortable: true,
    tag: true,
    enum: getMockStatus,
    fieldNames: { label: "mockLabel", value: "mockStatus" },
    render: scope => {
      return (
        <>
          {BUTTONS.value.status ? (
            <el-switch
              model-value={scope.row.mockStatus}
              active-text={scope.row.mockStatus ? "启用" : "禁用"}
              active-value={1}
              inactive-value={0}
              onClick={() => changeStatus(scope.row)}
            />
          ) : (
            <el-tag type={scope.row.mockStatus ? "success" : "danger"}>{scope.row.mockStatus ? "启用" : "禁用"}</el-tag>
          )}
        </>
      );
    }
  },
  { prop: "operation", label: "操作", width: 300, fixed: "right" }
]);

// 表格拖拽排序
const sortTable = ({ newIndex, oldIndex }: { newIndex?: number; oldIndex?: number }) => {
  console.log(newIndex, oldIndex);
  console.log(proTable.value?.tableData);
  ElMessage.success("修改列表排序成功");
};

// 删除mock接口信息
const deleteAccount = async (params: MockServer.ResMockList) => {
  await useHandleData(deleteUser, { id: [params.id] }, `删除【${params.mockDescription}】接口`);
  proTable.value?.getTableList();
};

// 批量删除mock接口信息
const batchDelete = async (id: string[]) => {
  await useHandleData(deleteUser, { id }, "删除所选接口");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

// 切换用户状态
const changeStatus = async (row: MockServer.ResMockList) => {
  await useHandleData(
    changeMockStatus,
    { id: row.id, mockStatus: row.mockStatus == 1 ? 0 : 1 },
    `切换【${row.mockDescription}】接口状态`
  );
  proTable.value?.getTableList();
};

// 导出用户列表
const downloadFile = async () => {
  ElMessageBox.confirm("确认导出用户数据?", "温馨提示", { type: "warning" }).then(() =>
    useDownload(exportUserInfo, "用户列表", proTable.value?.searchParam)
  );
};

// 批量添加用户
const dialogRef = ref<InstanceType<typeof ImportExcel> | null>(null);
const batchAdd = () => {
  const params = {
    title: "接口",
    tempApi: exportUserInfo,
    importApi: BatchAddUser,
    getTableList: proTable.value?.getTableList
  };
  dialogRef.value?.acceptParams(params);
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof MockDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<MockServer.ResMockList> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addUser : title === "编辑" ? editUser : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>

<style scoped lang="scss">
.expand-content {
  margin: 10px;
  .expand-item {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    .label {
      margin-right: 10px;
      font-weight: bold;
    }
    .value {
      color: #333333;
    }
  }
}
</style>
