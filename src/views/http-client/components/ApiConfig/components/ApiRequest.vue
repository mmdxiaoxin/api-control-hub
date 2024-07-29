<template>
  <!-- 请求方法和接口 URL -->
  <el-row :gutter="16">
    <el-col :span="4">
      <el-select
        placeholder="请选择请求方法"
        v-model="requestForm.requestMethod"
      >
        <el-option
          v-for="option in requestMethodOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value"
          :style="getOptionStyle(option.value)"
        >
          {{ option.label }}
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
        <el-tabs v-model="queryType">
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
              <el-radio-group v-model="bodyType">
                <el-radio
                  v-for="(option, index) in bodyOptions"
                  :key="index"
                  :value="option.value"
                >
                  {{ option.label }}
                </el-radio>
              </el-radio-group>
              <!-- 根据选中的 queryBody 显示不同的内容 -->
              <div class="query-body-container">
                <div v-if="bodyType === 1">
                  <el-empty :image-size="70" />
                </div>
                <div v-if="bodyType === 2">
                  <QueryTable v-model:queryParams="requestForm.queryBodyForm" />
                </div>
                <div v-if="bodyType === 3">
                  <QueryTable
                    v-model:queryParams="requestForm.queryBodyFormX"
                  />
                </div>
                <div v-if="bodyType === 4">
                  <MonacoEditor
                    language="json"
                    v-model:value="requestForm.queryJsonBody"
                    style="height: 250px"
                  />
                </div>
                <div v-if="bodyType === 5">
                  <el-input
                    v-model="requestForm.queryXmlBody"
                    :autosize="{ minRows: 6, maxRows: 10 }"
                    type="textarea"
                    placeholder="Please input"
                  />
                </div>
                <div v-if="bodyType === 6">
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
import { onMounted, PropType, ref, watch } from "vue";
import { getOptionStyle } from "@/utils/workPlace";
import { Connection, MessageBox } from "@element-plus/icons-vue";
import { AxiosRequestConfig } from "axios";
import { ElMessage } from "element-plus";
import {
  bodyOptions,
  requestMethodOptions
} from "@/views/http-client/components/ApiConfig/config";
import AxiosService from "@/views/http-client/components/ApiConfig/request";
import MonacoEditor from "@/components/MonacoEditor/MonacoEditor";

const queryType = ref("query");
const bodyType = ref(1);

/**
 * 请求表单
 */
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
const httpInstance = new AxiosService(baseUrl.value);
onMounted(() => {
  requestForm.value = props.initialValues;
});
watch(
  () => props.initialValues,
  newVal => {
    requestForm.value = newVal;
  }
);

/**
 * 发送请求
 */

const emit = defineEmits(["onSend"]);

const getRequestData = (method: string, bodyType: number) => {
  if (method === "GET") {
    return { params: requestForm.value.queryParams };
  }
  switch (bodyType) {
    case 1:
      return null;
    case 2:
      return { data: requestForm.value.queryBodyForm };
    case 3:
      return { data: requestForm.value.queryBodyFormX };
    case 4:
      return { data: JSON.parse(requestForm.value.queryJsonBody) };
    case 5:
      return { data: requestForm.value.queryXmlBody };
    case 6:
      return { data: requestForm.value.queryRawBody };
    default:
      return null;
  }
};

const getRequestHeaders = () => {
  return requestForm.value.queryHeaders.reduce(
    (acc, cur) => {
      acc[cur.key] = cur.value;
      return acc;
    },
    {} as Record<string, string>
  );
};

const sendRequest = async () => {
  const axiosConfig: AxiosRequestConfig = {
    method: requestForm.value.requestMethod,
    url: requestForm.value.apiUrl,
    baseURL: baseUrl.value,
    ...getRequestData(requestForm.value.requestMethod, bodyType.value),
    headers: getRequestHeaders()
  };

  try {
    const response = await httpInstance.sendRequest(axiosConfig);
    emit("onSend", response);
    console.log(response);
  } catch (error) {
    console.error(error);
    emit("onSend", error);
  }
};
</script>

<style scoped lang="scss"></style>
