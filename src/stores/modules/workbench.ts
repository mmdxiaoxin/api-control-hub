import { defineStore } from "pinia";
import piniaPersistConfig from "@/stores/helper/persist";
import { getWorkBenchApi } from "@/api/modules/project";

export const useWorkbenchStore = defineStore({
  id: "apiHub-work-place",
  state: (): {
    projectId: string;
    projectName: string;
    teamId: string;
    teamName: string;
    currentRole: string;
    curNickName: string;
  } => ({
    projectId: "",
    projectName: "",
    teamId: "",
    teamName: "",
    currentRole: "",
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
      currentRole?: string,
      curNickName?: string
    ) {
      this.projectId = projectId;
      this.teamId = teamId;
      this.projectName = projectName;
      this.teamName = teamName;
      typeof currentRole === "string" ? (this.currentRole = currentRole) : (this.currentRole = "游客");
      typeof curNickName === "string" ? (this.curNickName = curNickName) : (this.curNickName = "");
    },
    async getWorkBench() {
      const { data } = await getWorkBenchApi();
      this.setWorkPlace(data.projectId, data.teamId, data.projectName, data.teamName, data.currentRole, data.curNickName);
    }
  },
  persist: piniaPersistConfig("apiHub-work-place")
});
