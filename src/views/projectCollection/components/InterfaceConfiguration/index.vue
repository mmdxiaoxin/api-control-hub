<template>
  <el-form ref="formRef" label-position="top" class="card interface-configuration">
    <el-row :gutter="20" style="margin-bottom: 20px">
      <el-col :span="20">
        <span class="text"> {{ props.apiTitle }} </span>
      </el-col>
      <el-col :span="4" class="right-aligned">
        <el-button type="info">保存</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="4">
        <el-form-item>
          <el-select placeholder="请选择请求方法">
            <el-option label="GET" value="GET"></el-option>
            <el-option label="POST" value="POST"></el-option>
            <el-option label="DELETE" value="POST"></el-option>
            <el-option label="PUT" value="POST"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="16">
        <el-form-item>
          <el-input placeholder="请输入接口 URL" clearable>
            <template #prepend>Http://</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="4" class="right-aligned">
        <el-button type="primary">发送</el-button>
      </el-col>
    </el-row>
    <div class="interface-query card">
      <el-tabs v-model="activeQuery">
        <el-tab-pane label="Params" name="first">
          <div class="query-params">
            <el-table :data="queryParams" style="width: 100%" border>
              <el-table-column prop="name" label="参数名"> </el-table-column>
              <el-table-column prop="value" label="参数值"> </el-table-column>
              <el-table-column prop="description" label="描述"> </el-table-column>
              <el-table-column label="操作">
                <template #default="scope">
                  <el-button type="primary">修改</el-button>
                  <el-button type="danger" @click="removeQueryParam(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button @click="addQueryParam" style="width: 100%">添加参数</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Auth" name="second">
          <div class="query-params">
            <el-form-item label="类型">
              <el-select placeholder="请选择请求类型">
                <el-option label="从父级继承" value="father"></el-option>
                <el-option label="No Auth" value="noAuth"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Headers" name="third">
          <div class="query-params">
            <el-table :data="queryHeaders" style="width: 100%" border>
              <el-table-column prop="name" label="参数名"> </el-table-column>
              <el-table-column prop="value" label="参数值"> </el-table-column>
              <el-table-column prop="description" label="描述"> </el-table-column>
              <el-table-column label="操作">
                <template #default="scope">
                  <el-button type="primary">修改</el-button>
                  <el-button type="danger" @click="removeQueryHeader(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button @click="addQueryHeader" style="width: 100%">添加参数</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Body" name="fourth">
          <div class="query-params">Body</div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="interface-response card">
      <el-tabs v-model="activeResponse">
        <el-tab-pane label="Body" name="first">
          <div class="response-body">
            <div class="res-body-toolBar">
              <el-radio-group v-model="resBodyRadio" size="small">
                <el-radio-button label="Pretty" />
                <el-radio-button label="Raw" />
                <el-radio-button label="Preview" />
              </el-radio-group>
              <el-select v-model="ResSelect" size="small">
                <el-option v-for="item in ResFileOption" :key="item.value" :label="item.label" :value="item.value">
                  <span>{{ item.label }}</span>
                </el-option>
              </el-select>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Cookies" name="second"><div class="response-params">No Cookies</div></el-tab-pane>
        <el-tab-pane label="Headers" name="third">
          <div class="response-params">
            <el-table :data="resHeaders" border style="width: 100%">
              <el-table-column prop="key" label="key" />
              <el-table-column prop="value" label="Value" />
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  apiTitle: String
});

const formRef = ref(null);
const activeQuery = ref("first");
const activeResponse = ref("first");
const resBodyRadio = ref("Pretty");
const ResSelect = ref("JSON");
//响应体配置
const ResFileOption = [
  {
    value: "JSON",
    label: "JSON"
  },
  {
    value: "XML",
    label: "XML"
  },
  {
    value: "HTML",
    label: "HTML"
  },
  {
    value: "TEXT",
    label: "TEXT"
  },
  {
    value: "AUTO",
    label: "AUTO"
  }
];

//响应头配置
const resHeaders = [
  {
    key: "Date",
    value: "Thu, 14 Sep 2023 09:24:49 GMT"
  },
  {
    key: "Server",
    value: "Werkzeug/2.3.3 Python/3.9.16"
  },
  {
    key: "Content-Type",
    value: "application/json"
  },
  {
    key: "Content-Length",
    value: "Tom"
  }
];

const queryParams = ref([{ name: "param1", value: "value1", description: "描述1" }]);
const queryHeaders = ref([{ name: "header1", value: "value1", description: "描述1" }]);
const addQueryParam = () => {
  queryParams.value.push({ name: "param", value: "value", description: "描述" });
};
const addQueryHeader = () => {
  queryHeaders.value.push({ name: "header", value: "value", description: "描述" });
};
const removeQueryParam = (index: number) => {
  queryParams.value.splice(index, 1);
};
const removeQueryHeader = (index: number) => {
  queryHeaders.value.splice(index, 1);
};
// 其他的设置和事件处理函数
</script>

<style scoped lang="scss">
.interface-configuration {
  width: 100%;
  height: 100%;
  padding: 3%;

  .right-aligned {
    display: flex;
    justify-content: flex-end;
  }

  .interface-query {
    margin-top: 20px;
    max-height: 300px;
  }

  .interface-response {
    margin-top: 10px;
    height: calc(100% - 300px);

    .response-body {
      height: 100%;

      .res-body-toolBar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        flex-wrap: wrap;
      }
    }
  }
}
</style>
