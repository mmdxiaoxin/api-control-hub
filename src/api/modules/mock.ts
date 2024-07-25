import { Mock, ResPage } from "@/api/interface";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name mock服务模块
 */

// 获取mock接口列表
export const getMockList = (params: Mock.ReqParams) => {
  return http.post<ResPage<Mock.ResList>>(PORT1 + `/mock/list`, params);
};

// 获取树形mock接口列表
export const getMockTreeList = (params: Mock.ReqParams) => {
  return http.post<ResPage<Mock.ResList>>(PORT1 + `/mock/tree/list`, params);
};

// 获取mock接口状态字典
export const getMockStatus = () => {
  return http.get<Mock.ResStatus[]>(PORT1 + `/mock/status`);
};

// 删除mock接口
export const deleteMock = (params: { id: string[] }) => {
  return http.post(PORT1 + `/mock/delete`, params);
};

// 切换接口状态
export const changeMockStatus = (params: {
  id: string;
  mockStatus: number;
}) => {
  return http.post(PORT1 + `/mock/change`, params);
};

// 添加mock接口
export const addMock = (params: Mock.ReqAdd) => {
  return http.post(PORT1 + `/mock/add`, params);
};

// 更新mock接口
export const updateMock = (params: Mock.ReqAdd) => {
  return http.post(PORT1 + `/mock/update`, params);
};
