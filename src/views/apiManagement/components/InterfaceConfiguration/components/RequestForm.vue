<template>
  <!-- 接口标题和编辑按钮 -->
  <el-row :gutter="20" style="margin-bottom: 20px">
    <el-col :span="20">
      <span class="text"> {{ apiName }} <el-button :icon="Edit" circle size="small" /></span>
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
      <el-select placeholder="请选择请求方法" v-model="requestForm.requestMethod">
        <el-option label="GET" value="GET" :style="getOptionStyle('GET')">GET</el-option>
        <el-option label="POST" value="POST" :style="getOptionStyle('POST')">POST</el-option>
        <el-option label="DELETE" value="DELETE" :style="getOptionStyle('DELETE')">DELETE</el-option>
        <el-option label="PUT" value="PUT" :style="getOptionStyle('PUT')">PUT</el-option>
      </el-select>
    </el-col>
    <el-col :span="16">
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
              <div>{{ baseUrl }}</div>
            </template>
          </el-popover>
        </template>
      </el-input>
    </el-col>
    <el-col :span="4" class="right-aligned">
      <!-- 发送按钮 -->
      <el-button type="primary" @click="sendRequest">
        发送
        <el-icon class="el-icon--right">
          <Connection />
        </el-icon>
      </el-button>
    </el-col>
  </el-row>
  <!-- 查询参数、鉴权、请求头和请求体选项卡 -->
  <div class="interface-query card">
    <el-tabs v-model="activeQuery">
      <el-tab-pane label="Params" name="first">
        <div class="query-params">
          <!-- 查询参数 -->
          <QueryTable v-model:queryParams="requestForm.queryParams" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="Auth" name="second">
        <div class="query-params">
          <!-- 鉴权类型选择 -->
          <el-select placeholder="请选择请求类型" v-model="requestForm.authType">
            <el-option label="No Auth" value="noAuth"></el-option>
            <el-option label="从父级继承" value="father"></el-option>
          </el-select>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Headers" name="third">
        <div class="query-params">
          <!-- 请求头参数 -->
          <QueryTable v-model:queryParams="requestForm.queryHeaders" />
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
              <QueryTable v-model:queryParams="requestForm.queryBodyForm" />
            </div>
            <div v-if="queryBody === 3">
              <QueryTable v-model:queryParams="requestForm.queryBodyFormX" />
            </div>
            <div v-if="queryBody === 4">
              <el-input
                v-model="requestForm.queryJsonBody"
                :autosize="{ minRows: 6, maxRows: 10 }"
                type="textarea"
                placeholder="Please input"
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
</template>

<script setup lang="ts">
import QueryTable from "@/views/apiManagement/components/InterfaceConfiguration/components/QueryTable.vue";
import { computed, ref } from "vue";
import { Edit } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { getOptionStyle } from "@/utils/workPlace";
import { useHttpConfigStore } from "@/stores/modules/httpConfig";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { formatBytes, formatTime } from "@/utils/apiConfig";

const queryBody = ref(1);
const activeQuery = ref("first");
const httpConfig = useHttpConfigStore();

const apiName = computed(() => httpConfig.apiName);
const baseUrl = computed(() => httpConfig.baseUrl);
const requestForm = computed(() => httpConfig.requestForm);

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
    console.log(axiosConfig);
    const time = endTime - startTime;
    // 处理响应
    httpConfig.setResponsePanel(response.data);
    httpConfig.setResponseStatus({
      status: response.status,
      size: formatBytes(response.headers["content-length"]),
      time: formatTime(time)
    });
    httpConfig.setResponseHeaders(response.headers);
    console.log(response);
  } catch (error) {
    // 处理错误
    console.error(error);
  }
};
</script>

<style scoped lang="scss">
.right-aligned {
  display: flex;
  justify-content: flex-end;
}
.interface-query {
  max-height: 300px;
  margin-top: 20px;
}
</style>
