// 审核状态枚举
export enum ReviewStatusEnum {
  REVIEWING = 0,
  PASS = 1,
  REJECT = 2,
}

export const ReviewStatusMap = {
  0: "待审核",
  1: "通过",
  2: "拒绝",
};

// 应用类型枚举
export enum AppTypeEnum {
  SCORE = 0,
  TEST = 1,
}

export const AppTypeMap = {
  0: "得分类",
  1: "测评类",
};

// 评分策略枚举
export enum ScoringStrategyEnum {
  CUSTOM = 0,
  AI = 1,
}

export const ScoringStrategyMap = {
  0: "自定义",
  1: "AI",
};
