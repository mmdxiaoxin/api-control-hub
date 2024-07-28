<template>
  <!-- 请求方法和接口 URL -->
  <el-row :gutter="16">
    <el-col :span="4">
      <el-select
        placeholder="请选择请求方法"
        v-model="requestForm.requestMethod"
      >
        <el-option label="GET" value="GET" :style="getOptionStyle('GET')">
          GET
        </el-option>
        <el-option label="POST" value="POST" :style="getOptionStyle('POST')">
          POST
        </el-option>
        <el-option
          label="DELETE"
          value="DELETE"
          :style="getOptionStyle('DELETE')"
          >DELETE
        </el-option>
        <el-option label="PUT" value="PUT" :style="getOptionStyle('PUT')">
          PUT
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="16">
      <el-input
        placeholder="请输入接口 URL"
        clearable
        v-model="requestForm.apiUrl"
      >
        <template #prepend>
          <el-popover
            placement="top-start"
            title="URL前缀"
            :width="200"
            trigger="hover"
            content="可以在项目的环境设置中更改(暂不支持...)"
          >
            <template #reference>
              <div>{{ baseUrl == "" ? "前缀" : baseUrl }}</div>
            </template>
          </el-popover>
        </template>
      </el-input>
    </el-col>
    <el-col :span="2">
      <!-- 发送按钮 -->
      <el-button type="primary" @click="sendRequest" style="width: 100%">
        发送
        <el-icon class="el-icon--right">
          <Connection />
        </el-icon>
      </el-button>
    </el-col>
    <el-col :span="2">
      <el-button
        type="info"
        @click="ElMessage.success('保存成功')"
        style="width: 100%"
      >
        保存
        <el-icon class="el-icon--right">
          <MessageBox />
        </el-icon>
      </el-button>
    </el-col>
  </el-row>
  <!-- 查询参数、鉴权、请求头和请求体选项卡 -->
  <el-row :gutter="16">
    <el-col :span="24">
      <div :style="{ marginTop: '10px' }" class="card">
        <el-tabs v-model="activeQuery">
          <el-tab-pane label="Params" name="query">
            <div class="query-params">
              <!-- 查询参数 -->
              <QueryTable v-model:queryParams="requestForm.queryParams" />
            </div>
          </el-tab-pane>
          <el-tab-pane label="Auth" name="auth">
            <div class="query-params">
              <!-- 鉴权类型选择 -->
              <el-select
                placeholder="请选择请求类型"
                v-model="requestForm.authType"
              >
                <el-option label="No Auth" value="noAuth"></el-option>
                <el-option label="从父级继承" value="father"></el-option>
              </el-select>
            </div>
          </el-tab-pane>
          <el-tab-pane label="Headers" name="header">
            <div class="query-params">
              <!-- 请求头参数 -->
              <QueryTable v-model:queryParams="requestForm.queryHeaders" />
            </div>
          </el-tab-pane>
          <el-tab-pane label="Body" name="body">
            <div class="query-params">
              <el-radio-group v-model="queryBody">
                <el-radio :value="1">none</el-radio>
                <el-radio :value="2">form-data</el-radio>
                <el-radio :value="3">x-www-form-urlencoded</el-radio>
                <el-radio :value="4">json</el-radio>
                <el-radio :value="5">xml</el-radio>
                <el-radio :value="6">raw</el-radio>
              </el-radio-group>
              <!-- 根据选中的 queryBody 显示不同的内容 -->
              <div class="query-body-container">
                <div v-if="queryBody === 1">
                  <el-empty :image-size="70" />
                </div>
                <div v-if="queryBody === 2">
                  <QueryTable v-model:queryParams="requestForm.queryBodyForm" />
                </div>
                <div v-if="queryBody === 3">
                  <QueryTable
                    v-model:queryParams="requestForm.queryBodyFormX"
                  />
                </div>
                <div v-if="queryBody === 4">
                  <BodyEditor
                    :model-value="requestForm.queryJsonBody"
                    language="json"
                  />
                </div>
                <div v-if="queryBody === 5">
                  <el-input
                    v-model="requestForm.queryXmlBody"
                    :autosize="{ minRows: 6, maxRows: 10 }"
                    type="textarea"
                    placeholder="Please input"
                  />
                </div>
                <div v-if="queryBody === 6">
                  <el-input
                    v-model="requestForm.queryRawBody"
                    :autosize="{ minRows: 6, maxRows: 10 }"
                    type="textarea"
                    placeholder="Please input"
                  />
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import QueryTable from "./QueryTable.vue";
import BodyEditor from "./BodyEditor.vue";
import { onMounted, PropType, ref, watch } from "vue";
import { getOptionStyle } from "@/utils/workPlace";
import { Connection, MessageBox } from "@element-plus/icons-vue";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { ElMessage } from "element-plus";

const queryBody = ref(1);
const activeQuery = ref("query");

export interface RequestForm {
  requestMethod: string;
  apiUrl: string;
  authType: string;
  queryParams: Array<{ key: string; value: string }>;
  queryHeaders: Array<{ key: string; value: string }>;
  queryBodyForm: Array<{ key: string; value: string }>;
  queryBodyFormX: Array<{ key: string; value: string }>;
  queryJsonBody: string;
  queryXmlBody: string;
  queryRawBody: string;
}

const props = defineProps({
  initialValues: {
    type: Object as PropType<RequestForm>,
    default: () => {
      return {
        requestMethod: "GET",
        apiUrl: "",
        authType: "noAuth",
        queryParams: [],
        queryHeaders: [],
        queryBodyForm: [],
        queryBodyFormX: [],
        queryJsonBody: "",
        queryXmlBody: "",
        queryRawBody: ""
      };
    }
  }
});

const baseUrl = ref("");
const requestForm = ref<RequestForm>(props.initialValues);

onMounted(() => {
  requestForm.value = props.initialValues;
});
watch(
  () => props.initialValues,
  newVal => {
    requestForm.value = newVal;
  }
);

// 发送请求函数
const sendRequest = async () => {
  // 根据请求方法配置生成axios请求配置
  const axiosConfig: AxiosRequestConfig = {
    method: requestForm.value.requestMethod,
    url: requestForm.value.apiUrl,
    baseURL: baseUrl.value,
    // 根据请求参数配置生成params或者data
    [requestForm.value.requestMethod === "GET" ? "params" : "data"]: (() => {
      switch (queryBody.value) {
        case 1:
          return null;
        case 2:
          return requestForm.value.queryBodyForm;
        case 3:
          return requestForm.value.queryBodyFormX;
        case 4:
          return JSON.parse(requestForm.value.queryJsonBody);
        case 5:
          return requestForm.value.queryXmlBody;
        case 6:
          return requestForm.value.queryRawBody;
        default:
          return null;
      }
    })(),
    // 根据请求头参数配置生成请求头
    headers: (() => {
      return requestForm.value.queryHeaders.reduce(
        (acc, cur) => {
          acc[cur.key] = cur.value;
          return acc;
        },
        {} as Record<string, string>
      );
    })()
  };

  try {
    // 发送请求
    const startTime = new Date().getTime();
    const response: AxiosResponse = await axios(axiosConfig);
    const endTime = new Date().getTime();

    const time = endTime - startTime;
    // 处理响应
    console.log(response, time);
  } catch (error) {
    // 处理错误
    console.error(error);
  }
};
</script>

<style scoped lang="scss"></style>
