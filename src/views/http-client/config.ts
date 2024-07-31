// 响应体格式化显示配置
export const ResFileOption = [
  { value: "JSON", label: "JSON" },
  { value: "XML", label: "XML" },
  { value: "HTML", label: "HTML" },
  { value: "TEXT", label: "TEXT" },
  { value: "AUTO", label: "AUTO" }
];

export const bodyOptions = [
  { label: "none", value: 1 },
  { label: "form-data", value: 2 },
  { label: "x-www-form-urlencoded", value: 3 },
  { label: "json", value: 4 },
  { label: "xml", value: 5 },
  { label: "raw", value: 6 }
];

export const authOptions = [
  { label: "从父级继承", value: "inherit" },
  { label: "No Auth", value: "none" },
  { label: "Basic Auth", value: "basic" },
  { label: "Bearer Token", value: "bearer" },
  { label: "JWT Bearer", value: "bearer-jwt" },
  { label: "OAuth 1.0", value: "oauth1" },
  { label: "OAuth 2.0", value: "oauth2" },
  { label: "API Key", value: "apikey" },
  { label: "Digest Auth", value: "digest" },
  { label: "AWS Signature", value: "aws" }
];

export const methods = [
  { label: "GET", value: "GET", color: "#67C23A" },
  { label: "POST", value: "POST", color: "#409EFF" },
  { label: "DELETE", value: "DELETE", color: "#F56C6C" },
  { label: "PUT", value: "PUT", color: "#E6A23C" },
  { label: "PATCH", value: "PATCH", color: "#E6A23C" },
  { label: "OPTIONS", value: "OPTIONS", color: "#909399" },
  { label: "HEAD", value: "HEAD", color: "#F7BA2A" },
  { label: "CONNECT", value: "CONNECT", color: "#2D8CF0" },
  { label: "TRACE", value: "TRACE", color: "#1F1F1F" }
];

export const labelStyles: { [key: string]: string } = {
  GET: "#67C23A",
  POST: "#409EFF",
  DELETE: "#F56C6C",
  PUT: "#E6A23C",
  PATCH: "#E6A23C",
  OPTIONS: "#909399",
  HEAD: "#F7BA2A",
  CONNECT: "#2D8CF0",
  TRACE: "#1F1F1F"
};
