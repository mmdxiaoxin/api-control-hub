<template>
  <div class="login-container flx-center">
    <div class="login-box">
      <SwitchDark class="dark" />
      <div class="login-left" v-if="globalStore.isDark">
        <img class="login-left-img" src="@/assets/images/login_left_dark.svg" alt="login" />
      </div>
      <div class="login-left" v-else>
        <img class="login-left-img" src="@/assets/images/login_left_sunny.svg" alt="login" />
      </div>
      <div class="login-form">
        <div class="login-logo" v-if="globalStore.isDark">
          <img class="login-icon" src="@/assets/images/logo_dark.svg" alt="" />
          <h2 class="logo-text">HTTP接口管理平台</h2>
        </div>
        <div class="login-logo" v-else>
          <img class="login-icon" src="@/assets/images/logo_sunny.svg" alt="" />
          <h2 class="logo-text">HTTP接口管理平台</h2>
        </div>
        <LoginForm />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="login">
import LoginForm from "./components/LoginForm.vue";
import SwitchDark from "@/components/SwitchDark/index.vue";
import { useGlobalStore } from "@/stores/modules/global";

const globalStore = useGlobalStore();
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
