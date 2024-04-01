<script setup lang="ts">
import { ResFileOption } from "@/views/apiManagement/components/InterfaceConfiguration/common/config";
import { JsonViewer } from "vue3-json-viewer";
import "vue3-json-viewer/dist/index.css";
import { computed, ref } from "vue";
import { useGlobalStore } from "@/stores/modules/global";
import { useHttpConfigStore } from "@/stores/modules/httpConfig";

const activeResponse = ref("first");
const resBodyRadio = ref("Pretty");
const ResSelect = ref("JSON");

const globalStore = useGlobalStore();
const httpConfig = useHttpConfigStore();

//响应体响应情况
const responseStatus = computed(() => httpConfig.responseStatus);

// 响应体应该接收的数据
const responseBody = computed(() => httpConfig.responsePanel);

// 响应头应该接收的数据
const responseHeader = computed(() => {
  const header = httpConfig.responseHeaders;
  return Object.keys(header).map(key => {
    return {
      key,
      value: header[key]
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
              <el-radio-button label="Pretty" />
              <el-radio-button label="Raw" />
              <el-radio-button label="Preview" />
            </el-radio-group>
            <el-select v-model="ResSelect" size="small" v-if="resBodyRadio === 'Pretty'" class="tool-bar-select">
              <!-- 选择响应体格式 -->
              <el-option v-for="item in ResFileOption" :key="item.value" :label="item.label" :value="item.value">
                <span>{{ item.label }}</span>
              </el-option>
            </el-select>
          </div>
          <div v-if="responseStatus.status === 0">
            <el-empty :image-size="70" />
          </div>
          <!-- JSON 视图，pretty -->
          <JsonViewer
            :value="responseBody"
            copyable
            boxed
            sort
            :theme="globalStore.isDark ? 'dark' : 'light'"
            v-if="resBodyRadio === 'Pretty' && ResSelect === 'JSON' && responseStatus.status !== 0"
          />
          <!-- JSON 视图，raw -->
          <div class="raw-json" v-if="resBodyRadio === 'Raw' && ResSelect === 'JSON' && responseStatus.status !== 0">
            {{ responseBody }}
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
        <p>{{ responseStatus.status }}</p>
      </div>
      <div class="status-item">
        <span>Time:</span>
        <p>{{ responseStatus.time }}</p>
      </div>
      <div class="status-item">
        <span>Size:</span>
        <p>{{ responseStatus.size }}</p>
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
