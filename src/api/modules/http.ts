import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";
import { HttpServer } from "@/api/interface";

/**
 * @name 接口管理模块
 */

// 获取项目列表
export const getHttpCollectionList = (params: HttpServer.ReqHttpParams) => {
  return http.post<HttpServer.ResCollectionList[]>(PORT1 + `/http/collection/list`, params);
};

//获取接口配置
export const getHttpConfig = (params: HttpServer.ReqHttpConfig) => {
  return http.post<HttpServer.ResHttpConfig>(PORT1 + `/http/config`, params);
};

//更新接口配置
export const updateHttpConfig = (params: HttpServer.ReqHttpConfig) => {
  return http.post<HttpServer.ResHttpConfig>(PORT1 + `/http/config/update`, params);
};

//添加接口配置
export const addHttpConfig = (params: HttpServer.ReqHttpConfig) => {
  return http.post<HttpServer.ResHttpConfig>(PORT1 + `/http/config/add`, params);
};

//删除接口配置
export const deleteHttpConfig = (params: HttpServer.ReqHttpConfig) => {
  return http.post<HttpServer.ResHttpConfig>(PORT1 + `/http/config/delete`, params);
};
