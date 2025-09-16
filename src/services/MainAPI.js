import apiClient from './api';

// 메인 페이지 관련 API
export const mainAPI = {
  // 내 그룹 목록 조회
  getMyGroups: () => apiClient.get('/main/my-groups'),
  // 사용자 프로필 조회
  getUserProfile: () => apiClient.get('/main/mypage'),
  // 사용자 알림 조회
  getUserNotifications: () => apiClient.get('/main/notification-preview'),
  // 해당 달 계획 조회
  getMonthlyPlans: (year, month) =>
    apiClient.get(`/main/monthly-plans?year=${year}&month=${month}`),
};
