<template>
  <div id="userLoginView">
    <h2>注册SmartQA</h2>
    <a-form
      :model="form"
      :style="{ width: '400px', margin: '0 auto' }"
      @submit="handleSubmit"
    >
      <a-form-item field="username" hide-label>
        <a-input
          class="input"
          size="large"
          v-model="form.userAccount"
          placeholder="用户名"
        />
      </a-form-item>
      <a-form-item field="password" hide-label>
        <a-input
          class="input"
          type="password"
          size="large"
          v-model="form.userPassword"
          placeholder="密码"
        />
      </a-form-item>
      <a-form-item field="checkPassword" hide-label>
        <a-input
          class="input"
          type="password"
          size="large"
          v-model="form.checkPassword"
          placeholder="确认密码"
        />
      </a-form-item>
      <a-form-item hide-label>
        <a-button
          class="loginButton"
          html-type="submit"
          type="primary"
          shape="round"
          size="large"
        >
          注册
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useLoginUserStore } from "@/store/userStore";
import { Message } from "@arco-design/web-vue";
import { useRouter } from "vue-router";
import { userRegister } from "@/api/userController";

const router = useRouter();
const loginUserStore = useLoginUserStore();

const form = reactive({
  userAccount: "",
  userPassword: "",
  checkPassword: "",
  // eslint-disable-next-line no-undef
} as API.UserRegisterRequest);
const handleSubmit = async () => {
  const res = await userRegister(form);
  if (res.data.code === 0) {
    loginUserStore.fetchLoginUser().then(() => {
      Message.success("注册成功");
      router.push({ path: "/user/login", replace: true });
    });
  } else {
    Message.error(res.data.message as string);
  }
};
</script>

<style scoped>
#userLoginView {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.loginButton {
  width: 80%;
  margin: 10px auto 0;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
}

.input {
  width: 80%;
  margin: 0 auto;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
}
</style>
