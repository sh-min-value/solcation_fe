import apiClient from './api';

export const TransactionAPI = {
  getDetail: (groupId, satPk) =>
    apiClient.get(`/group/${groupId}/transaction/detail?satPk=${satPk}`),
  updateTC: (groupId, data) =>
    apiClient.post(`/group/${groupId}/transaction/update-category`, data),
  updateMemo: (groupId, data) =>
    apiClient.post(`/group/${groupId}/transaction/update-memo`, data),
  updateDetail: (groupId, data) =>
    apiClient.post(`/group/${groupId}/transaction/update-transaction`, data),
};
