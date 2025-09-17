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

  // 여행 인당 소비 통계 비교교
  getCompareSpentPerPerson: (groupId, travelId) =>
    apiClient.get(`/groups/${groupId}/stats/${travelId}/compare`),
};
