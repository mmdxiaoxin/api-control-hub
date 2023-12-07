export const getRoleTagType = (role: string): "success" | "warning" | "info" | "danger" | "" => {
  switch (role) {
    case "管理员":
      return "info"; // 管理员样式
    case "团队拥有者":
      return "warning"; // 团队拥有者样式
    default:
      return "info"; // 普通成员样式
  }
};

export const getMethodTagType = (method: string): "success" | "warning" | "info" | "danger" | "" => {
  switch (method) {
    case "GET":
      return "success";
    case "POST":
      return "";
    case "PUT":
      return "warning";
    case "DELETE":
      return "danger";
    default:
      return "info";
  }
};

export const getOptionStyle = (method: string) => {
  switch (method) {
    case "GET":
      return { color: "#67C23A" }; // Green color for GET
    case "POST":
      return { color: "#409EFF" }; // Blue color for POST
    case "DELETE":
      return { color: "#F56C6C" }; // Red color for DELETE
    case "PUT":
      return { color: "#E6A23C" }; // Yellow color for PUT
    default:
      return {}; // Default color
  }
};
