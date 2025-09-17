import apiClient from './api';

export const AlarmAPI = {
  getInvitationList: () => apiClient.get(`/notification/list/invitation`),
  getRecent7DaysList: (pageNo, pageSize) =>
    apiClient.get(
      `/notification/list/recent/7days?pageNo=${pageNo}&pageSize=${pageSize}`
    ),
  getRecent30DaysList: (pageNo, pageSize) =>
    apiClient.get(
      `/notification/list/recent/30days?pageNo=${pageNo}&pageSize=${pageSize}`
    ),
  checkNoti: pnPk => apiClient.post(`/notification/check?pnPk=${pnPk}`),
  updateInvite: data => apiClient.post(`/notification/update-invite`, data),
};
