import apiClient from './api';

// 여행 관련 API
export const travelAPI = {
    getTravelList: (searchTerm = '', groupId) => {
      const params = searchTerm ? `?searchTerm=${encodeURIComponent(searchTerm)}` : '';
      return apiClient.get(`/group/${groupId}/travel/list${params}`);
    },
    getTravel: (travelId, groupId) => apiClient.get(`/group/${groupId}/travel/${travelId}`),
    createTravel: (travel, groupId) => apiClient.post(`/group/${groupId}/travel/new`, travel),
    getTravelDetail: (travelId, groupId) => apiClient.get(`/group/${groupId}/travel/${travelId}/plans`),
  };
  
export const planDetailAPI = {
    joinPlanEdit: (travelId, groupId, data) => apiClient.post(`/group/${groupId}/travel/${travelId}/edit/join`, data),
    leavePlanEdit: (travelId, groupId, data) => apiClient.post(`/group/${groupId}/travel/${travelId}/edit/leave`, data),
    savePlanEdit: (travelId, groupId, data) => apiClient.post(`/group/${groupId}/travel/${travelId}/edit/save`, data),
};

  export default travelAPI;
  