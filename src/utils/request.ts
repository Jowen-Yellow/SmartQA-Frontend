import axios from "axios";
import errorCode from "@/utils/errorCode";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8101",
  timeout: 30000,
  withCredentials: true,
});

// 添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    const { data } = response;

    if (data.code === errorCode.NOT_LOGIN_ERROR) {
      // 如果请求不是获取当前登录用户信息，且当前不在登录页，则跳转到登录页
      if (
        !response.request.responseURL.includes("/user/get/login") &&
        !window.location.pathname.includes("/user/login")
      ) {
        window.location.href =
          "/user/login?redirect=" + response.request.responseURL;
      }
    }
    return response;
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default axiosInstance;
