import { defineStore } from "pinia";
import piniaPersistConfig from "@/stores/helper/persist";

export const useWorkPlaceStore = defineStore({
  id: "apiHub-work-place",
  state: (): {
    projectId: string;
    projectName: string;
    teamId: string;
    teamName: string;
  } => ({
    projectId: "",
    projectName: "",
    teamId: "",
    teamName: ""
  }),
  getters: {},
  actions: {
    // Set WorkPlace
    setWorkPlace(projectId: string, teamId: string, projectName: string, teamName: string) {
      this.projectId = projectId;
      this.teamId = teamId;
      this.projectName = projectName;
      this.teamName = teamName;
    }
  },
  persist: piniaPersistConfig("apiHub-work-place")
});
