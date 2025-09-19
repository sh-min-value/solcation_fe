import apiClient from './api';

export const TransactionAPI = {
  getDetail: (groupId, satPk) =>
    apiClient.get(`/group/${groupId}/account/transaction/${satPk}/detail`),
  updateTC: (groupId, satPk, data) =>
    apiClient.post(
      `/group/${groupId}/account/transaction/${satPk}/update-category`,
      data
    ),
  updateMemo: (groupId, satPk, data) =>
    apiClient.post(
      `/group/${groupId}/account/transaction/${satPk}/update-memo`,
      data
    ),
  updateDetail: (groupId, satPk, data) =>
    apiClient.post(
      `/group/${groupId}/account/transaction/${satPk}/update-transaction`,
      data
    ),
};
