import { reactive } from "vue";

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
