<script setup lang="ts">
import { ResFileOption } from "@/views/http-client/config";
import { JsonViewer } from "vue3-json-viewer";
import "vue3-json-viewer/dist/index.css";
import { computed, PropType, ref, watch } from "vue";
import { useGlobalStore } from "@/stores/modules/global";
import { ResponseWithDetails, ResponseWithError } from "@/utils/request";

const activeResponse = ref("first");
const resBodyRadio = ref("Pretty");
const ResSelect = ref("JSON");
const globalStore = useGlobalStore();
const props = defineProps({
  httpResponse: {
    type: Object as PropType<ResponseWithDetails | ResponseWithError>,
    default: () => {
      return {
        status: 0,
        duration: 0,
        headers: {},
        data: ""
      };
    }
  }
});

const responsePanel = ref<ResponseWithDetails | ResponseWithError>(
  props.httpResponse
);

watch(
  () => props.httpResponse,
  () => {
    responsePanel.value = props.httpResponse;
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
</script>

<template>
  <div class="interface-response card">
    <!-- 响应内容、Cookies 和响应头选项卡 -->
    <el-tabs v-model="activeResponse">
      <el-tab-pane label="Body" name="first">
        <div class="response-body">
          <div class="res-body-toolBar">
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
          <div v-if="responsePanel.status === 0">
            <el-empty :image-size="70" />
          </div>
          <!-- JSON 视图，pretty -->
          <JsonViewer
            :value="responsePanel.data"
            copyable
            boxed
            sort
            :theme="globalStore.isDark ? 'dark' : 'light'"
            v-if="
              resBodyRadio === 'Pretty' &&
              ResSelect === 'JSON' &&
              responsePanel.status !== 0
            "
          />
          <!-- JSON 视图，raw -->
          <div
            class="raw-json"
            v-if="
              resBodyRadio === 'Raw' &&
              ResSelect === 'JSON' &&
              responsePanel.status !== 0
            "
          >
            {{ responsePanel.data || "" }}
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
        <span>Status:</span>
        <p>{{ responsePanel.status }}</p>
      </div>
      <div class="status-item">
        <span>Time:</span>
        <p>{{ responsePanel.duration }}</p>
      </div>
      <div class="status-item">
        <span>Size:</span>
        <p>{{ "test" }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.interface-response {
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
      flex-flow: row nowrap;
      align-items: center;
      margin-right: 10px;
      font-size: 12px;
    }
  }
  .response-body {
    height: 100%;
    .res-body-toolBar {
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      .tool-bar-select {
        max-width: 20%;
      }
    }
    .response-body-content {
      width: 99%;
      min-height: 200px;
      overflow: auto;
      border: #6b778c 1px solid;
      .string {
        color: green;
      }
      .number {
        color: darkorange;
      }
      .boolean {
        color: blue;
      }
      .null {
        color: magenta;
      }
      .key {
        color: red;
      }
    }
    .raw-json {
      white-space: pre;
    }
  }
}
</style>
