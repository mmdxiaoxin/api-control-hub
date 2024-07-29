import { defineComponent, onMounted, ref, PropType } from "vue";
import { monaco } from "@/lib/monaco";

export default defineComponent({
  name: "MonacoEditor",
  props: {
    value: {
      type: String as PropType<string>,
      required: true
    },
    language: {
      type: String as PropType<string>,
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

    return () => <div ref={editorContainer} class="editor-container"></div>;
  }
});
