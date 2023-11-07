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
    curNickName: string;
  } => ({
    projectId: "0000001",
    projectName: "农业监控系统",
    teamId: "000001",
    teamName: "个人空间",
    currentRole: "团队拥有者",
    curNickName: ""
  }),
  getters: {},
  actions: {
    // Set WorkPlace
    setWorkPlace(
      projectId: string,
      teamId: string,
      projectName: string,
      teamName: string,
      currentRole: string,
      curNickName: string
    ) {
      this.projectId = projectId;
      this.teamId = teamId;
      this.projectName = projectName;
      this.teamName = teamName;
      this.currentRole = currentRole;
      this.curNickName = curNickName;
    }
  },
  persist: piniaPersistConfig("apiHub-work-place")
});
