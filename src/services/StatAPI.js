import apiClient from './api';

// 통계 페이지 관련 API
export const statAPI = {
  // 완료한 여행 조회
  getFinishedTravels: groupId =>
    apiClient.get(`/groups/${groupId}/stats/finished-travels`),
};
