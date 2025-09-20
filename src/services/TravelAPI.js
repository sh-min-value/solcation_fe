import apiClient from './api';

// 여행 관련 API
export const TravelAPI = {
    getTravelList: (searchTerm = '', groupId, status = null) => {
      const queryParams = new URLSearchParams();
      
      if (searchTerm) {
        queryParams.append('searchTerm', searchTerm);
      }
      
      if (status) {
        queryParams.append('status', status);
      }
      
      const params = queryParams.toString() ? `?${queryParams.toString()}` : '';
      return apiClient.get(`/group/${groupId}/travel/list${params}`);
    },
    getTravel: (travelId, groupId) => apiClient.get(`/group/${groupId}/travel/${travelId}`),
    createTravel: (travel, groupId) => apiClient.postMultipart(`/group/${groupId}/travel/new`, travel),
    getTravelDetail: (travelId, groupId) => apiClient.get(`/group/${groupId}/travel/${travelId}/plans`),
  };
  
export const planDetailAPI = {
    joinPlanEdit: (travelId, groupId, data) => apiClient.post(`/group/${groupId}/travel/${travelId}/edit/join`, data),
    leavePlanEdit: (travelId, groupId, data) => apiClient.post(`/group/${groupId}/travel/${travelId}/edit/leave`, data),
    savePlanEdit: (travelId, groupId, data) => apiClient.post(`/group/${groupId}/travel/${travelId}/edit/save`, data),
    createPlanDetail: (travelId, groupId, data) => apiClient.post(`/group/${groupId}/travel/${travelId}/plan/new`, data),
};

export const travelCreateAPI = {
    createPlan: (groupId, data) => apiClient.post(`/group/${groupId}/travel/new`, data),
};
  export default TravelAPI;
  