import { defineStore } from "pinia";
import piniaPersistConfig from "@/stores/helper/persist";

export const useWorkPlaceStore = defineStore({
  id: "apiHub-work-place",
  state: (): {
    projectId: string;
    projectName: string;
    teamId: string;
    teamName: string;
    currentRole: string;
  } => ({
    projectId: "0000001",
    projectName: "测试项目1",
    teamId: "000001",
    teamName: "测试团队",
    currentRole: "管理员"
  }),
  getters: {},
  actions: {
    // Set WorkPlace
    setWorkPlace(projectId: string, teamId: string, projectName: string, teamName: string, currentRole: string) {
      this.projectId = projectId;
      this.teamId = teamId;
      this.projectName = projectName;
      this.teamName = teamName;
      this.currentRole = currentRole;
    }
  },
  persist: piniaPersistConfig("apiHub-work-place")
});
