import { ref } from "vue";
import { defineStore } from "pinia";
import { getLoginUser } from "@/api/userController";
import { AccessEnum } from "@/access/accessEnum";

/**
 * 登录用户信息全局状态
 */
export const useLoginUserStore = defineStore("counter", () => {
  const loginUser = ref<API.LoginUserVO>({
    userName: "未登录",
  });

  function setLoginUser(user: API.LoginUserVO) {
    loginUser.value = user;
  }

  async function fetchLoginUser() {
    const res = await getLoginUser();
    if (res.data.code === 0 && res.data.data) {
      setLoginUser(res.data.data);
    } else {
      setLoginUser({ userRole: AccessEnum.NOT_LOGIN });
    }
  }

  return { loginUser, setLoginUser, fetchLoginUser };
});
