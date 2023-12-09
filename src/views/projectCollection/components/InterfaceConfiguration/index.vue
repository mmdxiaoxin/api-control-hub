<template>
  <el-form ref="formRef" label-position="top" class="card interface-configuration" :model="formData">
    <!-- 接口标题和编辑按钮 -->
    <el-row :gutter="20" style="margin-bottom: 20px">
      <el-col :span="20">
        <span class="text"> {{ apiName }} <el-button :icon="Edit" circle size="small" @click="modifyName(apiName)" /></span>
      </el-col>
      <el-col :span="4" class="right-aligned">
        <!-- 保存按钮 -->
        <el-button type="info" @click="ElMessage.success('保存成功')">
          保存
          <el-icon class="el-icon--right">
            <MessageBox />
          </el-icon>
        </el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <!-- 请求方法和接口 URL -->
      <el-col :span="4">
        <el-form-item>
          <el-select placeholder="请选择请求方法" v-model="formData.requestMethod">
            <el-option label="GET" value="GET" :style="getOptionStyle('GET')">GET</el-option>
            <el-option label="POST" value="POST" :style="getOptionStyle('POST')">POST</el-option>
            <el-option label="DELETE" value="DELETE" :style="getOptionStyle('DELETE')">DELETE</el-option>
            <el-option label="PUT" value="PUT" :style="getOptionStyle('PUT')">PUT</el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="16">
        <el-form-item>
          <el-input placeholder="请输入接口 URL" clearable v-model="formData.apiUrl">
            <template #prepend>
              <el-popover
                placement="top-start"
                title="URL前缀"
                :width="200"
                trigger="hover"
                content="可以在项目的环境设置中更改(暂不支持...)"
              >
                <template #reference>
                  <div ref="prefixRef" @click="onClickOutside">{{ urlPrefix }}</div>
                </template>
              </el-popover>
            </template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="4" class="right-aligned">
        <!-- 发送按钮 -->
        <el-button type="primary" @click="sendApiForm">
          发送
          <el-icon class="el-icon--right">
            <Connection />
          </el-icon>
        </el-button>
      </el-col>
    </el-row>
    <div class="interface-query card">
      <!-- 查询参数、鉴权、请求头和请求体选项卡 -->
      <el-tabs v-model="activeQuery">
        <el-tab-pane label="Params" name="first">
          <div class="query-params">
            <!-- 查询参数 -->
            <el-form-item>
              <QueryTable v-model:queryParams="formData.queryParams" />
            </el-form-item>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Auth" name="second">
          <div class="query-params">
            <!-- 鉴权类型选择 -->
            <el-form-item label="类型">
              <el-select placeholder="请选择请求类型" v-model="formData.authType">
                <el-option label="No Auth" value="noAuth"></el-option>
                <el-option label="从父级继承" value="father"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Headers" name="third">
          <div class="query-params">
            <el-form-item>
              <!-- 请求头参数 -->
              <QueryTable v-model:queryParams="formData.queryHeaders" />
            </el-form-item>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Body" name="fourth">
          <div class="query-params">
            <el-radio-group v-model="queryBody">
              <el-radio :label="1">none</el-radio>
              <el-radio :label="2">form-data</el-radio>
              <el-radio :label="3">x-www-form-urlencoded</el-radio>
              <el-radio :label="4">json</el-radio>
              <el-radio :label="5">xml</el-radio>
              <el-radio :label="6">raw</el-radio>
            </el-radio-group>
            <!-- 根据选中的 queryBody 显示不同的内容 -->
            <div class="query-body-container">
              <div v-if="queryBody === 1">
                <el-empty :image-size="70" />
              </div>
              <div v-if="queryBody === 2">
                <el-form-item>
                  <QueryTable v-model:queryParams="formData.queryBodyForm" />
                </el-form-item>
              </div>
              <div v-if="queryBody === 3">
                <el-form-item>
                  <QueryTable v-model:queryParams="formData.queryBodyFormX" />
                </el-form-item>
              </div>
              <div v-if="queryBody === 4">
                <el-form-item>
                  <el-input
                    v-model="formData.queryJsonBody"
                    :autosize="{ minRows: 6, maxRows: 10 }"
                    type="textarea"
                    placeholder="Please input"
                  />
                </el-form-item>
              </div>
              <div v-if="queryBody === 5">
                <el-form-item>
                  <el-input
                    v-model="formData.queryXmlBody"
                    :autosize="{ minRows: 6, maxRows: 10 }"
                    type="textarea"
                    placeholder="Please input"
                  />
                </el-form-item>
              </div>
              <div v-if="queryBody === 6">
                <el-form-item>
                  <el-input
                    v-model="formData.queryRawBody"
                    :autosize="{ minRows: 6, maxRows: 10 }"
                    type="textarea"
                    placeholder="Please input"
                  />
                </el-form-item>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="interface-response card">
      <!-- 响应内容、Cookies 和响应头选项卡 -->
      <el-tabs v-model="activeResponse">
        <el-tab-pane label="Body" name="first">
          <div class="response-body">
            <div class="res-body-toolBar">
              <el-radio-group v-model="resBodyRadio" size="small">
                <el-radio-button label="Pretty" />
                <el-radio-button label="Raw" />
                <el-radio-button label="Preview" />
              </el-radio-group>
              <el-select v-model="ResSelect" size="small" v-if="resBodyRadio === 'Pretty'">
                <!-- 选择响应体格式 -->
                <el-option v-for="item in ResFileOption" :key="item.value" :label="item.label" :value="item.value">
                  <span>{{ item.label }}</span>
                </el-option>
              </el-select>
            </div>
            <div v-if="isResponseBodyEmpty(responseBody)">
              <el-empty :image-size="70" />
            </div>
            <!-- JSON 视图，pretty -->
            <JsonViewer
              :value="responseBody"
              copyable
              boxed
              sort
              :theme="globalStore.isDark ? 'dark' : 'light'"
              v-if="resBodyRadio === 'Pretty' && ResSelect === 'JSON' && !isResponseBodyEmpty(responseBody)"
            />
            <!-- JSON 视图，raw -->
            <div class="raw-json" v-if="resBodyRadio === 'Raw' && ResSelect === 'JSON' && !isResponseBodyEmpty(responseBody)">
              {{ responseBody }}
            </div>
            <!-- 非 JSON 格式的提示 -->
            <div v-if="ResSelect !== 'JSON' && !isResponseBodyEmpty(responseBody)">
              <p>暂不支持！</p>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Cookies" name="second">
          <div class="response-params">No Cookies</div>
        </el-tab-pane>
        <el-tab-pane label="Headers" name="third">
          <div class="response-params">
            <!-- 响应头参数 -->
            <el-table :data="responseHeader" border style="width: 100%">
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
import { onMounted, reactive, ref, unref, watch } from "vue";
import { JsonViewer } from "vue3-json-viewer";
import "vue3-json-viewer/dist/index.css";
import QueryTable from "./QueryTable.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Edit } from "@element-plus/icons-vue";
import { useGlobalStore } from "@/stores/modules/global";
import { getOptionStyle } from "@/utils/workPlace";
import axios, { AxiosError, AxiosResponse } from "axios";
import { getHttpConfig } from "@/api/modules/httpServer";

