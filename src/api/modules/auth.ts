import { Login } from "@/api/interface";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 登录模块
 */
// 用户登录
export const loginApi = (params: { username: string; password: string }) => {
  return http.post<Login.ResLogin>(PORT1 + `/login`, params, {
    loading: false
  });
};

// 获取菜单列表
export const getAuthMenuListApi = () => {
  return http.get<Menu.MenuOptions[]>(PORT1 + `/menu/list`, {}, { loading: false });
};

// 获取按钮权限
export const getAuthButtonListApi = () => {
  return http.get<Login.ResAuthButtons>(PORT1 + `/auth/buttons`, {}, { loading: false });
};

// 用户退出登录
export const logoutApi = () => {
  return http.post(PORT1 + `/logout`);
};

//获取用户信息
export const getUserInfoApi = () => {
  return http.post<Login.ResUserInfo>(PORT1 + `/user/info`);
};
