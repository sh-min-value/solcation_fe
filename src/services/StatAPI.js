import apiClient from './api';

// 통계 페이지 관련 API
export const statAPI = {
  // 완료한 여행 조회
  getFinishedTravels: groupId =>
    apiClient.get(`/groups/${groupId}/stats/finished-travels`),

  // 여행 총 경비 조회
  getTotalSpent: (groupId, travelId) =>
    apiClient.get(`/groups/${groupId}/stats/${travelId}/total-spent`),

  // 여행 카테고리별 소비 통계 조회
  getCategorySpent: (groupId, travelId) =>
    apiClient.get(`/groups/${groupId}/stats/${travelId}/category-spent`),

  // 여행 인당 소비 통계 비교
  getCompareSpentPerPerson: (groupId, travelId) =>
    apiClient.get(`/groups/${groupId}/stats/${travelId}/compare`),

  // 여행 카테고리별 소비 통계 비교
  getCompareSpentCategory: (groupId, travelId) =>
    apiClient.get(`/groups/${groupId}/stats/${travelId}/category-compare`),

  // AI 여행 인사이트 조회
  getInsight: (groupId, travelId) =>
    apiClient.get(`/groups/${groupId}/stats/api/${travelId}/insight`),

  // 여행 계획 상 소비와 실제 소비 비교 조회
  getComparePlanActual: (groupId, travelId) =>
    apiClient.get(`/groups/${groupId}/stats/${travelId}/plan-actual-compare`),

  // 여행 계획 총 경비 조회
  getTotalPlanSpent: (groupId, travelId) =>
    apiClient.get(`/groups/${groupId}/stats/${travelId}/plan-spent`),

  // 전체 여행 소비 분석 조회
  getAllTravelStats: groupId =>
    apiClient.get(`/groups/${groupId}/stats/plan_total`),
};
