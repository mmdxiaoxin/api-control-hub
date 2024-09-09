import { Register, Result } from "@/api/interface";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 注册模块
 */
// 用户登录
export const RegisterApi = (params: Register.ReqRegisterForm) => {
  return http.post<Result>(PORT1 + `/register`, params, {
    loading: true
  });
};
