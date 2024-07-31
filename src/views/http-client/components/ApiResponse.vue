<script setup lang="ts">
import { ResFileOption } from "@/views/http-client/config";
import { JsonViewer } from "vue3-json-viewer";
import "vue3-json-viewer/dist/index.css";
import { computed, PropType, ref, watch } from "vue";
import { useGlobalStore } from "@/stores/modules/global";
import { ResponseWithDetails, ResponseWithError } from "@/utils/request";
import { formatBytes } from "@/utils/apiConfig";

const activeResponse = ref("first");
const resBodyRadio = ref("Pretty");
const ResSelect = ref("JSON");
const globalStore = useGlobalStore();
const props = defineProps({
  httpResponse: {
    type: Object as PropType<ResponseWithDetails>,
    default: () => {
      return {
        status: 0,
        duration: 0,
        responseBodySize: 0,
        responseHeadersSize: 0,
        requestBodySize: 0,
        requestHeadersSize: 0
      };
    }
  },
  httpError: {
    type: Object as PropType<ResponseWithError>,
    default: () => {
      return {
        status: 0,
        duration: 0,
        requestBodySize: 0,
        requestHeadersSize: 0
      };
    }
  },
  httpStatus: {
    type: Boolean,
    default: true
  }
});

const responseSuccess = ref<ResponseWithDetails>(props.httpResponse);
const responseError = ref<ResponseWithError>(props.httpError);
const requestBodySize = computed(() => {
  return formatBytes(responseSuccess.value.requestBodySize);
});
const requestHeadersSize = computed(() => {
  return formatBytes(responseSuccess.value.requestHeadersSize);
});
const responseSize = computed(() => {
  return formatBytes(
    responseSuccess.value.responseBodySize +
      responseSuccess.value.responseHeadersSize
  );
});
const responseBodySize = computed(() => {
  return formatBytes(responseSuccess.value.responseBodySize);
});
const responseHeadersSize = computed(() => {
  return formatBytes(responseSuccess.value.responseHeadersSize);
});
watch(
  () => props.httpResponse,
  () => {
    responseSuccess.value = props.httpResponse;
  }
);
watch(
  () => props.httpError,
  () => {
    responseError.value = props.httpError;
  }
);
watch(
  () => props.httpStatus,
  () => {
    if (props.httpStatus) {
      activeResponse.value = "first";
    }
  }
);

// 响应头应该接收的数据
const responseHeader = computed(() => {
  const headers = props.httpResponse.headers || {};
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
</script>

<template>
  <div class="response card">
    <!-- 响应内容、Cookies 和响应头选项卡 -->
    <el-tabs v-model="activeResponse">
      <el-tab-pane label="Body" name="first">
        <div class="response-body">
          <div class="body-toolBar">
            <el-radio-group v-model="resBodyRadio" size="small">
              <el-radio-button value="Pretty">Pretty</el-radio-button>
              <el-radio-button value="Raw">Raw</el-radio-button>
              <el-radio-button value="Preview">Preview</el-radio-button>
            </el-radio-group>
            <el-select
              v-model="ResSelect"
              size="small"
              v-if="resBodyRadio === 'Pretty'"
              class="tool-bar-select"
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
          <div v-if="responseSuccess.status === 0 || !httpStatus">
            <el-empty :image-size="70" />
          </div>
          <!-- JSON 视图，pretty -->
          <JsonViewer
            :value="responseSuccess.data"
            copyable
            boxed
            sort
            :theme="globalStore.isDark ? 'dark' : 'light'"
            v-if="
              resBodyRadio === 'Pretty' &&
              ResSelect === 'JSON' &&
              responseSuccess.status !== 0 &&
              httpStatus
            "
          />
          <!-- JSON 视图，raw -->
          <div
            class="raw-json"
            v-if="
              resBodyRadio === 'Raw' &&
              ResSelect === 'JSON' &&
              responseSuccess.status !== 0 &&
              httpStatus
            "
          >
            {{ responseSuccess.data || "" }}
          </div>
          <!-- 非 JSON 格式的提示 -->
          <div v-if="ResSelect !== 'JSON'">
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
    <div class="response-status">
      <div class="status-item">
        <span class="status-label">Status:</span>
        <span class="status-value">
          {{
            httpStatus ? responseSuccess.status : responseError.response?.status
          }}
        </span>
      </div>
      <div class="status-item">
        <span class="status-label">Time:</span>
        <span class="status-value">
          {{ httpStatus ? responseSuccess.duration : responseError.duration }}
          ms
        </span>
      </div>
      <el-tooltip
        :effect="toolTipTheme"
        placement="top-start"
        :open-delay="500"
      >
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
            <p class="tooltip-item">{{ responseError.message }}</p>
          </div>
        </template>
        <div class="status-item">
          <span class="status-label">Size:</span>
          <span class="status-value">{{
            httpStatus ? responseSize : "Error"
          }}</span>
        </div>
      </el-tooltip>
    </div>
  </div>
</template>

<style scoped lang="scss">
.response {
  position: relative;
  height: calc(100% - 300px);
  margin-top: 10px;
  .response-status {
    position: absolute;
    top: 20px;
    right: 10px;
    display: flex;
    .status-item {
      display: flex;
      align-items: center;
      margin-right: 15px;
      font-size: 14px;
      color: var(--el-text-color-regular);
      .status-label {
        margin-right: 5px;
        font-weight: bold;
      }
      .status-value {
        color: var(--el-text-color-regular);
      }
    }
  }
  .response-body {
    height: 100%;
    .body-toolBar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      .tool-bar-select {
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
</style>
