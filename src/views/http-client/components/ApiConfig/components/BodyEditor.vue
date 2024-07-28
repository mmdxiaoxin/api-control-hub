<template>
  <div ref="editorRef" style="width: 100%; height: 400px"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import * as monaco from "monaco-editor";
import { useGlobalStore } from "@/stores/modules/global";

const props = defineProps<{
  language: "json" | "xml";
  modelValue: string;
}>();

const emits = defineEmits(["update:modelValue"]);
const globalStore = useGlobalStore();
const editorRef = ref<HTMLDivElement | null>(null);
let editorInstance: monaco.editor.IStandaloneCodeEditor | null = null;

const initializeEditor = () => {
  if (editorRef.value) {
    editorInstance = monaco.editor.create(editorRef.value, {
      value: props.modelValue,
      language: props.language,
      theme: globalStore.isDark ? "vs-dark" : "vs",
      automaticLayout: true,
      formatOnPaste: true,
      formatOnType: true,
      tabSize: 2
    });

    if (props.language === "json") {
      // 配置 JSON 语言的验证
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        schemas: []
      });
    } else if (props.language === "xml") {
      // 配置 XML 语言的验证（这里示例不进行验证）
      // 注意：Monaco Editor 默认没有 XML 语言的验证，需要额外插件支持。
    }

    // 监听编辑器内容变化并触发 update:modelValue 事件
    editorInstance.onDidChangeModelContent(() => {
      emits("update:modelValue", editorInstance!.getValue());
    });
  }
};

onMounted(() => {
  initializeEditor();
});

// 监听 props.language 和 props.modelValue 的变化，动态更新编辑器配置
watch(
  () => props.language,
  newLanguage => {
    if (editorInstance) {
      monaco.editor.setModelLanguage(editorInstance.getModel(), newLanguage);

      if (newLanguage === "json") {
        monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
          validate: true,
          schemas: []
        });
      } else if (newLanguage === "xml") {
        // 配置 XML 语言的验证（这里示例不进行验证）
        // 注意：Monaco Editor 默认没有 XML 语言的验证，需要额外插件支持。
      }
    }
  }
);

watch(
  () => props.modelValue,
  newValue => {
    if (editorInstance && newValue !== editorInstance.getValue()) {
      editorInstance.setValue(newValue);
    }
  }
);

// 监听 globalStore.isDark 的变化，动态更新编辑器主题
watch(
  () => globalStore.isDark,
  isDark => {
    if (editorInstance) {
      monaco.editor.setTheme(isDark ? "vs-dark" : "vs");
    }
  }
);

onBeforeUnmount(() => {
  if (editorInstance) {
    editorInstance.dispose();
  }
});
</script>

<style scoped>
div[ref="editorRef"] {
  border: 1px solid #dddddd;
}
</style>
