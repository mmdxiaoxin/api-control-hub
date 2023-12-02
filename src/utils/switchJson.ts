import { reactive, toRaw } from "vue";

// 将 JSON 字符串转换为 reactive 对象
export const JSONToReactive = (jsonString: string): Record<string, any> | null => {
  try {
    const parsedObject = JSON.parse(jsonString);

    if (typeof parsedObject === "object" && parsedObject !== null) {
      return reactive(parsedObject);
    }

    return null;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null;
  }
};

// 将 reactive 转换为 JSON 字符串
export const reactiveToJSON = (obj: Record<string, any>): string => {
  const plainObject = toRaw(obj);
  return JSON.stringify(plainObject);
};