const props = defineProps({
  apiTitle: String,
  apiId: String
});
console.log(props.apiId);

interface QueryParam {
  key: string;
  value: string;
  description: string;
}

interface QueryHeader {
  key: string;
  value: string;
  description: string;
}

interface QueryBodyForm {
  key: string;
  value: string;
  description: string;
}

interface QueryBodyFormX {
  key: string;
  value: string;
  description: string;
}

interface FormData {
  requestMethod: string;
  apiUrl: string;
  authType: string;
  queryParams: QueryParam[];
  queryHeaders: QueryHeader[];
  queryBodyForm: QueryBodyForm[];
  queryBodyFormX: QueryBodyFormX[];
  queryJsonBody: string;
  queryXmlBody: string;
  queryRawBody: string;
}

const globalStore = useGlobalStore();

const apiName = ref("");
const urlPrefix = ref("http://");
const formRef = ref(null);
const formData = reactive<FormData>({
  requestMethod: "GET",
  apiUrl: "",
  authType: "noAuth",
  queryJsonBody: "",
  queryBodyForm: [],
  queryBodyFormX: [],
  queryHeaders: [],
  queryParams: [],
  queryXmlBody: "",
  queryRawBody: ""
});

const responseBody = reactive({
  message: "",
  code: 0,
  data: null
  // Add other properties as needed
});
const responseHeader = reactive([
  // Define properties for response headers
  // Example:
  { key: "Date", value: "" },
  { key: "Server", value: "" },
  { key: "Content-Type", value: "" },
  { key: "Content-Length", value: "" }
  // Add other headers as needed
]);

//检查响应体是否为空
const isResponseBodyEmpty = (responseBody: any) => {
  return responseBody.code === 0;
};

//tab及selector选项配置
const queryBody = ref(1);
const activeQuery = ref("first");
const activeResponse = ref("first");
const resBodyRadio = ref("Pretty");
const ResSelect = ref("JSON");

