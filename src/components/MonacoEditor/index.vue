<template>
  <div ref="editorContainer" class="editor-container"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, PropType } from "vue";
import * as monaco from "monaco-editor";

export default defineComponent({
  name: "MonacoEditor",
  props: {
    value: {
      type: String,
      required: true
    },
    language: {
      type: String,
      required: true
    },
    options: {
      type: Object as PropType<monaco.editor.IStandaloneEditorConstructionOptions>,
      default: () => ({})
    }
  },
  emits: ["update:value"],
  setup(props, { emit }) {
    const editorContainer = ref<HTMLDivElement | null>(null);
    let editor: monaco.editor.IStandaloneCodeEditor | null = null;

    onMounted(() => {
      if (editorContainer.value) {
        editor = monaco.editor.create(editorContainer.value, {
          value: props.value,
          language: props.language,
          ...props.options
        });

        editor.onDidChangeModelContent(() => {
          const value = editor!.getValue();
          emit("update:value", value);
        });
      }
    });

    return {
      editorContainer
    };
  }
});
</script>

<style scoped>
.editor-container {
  width: 100%;
  height: 100%;
}
</style>
