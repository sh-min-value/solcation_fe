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
  getCardInfo: (groupId, sacPk) =>
    apiClient.get(`/group/${groupId}/account/card/${sacPk}/info`),
  cancelCard: (groupId, sacPk) =>
    apiClient.post(`/group/${groupId}/account/card/${sacPk}/cancel`),
  getTransactionsCard: (groupId, yearMonth) => {
    return apiClient.get(
      `/group/${groupId}/account/transaction/card?yearMonth=${yearMonth}`
    );
  },
};