// 响应体格式化显示配置
const ResFileOption = [
  { value: "JSON", label: "JSON" },
  { value: "XML", label: "XML" },
  { value: "HTML", label: "HTML" },
  { value: "TEXT", label: "TEXT" },
  { value: "AUTO", label: "AUTO" }
];
// 其他的设置和事件处理函数
const modifyName = (project: any) => {
  ElMessageBox.prompt("请输入要修改的接口名称", "修改名称", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    inputPattern: /\S/, // 验证规则，确保非空
    inputErrorMessage: "接口名称不能为空" // 错误信息
  })
    .then(({ value }) => {
      apiName.value = value;
      //TODO:连接后端项目修改
      console.log(`Modifying name for directory ${project}`);
      ElMessage({
        type: "success",
        message: `修改成功:${value}`
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消输入"
      });
    });
};

//接口测试部分
const parseParams = (params: QueryParam[]) => {
  const parsedParams: { [key: string]: string } = {};
  params.forEach(param => {
    parsedParams[param.key] = param.value;
  });
  return parsedParams;
};

const parseHeaders = (headers: QueryHeader[]) => {
  const parsedHeaders: { [key: string]: string } = {};
  headers.forEach(header => {
    parsedHeaders[header.key] = header.value;
  });
  return parsedHeaders;
};

const parseRequestBody = (formData: FormData) => {
  switch (formData.requestMethod) {
    case "POST":
    case "PUT":
      if (formData.queryJsonBody) {
        return JSON.parse(formData.queryJsonBody);
      } else if (formData.queryXmlBody) {
        // 解析 XML 的逻辑
        return formData.queryXmlBody;
      } else {
        // 处理其他请求体类型
        return formData.queryRawBody;
      }
    default:
      return null;
  }
};

const sendApiForm = async () => {
  try {
    const response: AxiosResponse<any> = await axios({
      method: formData.requestMethod,
      url: formData.apiUrl,
      headers: parseHeaders(formData.queryHeaders),
      params: parseParams(formData.queryParams),
      data: parseRequestBody(formData)
    });

    // 处理响应，例如显示在界面上
    console.log(response.data);

    // 将 response.data 赋值给 responseBody 对象
    Object.assign(responseBody, {
      message: response.data.message || "",
      code: response.data.code || 0,
      data: response.data.data || null
      // Add other properties as needed
    });

    // 将 response.headers 赋值给 responseHeader 对象
    responseHeader.forEach(header => {
      header.value = response.headers[header.key.toLowerCase()] || "";
    });
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const axiosError: AxiosError = error;

      if (axiosError.response) {
        Object.assign(responseBody, {
          message: axiosError.response.statusText || "",
          code: axiosError.response.status,
          data: axiosError.response.data || null
        });

        // Update response headers for error case
        responseHeader.forEach(header => {
          header.value = axiosError.response.headers[header.key.toLowerCase()] || "";
        });
      } else if (axiosError.request) {
        // The request was made, but no response was received
        ElMessage.error("Request:" + axiosError.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        ElMessage.error("Error message:" + axiosError.message);
      }
    } else {
      // This block will be executed if the error is not an AxiosError
      ElMessage.error(error);
    }
  }
};
const prefixRef = ref();
const popoverRef = ref();
const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.();
};

const useHttpApiConfig = async (reqApiId: string) => {
  try {
    const { data } = await getHttpConfig({ apiId: reqApiId });
    const resFormData = data;
    if (resFormData) {
      apiName.value = data.name;
      formData.requestMethod = resFormData.requestMethod;
      formData.apiUrl = resFormData.apiUrl;
      formData.authType = resFormData.authType;
      formData.queryParams = resFormData.queryParams;
      formData.queryHeaders = resFormData.queryHeaders;
      formData.queryBodyForm = resFormData.queryBodyForm;
      formData.queryBodyFormX = resFormData.queryBodyFormX;
      formData.queryJsonBody = resFormData.queryJsonBody;
      formData.queryXmlBody = resFormData.queryXmlBody;
      formData.queryRawBody = resFormData.queryRawBody;
    } else {
      formData.requestMethod = "GET";
      formData.apiUrl = "";
      formData.authType = "noAuth";
      formData.queryParams = [];
      formData.queryHeaders = [];
      formData.queryBodyForm = [];
      formData.queryBodyFormX = [];
      formData.queryJsonBody = "";
      formData.queryXmlBody = "";
      formData.queryRawBody = "";
    }
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  apiName.value = props.apiTitle as string;
  useHttpApiConfig(props.apiId as string);
});

watch(
  () => props.apiId,
  newVal => {
    useHttpApiConfig(typeof newVal === "string" ? newVal : "");
  }
);
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
