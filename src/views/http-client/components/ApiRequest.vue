<template>
  <!-- 请求方法和接口 URL -->
  <el-form ref="formRef" :model="requestForm" :rules="rules">
    <el-row :gutter="16">
      <el-col :span="4">
        <el-form-item prop="requestMethod">
          <el-select placeholder="请选择请求方法" v-model="requestForm.requestMethod">
            <template #label="{ label, value }">
              <span :style="{ color: labelStyles[value], 'font-weight': 'bold' }">{{ label }}</span>
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
                    <QueryTable v-model:queryParams="requestForm.queryBodyFormX" />
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
  </el-form>
</template>

<script setup lang="ts">
import QueryTable from "./QueryTable.vue";
import { onMounted, PropType, ref, watch } from "vue";
import { Connection, MessageBox } from "@element-plus/icons-vue";
import { AxiosRequestConfig } from "axios";
import { ElMessage, FormInstance } from "element-plus";
import { authOptions, bodyOptions, labelStyles, methods } from "@/views/http-client/config";
import AxiosService, { RequestConfig } from "@/utils/request";
import MonacoEditor from "@/components/MonacoEditor/MonacoEditor";
import { updateHttpConfig } from "@/api/modules/http";
import { Http } from "@/api/interface";

const queryType = ref("query");
const bodyType = ref(1);

/**
 * 请求表单
 */
export interface RequestForm {
  requestMethod: string;
  apiUrl: string;
  authType: string;
  queryParams: Array<{ key: string; value: string; description: string }>;
  queryHeaders: Array<{ key: string; value: string; description: string }>;
  queryBodyForm: Array<{ key: string; value: string; description: string }>;
  queryBodyFormX: Array<{ key: string; value: string; description: string }>;
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
  },
  apiId: {
    type: String,
    required: true
  }
});

const baseUrl = ref("");
const formRef = ref<FormInstance>(null);
const rules = {
  requestMethod: [{ required: true, message: "请选择请求方法", trigger: "change" }],
  apiUrl: [{ required: true, message: "请输入接口 URL", trigger: "blur", max: 256 }]
};
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

const handleSave = async () => {
  const req: Http.ReqUpdate = {
    apiId: parseInt(props.apiId),
    requestMethod: requestForm.value.requestMethod,
    apiUrl: requestForm.value.apiUrl,
    authType: requestForm.value.authType,
    queryParams: requestForm.value.queryParams,
    queryHeaders: requestForm.value.queryHeaders,
    queryBodyForm: requestForm.value.queryBodyForm,
    queryBodyFormX: requestForm.value.queryBodyFormX,
    queryJsonBody: requestForm.value.queryJsonBody,
    queryXmlBody: requestForm.value.queryXmlBody,
    queryRawBody: requestForm.value.queryRawBody
  };
  await updateHttpConfig(req);
  emit("onSave");
  ElMessage.success("保存成功");
};

const emit = defineEmits(["onSend", "onError", "onSuccess", "onSave"]);
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
  if (bodyType.value === 1) {
    data = null;
  } else if (bodyType.value === 2 || bodyType.value === 3) {
    const formData = new FormData();
    const bodyForm = bodyType.value === 2 ? queryBodyForm : queryBodyFormX;
    bodyForm.forEach(item => {
      formData.append(item.key, item.value);
    });
    data = formData;
  } else if (bodyType.value === 4) {
    data = JSON.parse(queryJsonBody);
  } else if (bodyType.value === 5) {
    headersObj["Content-Type"] = "application/xml";
    data = queryXmlBody;
  } else if (bodyType.value === 6) {
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
    const response = await httpInstance.sendRequest(config);
    emit("onSuccess", response);
    emit("onSend", true);
    ElMessage.success("请求成功");
    console.log(response.data);
  } catch (error) {
    emit("onError", error);
    emit("onSend", false);
    ElMessage.error("请求失败");
    console.error(error);
  }
};
</script>

<style scoped lang="scss"></style>
