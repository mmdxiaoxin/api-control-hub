// 响应体格式化显示配置
export const ResFileOption = [
  { value: "JSON", label: "JSON" },
  { value: "XML", label: "XML" },
  { value: "HTML", label: "HTML" },
  { value: "TEXT", label: "TEXT" },
  { value: "AUTO", label: "AUTO" }
];

export const requestMethodOptions: { label: string; value: string }[] = [
  { label: "GET", value: "GET" }, // 从服务器获取资源。用于请求数据而不对数据进行更改。例如，从服务器获取网页、图片等。
  { label: "POST", value: "POST" }, // 向服务器发送数据以创建新资源。常用于提交表单数据或上传文件。发送的数据包含在请求体中。
  { label: "DELETE", value: "DELETE" }, // 从服务器删除指定的资源。请求中包含要删除的资源标识符。
  { label: "PUT", value: "PUT" }, //向服务器发送数据以更新现有资源。如果资源不存在，则创建新的资源。与 POST 不同，PUT 通常是幂等的，即多次执行相同的 PUT 请求不会产生不同的结果。
  { label: "PATCH", value: "PATCH" }, // 对资源进行部分修改。与 PUT 类似，但 PATCH 只更改部分数据而不是替换整个资源。
  { label: "HEAD", value: "HEAD" }, // 类似于 GET，但服务器只返回响应的头部，不返回实际数据。用于检查资源的元数据（例如，检查资源是否存在，查看响应的头部信息）。
  { label: "OPTIONS", value: "OPTIONS" }, // 返回服务器支持的 HTTP 方法。用于检查服务器支持哪些请求方法，通常用于跨域资源共享（CORS）的预检请求。
  { label: "TRACE", value: "TRACE" }, // 回显服务器收到的请求，主要用于诊断。客户端可以查看请求在服务器中的处理路径。
  { label: "CONNECT", value: "CONNECT" } // 建立一个到服务器的隧道，通常用于 HTTPS 连接。客户端可以通过该隧道发送加密的数据。
];

export const bodyOptions = [
  { label: "none", value: 1 },
  { label: "form-data", value: 2 },
  { label: "x-www-form-urlencoded", value: 3 },
  { label: "json", value: 4 },
  { label: "xml", value: 5 },
  { label: "raw", value: 6 }
];
