import { defineStore } from "pinia";
import { UserState } from "@/stores/interface";
import piniaPersistConfig from "@/stores/helper/persist";

export const useUserStore = defineStore({
  id: "apiHub-user",
  state: (): {
    userInfo: { phone: string; name: string; description: string; avatar: string; email: string };
    token: string;
  } => ({
    token: "",
    userInfo: {
      name: "小新AI",
      email: "782446723@qq.com",
      phone: "18888888888",
      avatar: "src/assets/images/avatar.gif",
      description: "嗨嗨嗨，测试"
    }
  }),
  getters: {},
  actions: {
    // Set Token
    setToken(token: string) {
      this.token = token;
    },
    // Set setUserInfo
    setUserInfo(userInfo: UserState["userInfo"]) {
      this.userInfo = userInfo;
    }
  },
  persist: piniaPersistConfig("apiHub-user")
});
