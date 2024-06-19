import { RouteRecordRaw } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import UserLayout from "@/layouts/UserLayout.vue";
import NoAuthView from "@/views/NoAuthView.vue";
import { AccessEnum } from "@/access/accessEnum";
import UserLoginView from "@/views/user/UserLoginView.vue";
import UserRegisterView from "@/views/user/UserRegisterView.vue";
import AdminUserView from "@/views/admin/AdminUserView.vue";
import AdminAppView from "@/views/admin/AdminAppView.vue";
import AdminQuestionView from "@/views/admin/AdminQuestionView.vue";
import AdminScoringResultView from "@/views/admin/AdminScoringResultView.vue";
import AdminUserAnswerView from "@/views/admin/AdminUserAnswerView.vue";
import AppDetailView from "@/views/AppDetailView.vue";
import AddAppView from "@/views/AddAppView.vue";
import AddQuestionView from "@/views/AddQuestionView.vue";
import AddScoringResultView from "@/views/AddScoringResultView.vue";
import AnswerDoView from "@/views/AnswerDoView.vue";
import AnswerResultView from "@/views/AnswerResultView.vue";
import AnswerMyView from "@/views/AnswerMyView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "主页",
    component: HomeView,
  },
  {
    path: "/app/detail/:id",
    name: "APP详情",
    props: true,
    component: AppDetailView,
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: "/add/app",
    name: "创建App",
    props: true,
    component: AddAppView,
  },
  {
    path: "/add/app/:id",
    name: "修改应用",
    props: true,
    component: AddAppView,
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: "/add/question/:id",
    name: "创建问题",
    props: true,
    component: AddQuestionView,
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: "/add/scoringResult/:id",
    name: "创建评分结果",
    props: true,
    component: AddScoringResultView,
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: "/answer/do/:appId",
    name: "答题",
    props: true,
    component: AnswerDoView,
    meta: {
      hideInMenu: true,
      access: AccessEnum.LOGIN,
    },
  },
  {
    path: "/answer/result/:id",
    name: "答题结果",
    props: true,
    component: AnswerResultView,
    meta: {
      hideInMenu: true,
      access: AccessEnum.LOGIN,
    },
  },
  {
    path: "/answer/my",
    name: "我的答题",
    component: AnswerMyView,
    meta: {
      access: AccessEnum.LOGIN,
    },
  },
  {
    path: "/noAuth",
    name: "无权限",
    component: NoAuthView,
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: "/admin",
    name: "管理页面",
    component: AdminUserView,
    meta: {
      access: AccessEnum.NOT_LOGIN,
    },
  },
  {
    path: "/admin/app",
    name: "应用",
    component: AdminAppView,
    meta: {
      access: AccessEnum.NOT_LOGIN,
    },
  },
  {
    path: "/admin/question",
    name: "问题",
    component: AdminQuestionView,
    meta: {
      access: AccessEnum.NOT_LOGIN,
    },
  },
  {
    path: "/admin/scoringResult",
    name: "评分结果",
    component: AdminScoringResultView,
    meta: {
      access: AccessEnum.NOT_LOGIN,
    },
  },
  {
    path: "/admin/userAnswer",
    name: "用户答案",
    component: AdminUserAnswerView,
    meta: {
      access: AccessEnum.NOT_LOGIN,
    },
  },
  {
    path: "/user",
    name: "User",
    component: UserLayout,
    meta: {
      hideInMenu: true,
    },
    children: [
      {
        path: "login",
        name: "Login",
        component: UserLoginView,
      },
      {
        path: "register",
        name: "Register",
        component: UserRegisterView,
      },
    ],
  },
];

export default routes;
