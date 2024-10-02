<template>
  <div class="card http-config">
    <!-- HTTP header  -->
    <el-row :gutter="20" style="margin-bottom: 20px">
      <el-col :span="20">
        <span class="text">
          {{ title }}
          <el-button :icon="Edit" circle size="small" />
        </span>
      </el-col>
    </el-row>
    <!-- HTTP Request -->
    <el-form ref="formRef" :model="requestForm" :rules="rules">
      <el-row :gutter="16">
        <el-col :span="4">
          <el-form-item prop="requestMethod">
            <el-select placeholder="请选择请求方法" v-model="requestForm.requestMethod">
              <template #label="{ label, value }">
                <span :style="{ color: labelStyles[value], 'font-weight': 'bold' }">{{
                  label
                }}</span>
              </template>
              <el-option
                v-for="option in methods"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              >
                <span :style="{ color: option.color }">{{ option.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item prop="apiUrl">
            <el-input placeholder="请输入接口 URL" clearable v-model="requestForm.apiUrl">
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
          </el-form-item>
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
          <el-button type="info" @click="handleSave" style="width: 100%">
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
            <el-tabs v-model="configType">
              <el-tab-pane label="Params" :name="ConfigType.Query">
                <div class="query-params">
                  <!-- 查询参数 -->
                  <QueryTable v-model:queryParams="requestForm.queryParams" />
                </div>
              </el-tab-pane>
              <el-tab-pane label="Auth" :name="ConfigType.Auth">
                <div class="query-params">
                  <!-- 鉴权类型选择 -->
                  <el-select placeholder="请选择请求类型" v-model="requestForm.authType">
                    <el-option
                      v-for="(item, index) in authOptions"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </div>
              </el-tab-pane>
              <el-tab-pane label="Headers" :name="ConfigType.Header">
                <div class="query-params">
                  <!-- 请求头参数 -->
                  <QueryTable v-model:queryParams="requestForm.queryHeaders" />
                </div>
              </el-tab-pane>
              <el-tab-pane label="Body" :name="ConfigType.Body">
                <div class="query-params">
                  <el-radio-group v-model="configBody">
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
                    <div v-if="configBody === BodyType.None">
                      <el-empty :image-size="70" />
                    </div>
                    <div v-if="configBody === BodyType.Form">
                      <QueryTable v-model:queryParams="requestForm.queryBodyForm" />
                    </div>
                    <div v-if="configBody === BodyType.FormX">
                      <QueryTable v-model:queryParams="requestForm.queryBodyFormX" />
                    </div>
                    <div v-if="configBody === BodyType.Json">
                      <MonacoEditor
                        language="json"
                        v-model:value="requestForm.queryJsonBody"
                        style="height: 250px"
                      />
                    </div>
                    <div v-if="configBody === BodyType.Xml">
                      <el-input
                        v-model="requestForm.queryXmlBody"
                        :autosize="{ minRows: 6, maxRows: 10 }"
                        type="textarea"
                        placeholder="Please input"
                      />
                    </div>
                    <div v-if="configBody === BodyType.Raw">
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
    </el-form>
    <!-- HTTP Response -->
    <div class="response card">
      <!-- 响应内容、Cookies 和响应头选项卡 -->
      <el-tabs v-model="configResp">
        <el-tab-pane label="Body" :name="ConfigType.Body">
          <div class="body">
            <div class="toolBar">
              <el-radio-group v-model="resBodyRadio" size="small">
                <el-radio-button value="Pretty">Pretty</el-radio-button>
                <el-radio-button value="Raw">Raw</el-radio-button>
                <el-radio-button value="Preview">Preview</el-radio-button>
              </el-radio-group>
              <el-select
                v-model="ResSelect"
                size="small"
                v-if="resBodyRadio === 'Pretty'"
                class="select"
              >
                <!-- 选择响应体格式 -->
                <el-option
                  v-for="item in ResFileOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                  <span>{{ item.label }}</span>
                </el-option>
              </el-select>
            </div>
            <div v-if="httpResp.status === 0 || !httpStatus">
              <el-empty :image-size="70" />
            </div>
            <!-- JSON 视图，pretty -->
            <JsonViewer
              style="min-height: calc(100vh - 700px)"
              :value="httpResp.data"
              copyable
              boxed
              sort
              :theme="globalStore.isDark ? 'dark' : 'light'"
              v-if="
                resBodyRadio === 'Pretty' &&
                ResSelect === 'JSON' &&
                httpResp.status !== 0 &&
                httpStatus
              "
            />
            <!-- JSON 视图，raw -->
            <div
              class="raw-json"
              v-if="
                resBodyRadio === 'Raw' &&
                ResSelect === 'JSON' &&
                httpResp.status !== 0 &&
                httpStatus
              "
            >
              {{ httpResp.data || "" }}
            </div>
            <!-- 非 JSON 格式的提示 -->
            <div v-if="ResSelect !== 'JSON'">
              <p>暂不支持！</p>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Cookies" :name="ConfigType.Cookie">
          <div class="response-params">No Cookies</div>
        </el-tab-pane>
        <el-tab-pane label="Headers" :name="ConfigType.Header">
          <div class="response-params">
            <!-- 响应头参数 -->
            <el-table :data="responseHeader" border style="width: 100%">
              <el-table-column prop="key" label="key" />
              <el-table-column prop="value" label="Value" />
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="status">
        <div class="item">
          <span class="label">Status:</span>
          <span class="value">
            {{ httpStatus ? httpResp.status : httpErr.response?.status }}
          </span>
        </div>
        <div class="item">
          <span class="label">Time:</span>
          <span class="value">
            {{ httpStatus ? httpResp.duration : httpErr.duration }}
            ms
          </span>
        </div>
        <el-tooltip :effect="toolTipTheme" placement="top-start" :open-delay="500">
          <template #content>
            <div v-if="httpStatus" class="tooltip-content">
              <div class="tooltip-section">
                <h3 class="tooltip-title">Response Size</h3>
                <p class="tooltip-item">
                  Body: <span>{{ responseBodySize }}</span>
                </p>
                <p class="tooltip-item">
                  Headers: <span>{{ responseHeadersSize }}</span>
                </p>
              </div>
              <el-divider />
              <div class="tooltip-section">
                <h3 class="tooltip-title">Request Size</h3>
                <p class="tooltip-item">
                  Body: <span>{{ requestBodySize }}</span>
                </p>
                <p class="tooltip-item">
                  Headers: <span>{{ requestHeadersSize }}</span>
                </p>
              </div>
            </div>
            <div v-else class="tooltip-content">
              <h3 class="tooltip-title">Error</h3>
              <el-divider />
              <p class="tooltip-item">{{ httpErr.message }}</p>
            </div>
          </template>
          <div class="item">
            <span class="label">Size:</span>
            <span class="value">{{ httpStatus ? responseSize : "Error" }}</span>
          </div>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { getHttpConfigApi, updateHttpConfig } from "@/api/modules/http";
import AxiosService, {
  RequestConfig,
  ResponseWithDetails,
  ResponseWithError
} from "@/utils/request";
import { Connection, Edit, MessageBox } from "@element-plus/icons-vue";
import {
  authOptions,
  bodyOptions,
  labelStyles,
  methods,
  ResFileOption
} from "@/views/http-client/config";
import MonacoEditor from "@/components/MonacoEditor/MonacoEditor";
import QueryTable from "@/views/http-client/components/QueryTable.vue";
import { ElMessage, FormInstance } from "element-plus";
import { Http } from "@/api/interface";
import { AxiosRequestConfig } from "axios";
import { RequestForm } from "@/views/http-client/components/types";
import { useGlobalStore } from "@/stores/modules/global";
import { formatBytes } from "@/utils/apiConfig";
import { JsonViewer } from "vue3-json-viewer";
import "vue3-json-viewer/dist/index.css";

const props = defineProps({
  itemId: {
    type: String,
    required: true
  }
});

// ============================= HTTP Header =============================
const title = ref<string>();

// ============================= HTTP Request =============================

enum ConfigType {
  Query = "query",
  Auth = "auth",
  Header = "header",
  Body = "body",
  Cookie = "cookie"
}

enum BodyType {
  None = 1,
  Form = 2,
  FormX = 3,
  Json = 4,
  Xml = 5,
  Raw = 6
}

const configType = ref(ConfigType.Query);
const configBody = ref(BodyType.None);
const baseUrl = ref("");
const formRef = ref<FormInstance>(null);
const rules = {
  requestMethod: [{ required: true, message: "请选择请求方法", trigger: "change" }],
  apiUrl: [{ required: true, message: "请输入接口 URL", trigger: "blur", max: 256 }]
};
const requestForm = ref<RequestForm>({
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
});

const handleSave = async () => {
  const req: Http.ReqUpdate = {
    apiId: parseInt(props.itemId),
    ...requestForm.value
  };
  const res = await updateHttpConfig(req);
  if (res.code === 200) {
    ElMessage.success("保存成功");
  } else {
    ElMessage.error("保存失败");
  }
};

const sendRequest = async () => {
  if (formRef.value) {
    try {
      await formRef.value.validate();
    } catch (error) {
      return;
    }
  }
  const {
    requestMethod,
    apiUrl,
    authType,
    queryParams,
    queryHeaders,
    queryBodyForm,
    queryBodyFormX,
    queryJsonBody,
    queryXmlBody,
    queryRawBody
  } = requestForm.value;

  // 将 queryParams 转换为对象
  const queryParamsObj = queryParams.reduce((obj, item) => {
    obj[item.key] = item.value;
    return obj;
  }, {});

  // 将 queryHeaders 转换为对象
  const headersObj = queryHeaders.reduce((obj, item) => {
    obj[item.key] = item.value;
    return obj;
  }, {});

  // 根据 bodyType 设置请求体
  let data;
  if (configBody.value === 1) {
    data = null;
  } else if (configBody.value === 2 || configBody.value === 3) {
    const formData = new FormData();
    const bodyForm = configBody.value === 2 ? queryBodyForm : queryBodyFormX;
    bodyForm.forEach(item => {
      formData.append(item.key, item.value);
    });
    data = formData;
  } else if (configBody.value === 4) {
    data = JSON.parse(queryJsonBody);
  } else if (configBody.value === 5) {
    headersObj["Content-Type"] = "application/xml";
    data = queryXmlBody;
  } else if (configBody.value === 6) {
    data = queryRawBody;
  }

  // 创建请求配置
  const config: RequestConfig = {
    method: requestMethod as AxiosRequestConfig["method"],
    url: apiUrl,
    params: queryParamsObj,
    headers: headersObj,
    data,
    authType
  };

  try {
    const httpInstance = new AxiosService(baseUrl.value);
    httpResp.value = await httpInstance.sendRequest(config);
    httpStatus.value = true;
    ElMessage.success("请求成功");
  } catch (error) {
    httpErr.value = error;
    httpStatus.value = false;
    ElMessage.error("请求失败");
  }
};

// ============================= HTTP Response =============================

const httpStatus = ref<boolean>(true);
const httpResp = ref<ResponseWithDetails>({
  status: 0,
  duration: 0,
  responseBodySize: 0,
  responseHeadersSize: 0,
  requestBodySize: 0,
  requestHeadersSize: 0
});
const httpErr = ref<ResponseWithError>({
  status: 0,
  duration: 0,
  requestBodySize: 0,
  requestHeadersSize: 0
});

const configResp = ref(ConfigType.Body);
const resBodyRadio = ref("Pretty");
const ResSelect = ref("JSON");
const globalStore = useGlobalStore();

const requestBodySize = computed(() => formatBytes(httpResp.value.requestBodySize));
const requestHeadersSize = computed(() => formatBytes(httpResp.value.requestHeadersSize));
const responseSize = computed(() =>
  formatBytes(httpResp.value.responseBodySize + httpResp.value.responseHeadersSize)
);
const responseBodySize = computed(() => formatBytes(httpResp.value.responseBodySize));
const responseHeadersSize = computed(() => formatBytes(httpResp.value.responseHeadersSize));
const responseHeader = computed(() => {
  const headers = httpResp.value.headers || {};
  return Object.keys(headers).map(key => {
    return {
      key,
      value: headers[key]
    };
  });
});
const toolTipTheme = computed(() => {
  return globalStore.isDark ? "dark" : "light";
});

// ============================= INIT =============================

async function init(apiId: string) {
  const { data } = await getHttpConfigApi({ apiId });
  const { name, ...rest } = data;
  title.value = name;
  requestForm.value = rest;
  httpStatus.value = true;
  httpResp.value = {
    status: 0,
    duration: 0,
    responseBodySize: 0,
    responseHeadersSize: 0,
    requestBodySize: 0,
    requestHeadersSize: 0
  };
  httpErr.value = {
    status: 0,
    duration: 0,
    requestBodySize: 0,
    requestHeadersSize: 0
  };
}

onMounted(() => {
  init(props.itemId);
});
watch(
  () => props.itemId,
  () => {
    init(props.itemId);
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
.http-config {
  width: calc(100% - 260px);
  height: 100%;
  padding: 3%;
  .response {
    position: relative;
    margin-top: 10px;
    .status {
      position: absolute;
      top: 20px;
      right: 10px;
      display: flex;
      .item {
        display: flex;
        align-items: center;
        margin-right: 15px;
        font-size: 14px;
        color: var(--el-text-color-regular);
        .label {
          margin-right: 5px;
          font-weight: bold;
        }
        .value {
          color: var(--el-text-color-regular);
        }
      }
    }
    .body {
      height: 100%;
      .toolBar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
        .select {
          max-width: 20%;
        }
      }
      .raw-json {
        white-space: pre;
      }
    }
  }
  .tooltip-content {
    font-family: "Noto Sans SC", "思源黑体", sans-serif;
    background-color: var(--el-popper-bg-color);
    .tooltip-section {
      margin-bottom: 10px;
      .tooltip-title {
        margin-bottom: 5px;
        font-size: 16px;
        font-weight: bold;
        color: var(--el-text-color-primary);
      }
      .tooltip-item {
        margin: 0;
        font-size: 14px;
        color: var(--el-text-color-regular);
        span {
          font-weight: bold;
          color: var(--el-text-color-regular);
        }
      }
    }
  }
}
</style>
