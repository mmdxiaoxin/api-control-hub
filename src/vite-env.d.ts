/// <reference types="vite/client" />

// 定义 Vue 中的 JSX 元素的类型
declare namespace JSX {
  interface IntrinsicElements {
    [elem: string]: any;
  }
}
