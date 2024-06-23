// @ts-ignore
/* eslint-disable */
import request from '@/utils/request';

/** 此处后端没有提供注释 GET /app/statistics/answer_count */
export async function getAppAnswerCount(options?: { [key: string]: any }) {
  return request<API.BaseResponseListAppAnswerCountDTO>('/app/statistics/answer_count', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /app/statistics/answer_result_count */
export async function getAppAnswerResultCount(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAppAnswerResultCountParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseListAppAnswerResultCountDTO>(
    '/app/statistics/answer_result_count',
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    },
  );
}
