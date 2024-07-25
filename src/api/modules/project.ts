import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";
import { ProjectServer } from "@/api/interface";

/**
 * @name 项目管理服务模块
 */

//获取项目列表(含参)
export const getProjectList = (params: { teamId: string }) => {
  return http.post<ProjectServer.ResProjectItem[]>(
    PORT1 + `/project/list`,
    params
  );
};

//项目添加
export const addProject = (params: ProjectServer.ResProjectItem) => {
  return http.post(PORT1 + `/project/add`, params);
};

//项目修改
export const updateProject = (params: ProjectServer.ResProjectItem) => {
  return http.post(PORT1 + `/project/update`, params);
};

//收藏项目
export const starProject = (params: { id: string }) => {
  return http.post(PORT1 + `/project/star`, params);
};

//删除项目
export const deleteProject = (params: { id: string[] }) => {
  return http.post(PORT1 + `/project/delete`, params);
};

//获取工作台信息
export const getWorkBenchApi = () => {
  return http.post<ProjectServer.ResWorkBench>(PORT1 + `/project/workbench`);
};

//获取项目详情
export const getProjectDetail = (params: { projectId: string }) => {
  return http.post<ProjectServer.ResProjectDetail>(
    PORT1 + `/project/detail`,
    params
  );
};
