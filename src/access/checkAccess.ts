import { AccessEnum } from "@/access/accessEnum";

/**
 * 检查权限（判断当前登录用户是否具有某个权限）
 * @param loginUser 当前登录用户
 * @param needAccess 需要检查的权限
 * @returns 是否具有权限
 */
const checkAccess = (
  loginUser: API.LoginUserVO,
  needAccess = AccessEnum.NOT_LOGIN
) => {
  const loginUserAccess = loginUser?.userRole ?? AccessEnum.NOT_LOGIN;

  switch (needAccess) {
    case AccessEnum.NOT_LOGIN:
      return true;
    case AccessEnum.ADMIN:
      return loginUserAccess === AccessEnum.ADMIN;
    case AccessEnum.LOGIN:
      return loginUserAccess !== AccessEnum.NOT_LOGIN;
    default:
      return false;
  }
};

export default checkAccess;
