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
