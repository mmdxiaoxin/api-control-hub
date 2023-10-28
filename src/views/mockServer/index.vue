<template>
  <div class="main-box">
    <TreeFilter
      label="name"
      title="Mock服务"
      :data="treeFilterData"
      :default-value="initParam.collectionId"
      @change="changeTreeFilter"
      @darg-sort="sortTable"
    />
    <div class="table-box">
      <div class="card table-detail">
        <h3>Base URL:</h3>
        <span>{{ "https://mock.presstime.cn/mock/6534b86affb279f23e01859d/api-control-hub" }}</span>
      </div>
      <ProTable
        ref="proTable"
        row-key="id"
        :indent="20"
        :columns="columns"
        :request-api="getMockTreeList"
        :request-auto="false"
        :init-param="initParam"
        :search-col="{ xs: 1, sm: 1, md: 2, lg: 3, xl: 3 }"
      >
        <!-- 表格 header 按钮 -->
        <template #tableHeader>
          <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增接口</el-button>
          <el-button type="primary" :icon="Upload" plain @click="batchAdd">导入接口</el-button>
          <el-button type="primary" :icon="Download" plain @click="downloadFile">导出接口</el-button>
          <el-button type="danger" :icon="Delete"> 批量删除</el-button>
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
        <!-- 表格操作 -->
        <template #operation="scope">
          <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
          <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
          <el-button type="primary" link :icon="Delete" @click="deleteMockServer(scope.row)">删除</el-button>
        </template>
      </ProTable>
      <UserDrawer ref="drawerRef" />
      <ImportExcel ref="dialogRef" />
    </div>
  </div>
</template>

<script setup lang="tsx" name="mockServer">
import { onMounted, reactive, ref } from "vue";
import { MockServer, User } from "@/api/interface";
import { useHandleData } from "@/hooks/useHandleData";
import { ElMessage, ElMessageBox } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import TreeFilter from "@/components/TreeFilter/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import UserDrawer from "@/views/proTable/components/UserDrawer.vue";
import { CirclePlus, Delete, Download, EditPen, Upload, View } from "@element-plus/icons-vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { addUser, BatchAddUser, editUser, exportUserInfo } from "@/api/modules/user";
import { deleteMock, getMockCollectionList, getMockStatus, getMockTreeList } from "@/api/modules/mockServer";
import { useDownload } from "@/hooks/useDownload";

onMounted(() => {
  getTreeFilter();
});

// ProTable 实例
const proTable = ref<ProTableInstance>();

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ collectionId: "" });

// 获取 treeFilter 数据
// 当 proTable 的 requestAuto 属性为 false，不会自动请求表格数据，等待 treeFilter 数据回来之后，更改 initParam.departmentId 的值，才会触发请求 proTable 数据
const treeFilterData = ref<any>([]);
const getTreeFilter = async () => {
  const { data } = await getMockCollectionList();
  treeFilterData.value = data;
  initParam.collectionId = treeFilterData.value[0].children[0].id;
};

// 树形筛选切换
const changeTreeFilter = (val: string) => {
  ElMessage.success(`切换项目为${val}成功`);
  proTable.value!.pageable.pageNum = 1;
  initParam.collectionId = val;
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
      if (scope.row.mockMethod === "GET") tag = <el-tag type="primary">GET</el-tag>;
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
    fieldNames: { label: "mockLabel", value: "mockStatus" }
  },
  { prop: "operation", label: "操作", width: 300, fixed: "right" }
]);

// 导入mock接口
const dialogRef = ref<InstanceType<typeof ImportExcel> | null>(null);
const batchAdd = () => {
  const params = {
    title: "用户",
    tempApi: exportUserInfo,
    importApi: BatchAddUser,
    getTableList: proTable.value?.getTableList
  };
  dialogRef.value?.acceptParams(params);
};

// 导出mock接口
const downloadFile = async () => {
  ElMessageBox.confirm("确认导出用户数据?", "温馨提示", { type: "warning" }).then(() =>
    useDownload(exportUserInfo, "用户列表", proTable.value?.searchParam)
  );
};

// 删除mock接口
const deleteMockServer = async (params: MockServer.ResMockList) => {
  await useHandleData(deleteMock, { id: [params.id] }, `删除【${params.mockDescription}】接口`);
  proTable.value?.getTableList();
};

// 表格拖拽排序
const sortTable = ({ newIndex, oldIndex }: { newIndex?: number; oldIndex?: number }) => {
  console.log(newIndex, oldIndex);
  console.log(proTable.value?.tableData);
  ElMessage.success("修改列表排序成功");
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof UserDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<User.ResUserList> = {}) => {
  const params = {
    title,
    row: { ...row },
    isView: title === "查看",
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
      font-weight: bold;
      margin-right: 10px;
    }

    .value {
      color: #333;
    }
  }
}
</style>
