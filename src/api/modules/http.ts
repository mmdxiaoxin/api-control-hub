import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";
import { Http } from "@/api/interface";

/**
 * @name 接口管理模块
 */

// 获取接口树形列表
export const getHttpTreeList = (params: { projectId: string }) => {
  return http.post<Http.ResTree>(PORT1 + `/http/tree/list`, params);
};

//获取接口配置
export const getHttpConfigApi = (params: { apiId: string }) => {
  return http.post<Http.ResConfig>(PORT1 + `/http/config`, params);
};

//更新接口配置
export const updateHttpConfig = (params: Http.ReqUpdate) => {
  return http.post<Http.ResConfig>(PORT1 + `/http/config/update`, params);
};

//添加接口配置
export const addHttpConfig = (params: Http.ReqAdd) => {
  return http.post<Http.ResConfig>(PORT1 + `/http/config/add`, params);
};

//删除接口配置
export const deleteHttpConfig = (params: { apiId: string }) => {
  return http.post<Http.ResConfig>(PORT1 + `/http/config/delete`, params);
};

//获取接口目录
export const getHttpDirectory = (params: { directoryId: string }) => {
  return http.post<Http.ResDirectory>(PORT1 + `/http/directory`, params);
};
