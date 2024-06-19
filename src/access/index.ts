import router from "@/router";
import { useLoginUserStore } from "@/store/userStore";
import checkAccess from "@/access/checkAccess";
import { AccessEnum } from "@/access/accessEnum";

// 进入页面前进行权限校验
router.beforeEach(async (to, from, next) => {
  const loginUserStore = useLoginUserStore();
  let loginUser = loginUserStore.loginUser;

  // 如果用户未尝试过登录，才自动登录
  if (!loginUser || !loginUser.userRole) {
    await loginUserStore.fetchLoginUser();
    loginUser = loginUserStore.loginUser;
  }

  // 未登录且访问非登录页
  const needAccess = (to.meta?.access as AccessEnum) ?? AccessEnum.NOT_LOGIN;

  // 要跳转的页面必须登录
  if (needAccess !== AccessEnum.NOT_LOGIN) {
    // 用户不存在或用户未登录
    if (
      !loginUser ||
      !loginUser.userRole ||
      loginUser.userRole === AccessEnum.NOT_LOGIN
    ) {
      next({ path: "/user/login?redirect=" + to.fullPath });
    }
    // 用户已登录但是没有权限
    else if (!checkAccess(loginUser, needAccess)) {
      next({ path: "/noAuth" });
      return;
    }
  }

  next();
});
