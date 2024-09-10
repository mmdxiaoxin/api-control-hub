import { defineStore } from "pinia";
import { UserState } from "@/stores/interface";
import piniaPersistConfig from "@/stores/helper/persist";
import { getUserInfoApi } from "@/api/modules/auth";

export const useUserStore = defineStore({
  id: "apiHub-user",
  state: (): {
    userInfo: {
      phone: string;
      name: string;
      description: string;
      avatar: string;
      email: string;
    };
    token: string;
  } => ({
    token: "",
    userInfo: {
      name: "",
      email: "",
      phone: "",
      avatar: "",
      description: ""
    }
  }),
  getters: {
    userInfoGet: state => state.userInfo,
    tokenGet: state => state.token
  },
  actions: {
    // Set Token
    setToken(token: string) {
      this.token = token;
    },
    // Set setUserInfo
    setUserInfo(userInfo: UserState["userInfo"]) {
      this.userInfo = userInfo;
    },
    async getUserInfo() {
      const { data } = await getUserInfoApi();
      this.setUserInfo(data);
    }
  },
  persist: piniaPersistConfig("apiHub-user")
});
